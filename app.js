const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
const path = require('path');


// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_contactos'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

app.use(express.json());

// Ruta para la raíz del sitio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para obtener contactos
app.get('/contactos', (req, res) => {
  db.query('SELECT * FROM contactos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/contactos', (req, res) => {
  const { nombre, email, telefono } = req.body;
  const query = `INSERT INTO contactos (nombre, email, telefono) VALUES (?, ?, ?)`;

  db.query(query, [nombre, email, telefono], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error al crear el contacto' });
      } else {
        res.status(200).json({ message: 'Contacto creado exitosamente' });
      }
  });
});

app.get('/contactos/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM contactos WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el contacto' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Contacto no encontrado' });
      }
    }
  });
});


app.put('/contactos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  const query = 'UPDATE contactos SET nombre = ?, email = ?, telefono = ? WHERE id = ?';

  db.query(query, [nombre, email, telefono, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al actualizar el contacto' });
    } else {
      res.status(200).json({ message: 'Contacto actualizado exitosamente' });
    }
  });
});


app.delete('/contactos/:id', (req, res) => {
  const query = `DELETE FROM contactos WHERE id = ?`;

  db.query(query, [req.params.id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error al eliminar el contacto' });
      } else {
        res.status(200).json({ message: 'Contacto eliminado exitosamente' });
      }
  });
});


app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
