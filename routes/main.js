const router = require('express').Router();
const Category = require('../models/Category');
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/', (req, res) => {
    /*  console.log(req.session); */
    res.render('site/index');
});

/* router.get('/admin', (req, res) => {
    res.render('admin/index');
}); */

router.get('/blog', (req, res) => {
    const postPerPage = 4;
    const page = req.query.page || 1;

    Post.find({})
        .populate({ path: 'author', model: User })
        .sort({ $natural: -1 })
        .skip(postPerPage * page - postPerPage)
        .limit(postPerPage)
        .then((posts) => {
            Post.countDocuments().then((postCount) => {
                Category.aggregate([
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'category',
                            as: 'posts',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            num_of_posts: {
                                $size: '$posts',
                            },
                        },
                    },
                ])
                    .sort({ name: 1 })
                    .then((categories) => {
                        const data = {
                            posts: posts.map((post) => post.toJSON()),
                            categories: categories,
                        };
                        res.render('site/blog', { categories: data.categories, posts: data.posts, current: parseInt(page), pages: Math.ceil(postCount / postPerPage) });
                    });
            });
        });
});

router.get('/contact', (req, res) => {
    res.render('site/contact');
});

module.exports = router;
