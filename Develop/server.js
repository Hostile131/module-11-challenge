const express = require('express');
const path = require('path');
// This line allows for read/write access to file structure
const fs = require('fs');
// Helper method for generating unique IDs
const uuid = require('./helpers/uuid');

const app = express();

// This line references our pseudo database (an "id" had to be added to our pseudo database for this to work)
const db = require('./db/db.json');

const { fstat } = require('fs');

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

// This line deletes the selected note
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete note.`);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      
      parsedNotes.splice(parsedNotes.findIndex(a => a.id === req.params.id) , 1)

      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 3),
        (writeErr) =>
        writeErr
        ? console.error(writeErr)
        : console.info('Successfully updated notes!')
      )
    }
  })
  res.redirect('/')
});

// This line writes the note fields into our pseudo database
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to save a note.`);
  console.log(req.body);
  
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuid(),
  };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 3),
        (writeErr) =>
        writeErr
        ? console.error(writeErr)
        : console.info('Successfully updated notes!')
      );
    }
  });

  const response = {
    status: 'success',
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);
  res.redirect('/')
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
