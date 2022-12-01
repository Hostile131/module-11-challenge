const express = require('express');
const path = require('path');

const app = express();

// This line references our pseudo database (an "id" had to be added to our pseudo database for this to work)
const db = require('./db/db.json');

const PORT = 3001;

app.use(express.static('public'));

// This allows us to view requests and responses as json
app.use(express.json());

// This line allows us to use information encoded on the URL
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Navigate to /notes'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// This line gets the pseudo database to populate the list of note titles
app.get('/api/notes', (req, res) => {
  return res.json(db)
});

// app.delete('/api/notes', (req, res) => {
//   const someCode = placeholder
// });

// This line writes the note fields into our pseudo database
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to save a note.`);
  console.log(req.body)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
