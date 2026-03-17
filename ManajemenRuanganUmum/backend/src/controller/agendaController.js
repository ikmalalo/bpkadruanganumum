const db = require('../config/db');

const getAgendas = async (req, res) => {
  try {
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
      // If status is 'Selesai', delete the record as requested by user
      query = 'DELETE FROM agenda_ruangan WHERE id = ?';
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

module.exports = {
  getAgendas,
  createAgenda,
  updateAgendaStatus,
  updateAgenda
};
