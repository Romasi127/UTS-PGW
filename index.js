const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_galeri'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Koneksi ke database berhasil.');
});

// GET komentar per foto
app.get('/api/komentar/:photo_id', (req, res) => {
  const { photo_id } = req.params;
  db.query('SELECT * FROM komentar WHERE photo_id = ?', [photo_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST komentar baru
app.post('/api/komentar', (req, res) => {
  const { photo_id, isi_komentar } = req.body;
  if (!photo_id || !isi_komentar) return res.status(400).json({ message: 'Data tidak lengkap' });

  db.query('INSERT INTO komentar (photo_id, isi_komentar) VALUES (?, ?)', [photo_id, isi_komentar], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Komentar berhasil disimpan' });
  });
});

app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
