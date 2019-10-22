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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
