var express = require('express');
var path = require('path');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'dist'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

// 接收请求，返回根页面，前端处理页面路由(单页应用)
app.use('/', function(req, res, next) {
  res.render('index');
});


module.exports = app;
