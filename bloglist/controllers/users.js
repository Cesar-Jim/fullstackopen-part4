const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/User');

// POST: create a user
usersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    const saltRounds = 10;

    if (body.username === undefined || body.password === undefined) {
      return res.status(400).json({ error: 'username AND password must be provided' })
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash, // the password sent in the request is not stored in the db, instead the hash is stored
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

// GET: get all users:
usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 0, url: 0 });
    res.json(users.map(u => u.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;