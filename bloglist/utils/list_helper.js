const _ = require('lodash');
const Blog = require('../models/Blog');

const dummy = blogs => {
  if (Array.isArray(blogs)) {
    return 1;
  }
};

const totalLikes = blogs => {
  if (Array.isArray(blogs)) {
    if (blogs.length === 0) {
      return 0;
    }

    if (blogs.length === 1) {
      return blogs[0].likes;
    }

    return blogs.reduce((totalLikes, blog) => {
      return totalLikes + blog.likes;
    }, 0);
  }
}

const favoriteBlog = blogs => {
  let maxLikes = 0;
  let favorite = { title: '', author: '', likes: 0 }

  if (blogs.length === 1) {
    favorite = {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }

  if (blogs.length > 1) {
    blogs.map(blog => {
      if (blog.likes >= maxLikes) {
        maxLikes = blog.likes
        favorite = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes
        }
      }
    })
  }

  return favorite;
}


const topBlogger = blogs => {
  const blogsAndAuthors = _.map(_.countBy(blogs, 'author'), (val, key) => ({ author: key, blogs: val }));
  const topBloggerAuthor = _.maxBy(blogsAndAuthors, 'blogs');

  return topBloggerAuthor;
}


const mostLikedBlogger = blogs => {
  const totalLikesPerAuthor = _(blogs).groupBy('author').map((objs, key) => ({ 'author': key, 'likes': _.sumBy(objs, 'likes') })).value();
  const mostLikedAuthor = _.maxBy(totalLikesPerAuthor, 'likes');

  return mostLikedAuthor;
}

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map(blog => blog.toJSON());
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  topBlogger,
  mostLikedBlogger,
  blogsInDb
};
