const db = require('../config/db');

const timeToMin = (t, referenceStart = null) => {
  if (!t) {
    if (referenceStart !== null) return referenceStart + 300;
    return 0;
  }
  
  // Clean up input: trim, lowercase, and handle dots as colons
  const clean = t.toString().trim().toLowerCase().replace('.', ':');
  
  // Broaden "Selesai" detection
  if (clean.includes('selesai')) {
    return referenceStart !== null ? referenceStart + 300 : 1439;
  }
  
  // Extract first HH:mm pattern found
  const match = clean.match(/(\d{1,2}):(\d{1,2})/);
  if (!match) {
    if (referenceStart !== null) return referenceStart + 300;
    return 0;
  }
  
  const h = parseInt(match[1]) || 0;
  const m = parseInt(match[2]) || 0;
  return h * 60 + m;
};

const autoUpdateStatuses = async () => {
  try {
    const now = new Date();
    // Get WITA Time (UTC+8)
    const witaOffset = 8 * 60; // 8 hours in minutes
    const witaTime = new Date(now.getTime() + (witaOffset + now.getTimezoneOffset()) * 60000);
    
    const todayWita = new Date(witaTime.getFullYear(), witaTime.getMonth(), witaTime.getDate());
    const currentTimeStr = witaTime.getHours().toString().padStart(2, '0') + ':' + witaTime.getMinutes().toString().padStart(2, '0');
    const cm = timeToMin(currentTimeStr);

    // Helper to parse Indonesian Date String: "Senin, 30 Mar 2026"
    const parseIndoDate = (dateStr) => {
      const match = dateStr.match(/, (\d{1,2}) (\w{3}) (\d{4})/);
      if (!match) return null;
      const day = parseInt(match[1]);
      const monthStr = match[2];
      const year = parseInt(match[3]);
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
      };
      return new Date(year, monthMap[monthStr], day);
    };

    const [agendas] = await db.query('SELECT id, tanggal, pukul, status FROM agenda_ruangan');
    
    for (const agenda of agendas) {
      const agendaDate = parseIndoDate(agenda.tanggal);
      if (!agendaDate) continue;

      const timeParts = agenda.pukul.split(' - ');
      const startTime = timeParts[0];
      const endTime = timeParts[1];

      const sm = timeToMin(startTime);
      const se = timeToMin(endTime, sm);

      if (agendaDate < todayWita) {
        await db.query('UPDATE agenda_ruangan SET status = "Selesai" WHERE id = ?', [agenda.id]);
      } else if (agendaDate.getTime() === todayWita.getTime()) {
        if (cm >= se) {
          await db.query('UPDATE agenda_ruangan SET status = "Selesai" WHERE id = ?', [agenda.id]);
        } else if (agenda.status === 'Terjadwal' && cm >= sm) {
          await db.query('UPDATE agenda_ruangan SET status = "Berlangsung" WHERE id = ?', [agenda.id]);
        }
      }
    }
  } catch (error) {
    console.error('Error in autoUpdateStatuses:', error);
  }
};
const checkConflict = async (ruangan, tanggal, waktuMulai, waktuSelesai, excludeId = null) => {
  const sm = timeToMin(waktuMulai);
  const se = timeToMin(waktuSelesai, sm);
  
  // Normalisasi input untuk pencarian
  const searchRuangan = ruangan.trim();
  const searchTanggal = tanggal.trim();

  console.log(`[CHECK CONFLICT] Search for: "${searchRuangan}" on "${searchTanggal}"`);
  console.log(`[CHECK CONFLICT] New Booking: ${waktuMulai} to ${waktuSelesai} (Mins: ${sm} to ${se})`);
  
  let query = 'SELECT id, pukul, acara FROM agenda_ruangan WHERE TRIM(tempat) = ? AND TRIM(tanggal) = ?';
  let params = [searchRuangan, searchTanggal];
  
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  
  const [existing] = await db.query(query, params);
  console.log(`[CHECK CONFLICT] Found ${existing.length} matching rows.`);
  
  for (const row of existing) {
    // Split by dash variations
    const timeParts = row.pukul.split(/\s*[-–—]\s*/);
    const exsString = timeParts[0] || '';
    const exeString = timeParts[1] || '';
    
    const exs = timeToMin(exsString);
    const exe = timeToMin(exeString, exs);
    
    console.log(`[CHECK CONFLICT] ID:${row.id} | Row Pukul: "${row.pukul}" -> Parsed as: ${exs}-${exe} (New is ${sm}-${se})`);
    
    // Overlap condition: (Start1 < End2) AND (End1 > Start2)
    if (sm < exe && se > exs) {
      console.log(`[CHECK CONFLICT] !!! BENTROK DETECTED !!! with ID:${row.id} ("${row.acara}")`);
      return true;
    }
  }
  
  console.log(`[CHECK CONFLICT] SUCCESS: No overlap with any of the ${existing.length} records.`);
  return false;
};

const getAgendas = async (req, res) => {
  try {
    // Run auto-update status before fetching data
    await autoUpdateStatuses();
    
    const [rows] = await db.query('SELECT * FROM agenda_ruangan ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching agendas:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createAgenda = async (req, res) => {
  try {
    const { 
      jenisRuangan, 
      ruangan, 
      tanggal, 
      waktuMulai, 
      waktuSelesai, 
      namaAcara, 
      pelaksana, 
      dihadiri 
    } = req.body;

    // Check for double booking
    const hasConflict = await checkConflict(ruangan, tanggal, waktuMulai, waktuSelesai);
    if (hasConflict) {
      return res.status(400).json({ message: 'Ruangan sudah di booking pada jam tersebut. Silakan pilih jam atau ruangan lain.' });
    }

    // Map into DB structure
    const type = jenisRuangan === 'bpkad' ? 'BPKAD' : 'PEMKOT';
    // Format hari from tanggal (e.g. "Senin, 16 Mar 2026" -> "SENIN")
    const hari = tanggal.split(',')[0].toUpperCase();
    const pukul = `${waktuMulai} - ${waktuSelesai}`;
    
    const query = `
      INSERT INTO agenda_ruangan (hari, tanggal, tempat, pukul, acara, pelaksana, dihadiri, status, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Terjadwal', ?)
    `;

    const [result] = await db.query(query, [
      hari,
      tanggal,
      ruangan,
      pukul,
      namaAcara,
      pelaksana,
      dihadiri || null,
      type
    ]);

    res.status(201).json({ 
      message: 'Agenda created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating agenda:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateAgendaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let query;
    let result;

    if (status === 'Selesai') {
      // If status is 'Selesai', update status instead of deleting
      query = 'UPDATE agenda_ruangan SET status = "Selesai" WHERE id = ?';
      [result] = await db.query(query, [id]);
    } else {
      // Otherwise, update the status
      query = 'UPDATE agenda_ruangan SET status = ? WHERE id = ?';
      [result] = await db.query(query, [status, id]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Agenda not found' });
    }

    res.status(200).json({ 
      message: status === 'Selesai' ? 'Agenda deleted successfully' : 'Status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      jenisRuangan, 
      ruangan, 
      tanggal, 
      waktuMulai, 
      waktuSelesai, 
      namaAcara, 
      pelaksana, 
      dihadiri 
    } = req.body;

    // Check for double booking (excluding current record ID being edited)
    const hasConflict = await checkConflict(ruangan, tanggal, waktuMulai, waktuSelesai, id);
    if (hasConflict) {
      return res.status(400).json({ message: 'Ruangan sudah di booking pada jam tersebut. Silakan pilih jam atau ruangan lain.' });
    }

    // Map into DB structure
    const type = jenisRuangan === 'bpkad' ? 'BPKAD' : 'PEMKOT';
    const hari = tanggal.split(',')[0].toUpperCase();
    const pukul = `${waktuMulai} - ${waktuSelesai}`;

    const query = `
      UPDATE agenda_ruangan 
      SET hari = ?, tanggal = ?, tempat = ?, pukul = ?, acara = ?, pelaksana = ?, dihadiri = ?, type = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      hari,
      tanggal,
      ruangan,
      pukul,
      namaAcara,
      pelaksana,
      dihadiri || null,
      type,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Agenda not found' });
    }

    res.status(200).json({ message: 'Agenda updated successfully' });
  } catch (error) {
    console.error('Error updating agenda:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const clearHistory = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM agenda_ruangan WHERE status = 'Selesai'");
    res.status(200).json({ 
      message: 'Semua riwayat berhasil dihapus', 
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getAgendas,
  createAgenda,
  updateAgendaStatus,
  updateAgenda,
  clearHistory
};
