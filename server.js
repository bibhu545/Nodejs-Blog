const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articles')
const Article = require('./models/articleModel')
const methodOverride = require('method-override')

var app = express();
mongoose.connect('mongodb+srv://blogUser:blogPassword@testcluster.eik60.mongodb.net/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    Article.find().sort({ createdAt: 'desc' }).then(articles => {
        res.render('index', { articles: articles })
    }).catch(error => {
        res.send("Please reload the page...");
    });
})
app.use('/articles', articleRoutes)

app.listen(5000);
