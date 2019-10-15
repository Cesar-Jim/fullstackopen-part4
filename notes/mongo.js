const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cesar:${password}@cluster0-ihtyc.mongodb.net/note-app?retryWrites=true&w=majority`;
const options = {
  keepAlive: 1,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(url, options);

// Schema
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// Model
const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'Mongo creates non-relational databases',
  date: new Date(),
  important: false,
});

// Generate (save) a note
note.save().then(response => {
  console.log('note saved!');
  mongoose.connection.close();
});

// Fetch notes from the Mongo Database
// Note.find({ important: false }).then(result => {
//   result.forEach(note => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
