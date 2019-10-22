const list = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5da8b93002ff184fd0b7f316',
    title: 'MongoDB tips & tricks',
    author: 'John Bailey',
    url: 'www.mongodbtricks.com',
    likes: 200,
    __v: 0
  },
]

const totalLikes = list.reduce((acc, blog) => {
  console.log('likes: ', blog.likes, 'acc: ', acc);
  return acc + blog.likes;
}, 0);

console.log('totalLikes:', totalLikes);