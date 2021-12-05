const express = require('express');
const router = express.Router();
var session = require('express-session');
const BookController = require("./bookController");
const book = new BookController();

// 도서등록
router.get('/', function (req, res, next) {
    res.render('inputBook.ejs');
  });

router.post('/', book.bookInput, (req, res)=>{
  res.send('<script type="text/javascript">alert("도서가 등록 되었습니다.");location.href="/";</script>');
 })


  // 도서 삭제
router.get('/bookdelete/:book_num', book.deleteBook, function(req,res){
  res.send('<script type="text/javascript">alert("삭제되었습니다.");location.href="/";</script>');
})


// 도서상세보기
router.get('/bookinfodetail/:book_num', book.getDetailBook, function (req, res, next) {
  res.render('bookinfodetail.ejs', {bookinfodetail: req.bookinfodetail});
});


//도서 수정
router.get('/bookupdate/:book_num', function(req, res, next){
  res.render('bookupdate.ejs', {book_num: req.params.book_num});
})

router.post('/bookupdate/:book_num', book.postUpdateBook, (req, res) =>{
  res.send('<script type="text/javascript">alert("수정되었습니다.");location.href="/";</script>');
})


//도서주문
router.post('/book/:book_num', book.whatOrder, (req, res, next) => {
  console.log(req.body);
  res.send('<script type="text/javascript">alert("장바구니에 담았습니다.");location.href="/";</script>');
})

router.get('/buy/:book_num', book.getCardInfo, book.getPlaceInfo, book.getCouponInfo, (req, res, next) => {
  res.render('order.ejs', {sess: req.session, book_num : req.params.book_num, cardinfo: req.cardinfo, placeinfo: req.placeinfo, couponinfo: req.couponinfo})
})

router.post('/buy/:book_num', book.orderInput, (req, res, next) => {
  res.send('<script type="text/javascript">alert("주문되었습니다.");location.href="/";</script>');
})


// //장바구니
// router.post('basket/:book_num', book.whatOrder, (req, res, next) =>{
//   console.log(req.body);
//   res.send('<script type="text/javascript">alert("장바구니에 담았습니다.");location.href="/";</script>');
// })




module.exports = router;
