const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app); // this is the "superagent" object
const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

// Initial state: delete DB and create 2 notes
beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map(note => new Note(note));
  const promiseArray = noteObjects.map(note => note.save());

  await Promise.all(promiseArray);
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    console.log('entered test');

    await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body.length).toBe(helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(r => r.content);

    expect(contents).toContain('Browser can execute only Javascript');
  });
})

describe('viewing a specific note', () => {
  // Test: a specific note can be viewed
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultNote.body).toEqual(noteToView)
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    console.log(validNonexistingId);

    await api.get(`/api/notes/${validNonexistingId}`).expect(400);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});


describe('addition of a new note', () => {
  // Test: adding a new note
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain('async/await simplifies making async calls')
  });

  // Test: notes without content are not added
  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd.length).toBe(helper.initialNotes.length);
  })
})

describe('deletion of a note', () => {
  // Test: deletion of a note
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd.length).toBe(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map(r => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

// User Test Suite starts here:
describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', password: 'sekret' });
    await user.save;
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);

  })
})

describe('when there is initially one user in the db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});




// Close connection with DB
afterAll(() => {
  mongoose.connection.close()
});

