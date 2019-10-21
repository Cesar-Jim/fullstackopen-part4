const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://cesar:${password}@cluster0-ihtyc.mongodb.net/bloglist-app?retryWrites=true&w=majority`;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(url, options);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const blog = new Blog({
  title: "MongoDB tips & tricks",
  author: "John Bailey",
  url: "www.mongodbtricks.com",
  likes: 200,
});

blog.save().then(response => {
  console.log('blog saved!');
  mongoose.connection.close()
});

// Blog.find({}).then(result => {
//   result.forEach(blog => {
//     console.log(blog)
//   });
//   mongoose.connection.close();
// });