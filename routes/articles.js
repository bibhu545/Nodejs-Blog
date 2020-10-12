const express = require('express')
const Article = require('../models/articleModel')

const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id).then(article => {
        res.render('articles/edit', { article: article });
    }).catch(error => {
        res.render('/');
    });
})

router.get('/:slug', (req, res) => {
    Article.findOne({ slug: req.params.slug }).then(item => {
        res.render('articles/show', { article: item })
    }).catch(error => {
        console.log(error)
        res.redirect('/');
    });
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', (req, res) => {
    Article.findByIdAndDelete(req.params.id).then(data => {
        res.redirect('/'); 
    }).catch(error => {
        console.log(error);
        res.redirect('/');
    });
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`, { article: article });
        }
    }
}

module.exports = router