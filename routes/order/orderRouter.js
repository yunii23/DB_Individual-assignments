const express = require('express');
const router = express.Router();
const OrderController = require("./orderController");
const order = new OrderController();


// 주문리스트 가져오기
router.get('/myorderlist', order.getMyOrderList, (req, res, next) =>{
    console.log(req.orderinfo);
    res.render('myorderlist.ejs', {sess:req.session.user_id, orderinfo: req.orderinfo});
});


// 주문 삭제
router.get('/myorderlist/delete/:order_num', order.deleteMyOrder, (req, res)=>{
    res.send('<script type="text/javascript">alert("주문이 취소 되었습니다.");location.href="/order/myorderlist";</script>')
})


// 장바구니 내역
router.get('/basket', order.getBasket, (req, res, next) => {
    res.render('myBasket.ejs', {sess:req.session.user_id, basketinfo: req.session.basketinfo});
})


// 장바구니 수정
router.get('/basketupdate/:book_book_num', function(req, res, next)  {
    res.render('myBasketUpdate.ejs', {book_book_num: req.params.book_book_num});
})

router.post('/basketupdate/:book_book_num', order.updateMybasket, (req, res) => {
    res.send('<script type="text/javascript">alert("수정되었습니다.");location.href="/order/basket";</script>');
})


// 장바구니 삭제
router.get('/basketdelete/:book_book_num', order.deleteMyBasket, (req, res)=>{
    res.send('<script type="text/javascript">alert("장바구니가 삭제 되었습니다.");location.href="/order/basket";</script>')
})


// 장바구니 주문
router.get('/basketOrder', order.getCardInfo, order.getPlaceInfo, (req, res) => {
    res.render('myBasketOrder.ejs', { basketinfo: req.session.basketinfo, cardinfo: req.cardinfo, placeinfo: req.placeinfo});
})

router.post('/basketOrder', order.basketOrder,  (req, res) => {
    res.send('<script type="text/javascript">alert("주문 되었습니다.");location.href="/order/basket";</script>');
})



module.exports = router;
