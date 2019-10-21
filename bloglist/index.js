const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('./models/Blog')

const mongoUrl = process.env.MONGODB_URI;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(mongoUrl, options).then(() => console.log('connected to MongoDB...'));

app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    }).catch(err => {
      console.log('error: ', err);
      response.status(404).end();
    })
})

app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response, status(404).end();
    }
  }).catch(err => console.log('error:', err))
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(err => {
      console.log('error: ', err);
      response.status(400).end();
    })
})

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});