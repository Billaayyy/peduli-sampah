// server kita semua guys

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Settingan buat memory upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Itu folder uploads nye
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Allow public access untuk HTML, CSS, JS cuy
app.use(express.static(__dirname));
app.use(express.json());

// Load students database
let students = require('./students.json');

// Endpoint halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint buat submit data
app.post('/submit', upload.single('photo'), (req, res) => {
  const { nim } = req.body;
  const photo = req.file;

  // NIM CHECK SECURITY PROTOCOLS
  const student = students.find(s => s.nim === nim);
  if (!student) {
    // Access Denied
    if (photo) fs.unlinkSync(photo.path); //Del Pic
    return res.status(400).json({ message: 'NIM tidak ditemukan.'});
  }

  // Save Data for Validation
  const pendingDir = path.join(__dirname, 'uploads', 'pending.json');
  let pending = [];
  if (fs.existsSync(pendingDir)) {
    pending = JSON.parse(fs.readFileSync(pendingDIR));
  }
  pending.push({
    id: Date.now(),
    nim: nim,
    filename: photo.filename
  });
  fs.writeFileSync(pendingDir, JSON.stringify(pending, null, 2));

  res.json({
    message: 'Berhasil submit! Menunggu validasi.',
    currentPoin: student.poin
  });
});

// Endpoint for admin view
app.get('/validate', (req, res) => {
  const pendingDir = path.join(__dirname, 'uploads', 'pending.json');
  let pending = [];
  if (fs.existsSync(pendingDir)) {
    pending = JSON.parse(fs.readFileSync(pendingDir));
  }

let html = '<h1>Pending Validasi</h1>';
  pending.forEach(item => {
    html += `
      <div style="margin-bottom:20px;">
        <p><b>NIM:</b> ${item.nim}</p>
        <img src="/uploads/${item.filename}" width="200"/><br/>
        <form action="/validate/${item.id}" method="POST">
          <input type="number" name="poin" placeholder="Tambah poin berapa?" required/>
          <button type="submit">Validasi</button>
        </form>
      </div>
      <hr/>
    `;
  });
  res.send(html);
});

// Endpoint for admin validation
app.post('/validate/:id', express.urlencoded({ extended: true}), (req, res) => {
  const id = parseInt(req.params.id);
  const { poin } = req.body;

  const pendingDir = path.join(__dirname, 'uploads', 'pending.json');
  let pending = [];
  if (fs.existsSync(pendingDir)) {
    pending = JSON.parse(fs.readFileSync(pendingDir));
  }

  const item = pending.find(p => p.id === id);
  if (!item) {
    return res.status(404).send('Item tidak ditemukan.');
  }

  // Update poin mahasiswa
  const student = students.find(s => s.nim === item.nim);
  if (student) {
    student.poin += parseInt(poin);
    fs.writeFileSync('./students.json', JSON.stringify(students, null, 2));
  }

  // Deleter
  fs.unlinkSync(path.join(__dirname, 'uploads', item.filename));
  pending = pending.filter(p => p.id !== id);
  fs.writeFileSync(pendingDir, JSON.stringify(pending, null, 2));

  res.redirect('/validate');
});

// Run Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});