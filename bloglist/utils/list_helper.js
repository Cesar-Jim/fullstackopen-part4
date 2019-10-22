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

module.exports = {
  dummy,
  totalLikes
};
