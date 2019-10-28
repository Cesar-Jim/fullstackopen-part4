const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./listHelper.test');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/Blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());

  await Promise.all(promiseArray);
});

test('blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body.length).toBe(helper.blogsOneElement.length);
});

afterAll(() => {
  mongoose.connection.close();
})