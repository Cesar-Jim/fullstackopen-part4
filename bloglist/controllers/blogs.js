const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');

// GET ALL BLOGS
blogsRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs.map(blog => blog.toJSON()));
  })
});

// GET A SINGLE BLOG
blogsRouter.get('/:id', (req, res, next) => {
  Blog.findById(req.params.id).then(blog => {
    if (blog) {
      res.json(blog.toJSON())
    } else {
      res.status(404).end();
    }
  }).catch(error => next(error))
});

// CREATE A BLOG
blogsRouter.post('/', (req, res, next) => {
  const body = req.body;

  if (!body.likes) body.likes = 0;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then(savedBlog => {
    res.json(savedBlog.toJSON())
  }).catch(error => next(error));
});

// DELETE A SINGLE BLOG
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (exception) {
    next(exception);
  };
});

// EDIT A SINGLE BLOG
blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    res.status(200).end();
  } catch (exception) {
    next(exception);
  }
})

module.exports = blogsRouter;
