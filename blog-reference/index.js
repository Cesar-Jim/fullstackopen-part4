require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Blog = require('./models/blog');

const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next();
}

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors());


app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs.map(blog => blog.toJSON()));
  })
})

app.get('/api/blogs/:id', (req, res, next) => {
  Blog.findById(req.params.id).then(blog => {
    if (blog) {
      res.json(blog.toJSON())
    } else {
      res.status(404).end();
    }
  }).catch(error => next(error));
});

app.post('/api/blogs', (req, res) => {
  const body = req.body;

  if (body.title === undefined) {
    return res.status(400).json({ error: 'content missing' })
  };

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  blog.save().then(savedBlog => {
    res.json(savedBlog.toJSON())
  });
});

app.delete('/api/blogs/:id', (req, res) => {
  const id = Number(req.params.id);
  blogs = blogs.filter(blog => blog.id !== id);

  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  Response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);