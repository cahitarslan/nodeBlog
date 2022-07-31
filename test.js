const mongoose = require('mongoose');

const Post = require('./models/Post');

mongoose.connect('mongodb://127.0.0.1/nodeblog_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

Post.findByIdAndDelete('62e5c06b9fd0e819c086c1fa', (error, post) => {
    console.log(error, post);
});

/* Post.findByIdAndUpdate('62e5bf74a1312019a8a62b96', { title: 'Benim 1. Postum' }, (error, post) => {
    console.log(error, post);
}); */

/* Post.find({}, (error, post) => {
    console.log(error, post);
}); */

/* Post.create(
    {
        title: 'İkinci Post Başlığım',
        content: 'İkinci post içeriği, lorem ipsum text',
    },
    (error, post) => {
        console.log(error, post);
    }
); */
