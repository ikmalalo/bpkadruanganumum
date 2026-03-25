const express = require('express');
const cors = require('cors');
require('dotenv').config();

const agendaRoutes = require('./routes/agendaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agendas', agendaRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Agenda Ruangan is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
