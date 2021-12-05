const express = require('express');
const router = express.Router();
var session = require('express-session');
const UsersController = require("./usersController");
const user = new UsersController();


/* GET join page. */
router.get('/', function (req, res, next) {
  res.render('join.ejs');
});

router.post('/', user.userjoinInput, (req, res)=>{
  res.send('<script type="text/javascript">alert("가입 되었습니다.");location.href="/";</script>');
})


//login
router.get('/login', function (req, res, next) {
  res.render('login.ejs');
})

router.post('/login', user.userLogin, (req, res)=>{
  res.send('<script type="text/javascript">alert("로그인 되었습니다.");location.href="/";</script>');
})


//로그아웃
router.get('/logout', function(req, res){
  sess = req.session;
  if(sess){
      req.session.destroy(function(err){
          if(err){
              console.log(err);
          }else{
            res.send('<script type="text/javascript">alert("로그아웃 되었습니다.");location.href="/";</script>');
          }
      })
  }else{
      res.redirect('/');
  }
})


//마이페이지
router.get('/mypage', user.getCardInfo, user.getPlaceInfo, user.getCouponInfo, function(req, res){
  const {users_user_id, card_num, card_date, card_kind} = req.body;
  console.log(req.session.user_id);
  console.log((req.cardinfo));
  console.log(req.couponinfo);
  console.log(req.placeinfo);
  res.render('mypage.ejs', {sess:req.session.user_id, cardinfo: req.cardinfo, placeinfo: req.placeinfo, couponinfo: req.couponinfo});
})


//카드등록
router.get('/card', function (req, res, next) {
  res.render('card.ejs');
})

router.post('/card', user.inputCard, (req, res)=>{
  res.send('<script type="text/javascript">alert("카드가 등록 되었습니다.");location.href="/users/mypage";</script>');
})


//카드삭제
router.get('/carddelete/:card_num', user.deleteCard, function(req,res){
  res.send('<script type="text/javascript">alert("카드가 삭제 되었습니다.");location.href="/users/mypage";</script>');;
})


//배송지등록
router.get('/place', function (req, res, next) {
  res.render('place.ejs');
})

router.post('/place', user.inputPlace, (req, res)=>{
  res.send('<script type="text/javascript">alert("배송지가 등록 되었습니다.");location.href="/users/mypage";</script>');
})


//배송지삭제
router.get('/placedelete/:place_id', user.deletePlace, function(req,res){
  res.send('<script type="text/javascript">alert("배송지가 삭제 되었습니다.");location.href="/users/mypage";</script>');
})


//배송지수정
router.get('/placeupdate/:place_id', function (req, res, next) {
  res.render('placeUpdate.ejs', {place_id: req.params.place_id})
})

router.post('/placeupdate/:place_id', user.updatePlace, function (req, res) {
  res.send('<script type="text/javascript">alert("배송지가 수정 되었습니다.");location.href="/users/mypage";</script>');
})


//쿠폰등록
router.get('/coupon', (req, res)=> {
  res.render('coupon.ejs')
})

router.post('/coupon', user.insertCoupon, (req, res)=> {
  res.render('coupon.ejs')
})


module.exports = router;
