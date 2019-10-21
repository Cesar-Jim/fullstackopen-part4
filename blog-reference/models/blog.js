const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('conecting to ', url);

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(url, options).then(result => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.log('error connecting to MongoDB', error.message);
});

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Blog', blogSchema);



