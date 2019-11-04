const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const User = require('../models/User');

// GET ALL BLOGS
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  res.json(blogs.map(blog => blog.toJSON()));
})

// GET A SINGLE BLOG
blogsRouter.get('/:id', async (req, res, next) => {

  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog.toJSON())
    } else {
      res.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

// CREATE A BLOG
blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;

  // const token = getTokenFrom(req);

  try {
    const token = req.token;
    const decodedToken = token === null ? false : jwt.verify(token, process.env.SECRET);

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid ' })
    }

    const user = await User.findById(body.userId);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id,
    })

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }

});

// DELETE A SINGLE BLOG
blogsRouter.delete('/:id', async (req, res, next) => {

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    // Check if token is OK:
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findById(req.params.id);

    if (blog.user.toString() === decodedToken.id) {
      await blog.remove();
      res.status(204).end();

    } else {
      return res.status(400).json({ error: 'blog can not be deleted by a non-owner' });
    }
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
