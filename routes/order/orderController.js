const pool = require("../../config/dbconfig")

class orderController {

    // 주문내역 가져오기
    async getMyOrderList(req, res, next) {
        console.log(req.body);

        pool.getConnection((err, conn) => {
            if (err) throw res.json({ success: false, err });
            else {

                var sql = `SELECT * FROM orders as o, order_info as i, books as bk WHERE users_user_id = "${req.session.user_id}" AND o.order_num = i.order_idorder AND i.book_book_num = bk.book_num ORDER BY o.order_num ASC`;
                conn.query(sql, (err, row) => {
                    conn.release();
                    if (err) throw err;
                    else {
                        req.orderinfo = row;
                        next();
                    }
                })
            }
        })
    }


    // 주문 삭제
    async deleteMyOrder(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                var sel = `SELECT * FROM orders as o, order_info as i, books as bk WHERE users_user_id = "${req.session.user_id}" AND o.order_num = "${req.params.order_num}" AND o.order_num = i.order_idorder AND i.book_book_num = bk.book_num`;
                
                var sqll = `DELETE FROM orders WHERE order_num = "${req.params.order_num}"`

                conn.query(sel, (err, selrow) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {

                        let sum = 0;
                        for (var i = 0; i < selrow.length; i++ ) {

                            const max = [Number(selrow[i].book_value) + Number(selrow[i].sum)];
                            const val = [Number(max), selrow[i].book_num];
                            var update = `UPDATE books SET book_value = ? WHERE book_num = ?`

                            conn.query(update, val, (err, up) => {
                                console.log("에러2");
                                if (err) throw err;
                                else {

                                }
                            })

                            
                            conn.query(sqll, (err, del) => {
                               console.log("에러3");
                               sum ++;
                                if (err) throw err;
                                else {
                                    if (sum == selrow.length) {
                                        console.log("에러4");
                                        next();
                                    }
                                }
                            })
                        }
                        
                    }
                })
                
            }
        })
    }


    // 장바구니 내역 불러오기
    async getBasket(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw res.json({ success: false, err });
            else {
                var sql = `SELECT * FROM baskets as b, basket_info as i, books as bk WHERE b.users_user_id = "${req.session.user_id}" AND b.basket_num = i.basket_basket_num AND bk.book_num = i.book_book_num`;
                conn.query(sql, (err, row) => {
                    conn.release();
                    if (err) throw err;
                    else {
                        //req.basketinfo = row;
                        req.session.basketinfo = row;
                        next();
                    }
                })
            }

        })
    }


    // 장바구니 수정 
    async updateMybasket(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;

            const update = req.body;
            console.log(update);

            const sql = `UPDATE basket_info SET amount = ? WHERE book_book_num = "${req.params.book_book_num}"`;
            const val = [update.amount];

            conn.query(sql, val, (err, row) => {
                if (err) {
                    res.send('<script type="text/javascript">alert("정보를 입력해주세요.");location.href="/";</script>');
                }
                else {
                    next();
                }
            })
        })
    }



    // 장바구니 삭제
    async deleteMyBasket(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `DELETE FROM basket_info WHERE book_book_num = "${req.params.book_book_num}"`

            conn.query(sql, (err, row) => {
                console.log
                conn.release();
                if (err) throw err;
                else {
                    next();
                }
            })
        })
    }



    // 등록카드 정보 가져오기
    async getCardInfo(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `SELECT * FROM cards WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                req.cardinfo = row;
                next();
            })
        })
    }

    //등록 배송 정보 가져오기
    async getPlaceInfo(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `SELECT * FROM places WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                req.placeinfo = row;
                next();
            })
        })
    }





    // 장바구니에서 주문
    async basketOrder(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                const bookinfoSql = `SELECT * FROM baskets as b, basket_info as i, books as bk WHERE b.users_user_id = "${req.session.user_id}" AND b.basket_num = i.basket_basket_num AND i.book_book_num = bk.book_num`;
                const cardsql = `SELECT * FROM cards WHERE card_num = "${req.body.bakset_card}"`
                const placesql = `SELECT * FROM places WHERE place_num = "${req.body.bakset_place}"`
                const orderinsertSql = "INSERT INTO orders (users_user_id, order_max, card_num, card_date, card_kind, place_num, place_addr, place_addrinfo) "
                    + "VALUES (?,?,?,?,?,?,?,?)";
                const aisql = 'SELECT last_insert_id() as order_idorder';
                const aiInsert = 'INSERT INTO order_info (book_book_num, order_idorder, sum) VALUES (?,?,?)';


                // 도서 
                conn.query(bookinfoSql, (err, bi) => {
                    console.log("에러1");
                    console.log(bi);
                    if (err) throw err;
                    else if (bi == ''){
                        res.send('<script type="text/javascript">alert("장바구니가 없거나 카드, 배송지 정보를 입력해주세요.");location.href="/";</script>');
                    }
                    else {
                        // 카드
                        conn.query(cardsql, (err, ci) => {
                            console.log("에러2");
                            if (err) throw err;

                            else {
                                // 배송지
                                conn.query(placesql, (err, pi) => {
                                    console.log("에러3");
                                    if (err) throw err;

                                    else {
                                        //주문 인설트
                                        
                                        const val = [req.session.user_id, req.body.basket_sum, ci[0].card_num, ci[0].card_date, ci[0].card_kind, pi[0].place_num, pi[0].place_addr, pi[0].place_addrinfo];

                                        conn.query(orderinsertSql, val, (err, oi) => {
                                            console.log("에러4");
                                            if (err) throw err;

                                            else {
                                                //ai sql
                                                conn.query(aisql, (err, ai) => {
                                                    console.log("에러5");
                                                    if (err) throw err;

                                                    else {
                                                        // orderinfo insert
                                                        var sum = 0
                                                        for (var i = 0; i < bi.length; i++) {

                                                            console.log("zzzzzzzzzzzzzzzzzzzz" + i);
                                                            const val2 = [bi[i].book_book_num, ai[0].order_idorder, bi[i].amount];
                                                            console.log(val2);
                                                            const bookupdate = `UPDATE books set book_value = ? WHERE book_num = "${bi[i].book_book_num}"`;
                                                            const update = [Number(bi[i].book_value) - Number(bi[i].amount)];

                                                            conn.query(aiInsert, val2, (err, orderai) => {
                                                                console.log("에러6");
                                                                if (err) throw err;

                                                                else {

                                                                }
                                                            })

                                                            // 업데이트
                                                            conn.query(bookupdate, update, (err, row) => {
                                                                console.log("에러7");
                                                                console.log("ffffffffffffffffffffff" + sum);
                                                                if (err) throw err;

                                                                else {

                                                                }
                                                            })

                                                            //딜리트
                                                            const sql = `DELETE FROM baskets WHERE basket_num = "${bi[i].basket_num}"`

                                                            conn.query(sql, (err, row) => {
                                                                sum++;
                                                                console.log("에러8");
                                                                if (err) throw err;
                                                                else {
                                                                    if (sum == bi.length) {
                                                                        console.log("에러9");
                                                                        next();
                                                                    }
                                                                }
                                                            })
                                                        }

                                                    }
                                                })
                                            }
                                        })


                                    }
                                })
                            }
                        })
                    }
                })
            }

        })
    }


    // async basketOrderDelete (req, res, next) {

    //     pool.getConnection((err, conn) => {
    //         if(err) throw err;

    //         else {
    //             const bookinfoSql = `SELECT * FROM baskets as b, basket_info as i WHERE users_user_id = "${req.session.user_id}"`;

    //             conn.query(bookinfoSql, (err, bi)=>{
    //                 console.log("에러8");
    //                 if(err) throw err;
    //                 else{

    //                     const sql = `DELETE FROM baskets WHERE baskets_num = "${bi[0].baskets_num}"`

    //                     conn.query(sql, (err, row) => {
    //                         console.log("에러9");
    //                         if (err) throw err;
    //                         else {
    //                             next();
    //                         }
    //                     })
    //                 }
    //             })

    //         }

    //     })
    // }

}



module.exports = orderController;