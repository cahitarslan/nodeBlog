const router = require('express').Router();
const path = require('path');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');

router.get('/new', (req, res) => {
    if (!req.session.userId) {
        res.redirect('users/login');
    }
    Category.find({}).then((categories) => {
        res.render('site/addpost', { categories: categories.map((category) => category.toJSON()) });
    });
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .lean()
        .populate({ path: 'author', model: User })
        .then((post) => {
            Category.find({}).then((categories) => {
                Post.find({})
                    .populate({ path: 'author', model: User })
                    .sort({ $natural: -1 })
                    .then((posts) => {
                        const data = {
                            post: post,
                            categories: categories.map((category) => category.toJSON()),
                            posts: posts.map((post) => post.toJSON()),
                        };
                        res.render('site/post', { categories: data.categories, post: data.post, posts: data.posts });
                    });
            });
        });
});

router.post('/test', (req, res) => {
    let postImage = req.files.post_image;
    postImage.mv(path.resolve(__dirname, '../public/img/postimages', postImage.name));

    Post.create({ ...req.body, post_image: `/img/postimages/${postImage.name}`, author: req.session.userId });

    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Postunuz başarılı bir şekilde oluşturuldu',
    };

    res.redirect('/blog');
});

module.exports = router;
