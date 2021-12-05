const express = require('express');
const router = express.Router();
const MainController = require("./mainController");
const main = new MainController();

/* GET home page. */
router.get('/',  main.bookInfo, function (req, res, next) {
  const {user_id} = req.session;
  console.log(req.session.user_id);
  console.log(user_id);
  res.render('index.ejs', { title: 'Express', sess: user_id, bookinfo: req.bookinfo});
});


router.get('/join', function (req, res, next) {
   res.render('join.ejs', { title:'JOIN' });
});



// 검색
router.post('/',  (req, res, next) => {
  console.log(req.body);
  req.session.book_name = req.body.search;
  res.redirect('/');
})


module.exports = router;
