const pool = require("../../config/dbconfig")

class bookController {

    // 도서등록
    async bookInput(req, res, next) {
        console.log(req.body);

        const book = req.body;

        pool.getConnection((err, conn) => {
            if (err) throw res.json({ success: false, err });
            else {
                var val = [book.book_num, book.book_name, book.book_value, book.book_money]

                console.log(val)
                var sql = "INSERT INTO books VALUES (?,?,?,?)";
                conn.query(sql, val, (err, row) => {
                    conn.release();
                    if (err) {
                        res.send('<script type="text/javascript">alert("다시 입력해주세요");location.href="/";</script>');
                    }
                    else {
                        next();
                    }
                })
            }
        })
    }



    //도서정보 삭제
    async deleteBook(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `DELETE FROM books WHERE book_num = "${req.params.book_num}"`
            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                else {
                    next();
                }
            })
        })
    }



    // 도서 정보 가져오기
    async getDetailBook(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `SELECT * FROM books WHERE book_num = "${req.params.book_num}"`
            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                else {
                    req.bookinfodetail = row[0];
                    next();
                }
            })
        })
    }



    // //도서 수정 get
    // async getUpdateBook(req,res, next){
    //     pool.getConnection((err, conn)=>{
    //         if(err) throw err;
    //         const sql =`SELECT * FROM books WHERE book_num = "${req.params.book_num}"`
    //         conn.query(sql, (err, row)=>{
    //             conn.release();
    //             if(err) throw err;
    //             else{
    //                 req.bookinfodetail = row[0];
    //                 next();
    //             }
    //         })
    //     })
    // }


    //도서 수정 post
    async postUpdateBook(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            const book = req.body;

            const val = [book.book_name, book.book_value, book.book_money];
            const sql = `UPDATE books SET book_name = ?, book_value =?, book_money =? WHERE book_num = "${req.params.book_num}"`

            conn.query(sql, val, (err, row) => {
                conn.release();
                if (err) {
                    res.send('<script type="text/javascript">alert("다시 입력해주세요.");location.href="/";</script>');
                }
                else {
                    next();
                }
            })
        })
    }



    // 바로 주문
    async orderInput(req, res, next) {
        console.log(req.body);

        const order = req.body;

        pool.getConnection((err, conn) => {
            if (err) throw res.json({ success: false, err });
            else {

                const cardsql = `SELECT * FROM cards WHERE card_num = "${req.body.order_card}"`
                const placesql = `SELECT * FROM places WHERE place_num = "${req.body.order_place}"`
                const couponsql = `SELECT * FROM Coupon WHERE coupon_id = "${req.body.order_coupon}"`
                const booksql = `SELECT book_money, book_value FROM books WHERE book_num = "${req.params.book_num}"`
                const sql = "INSERT INTO orders (users_user_id, order_max, card_num, card_date, card_kind, place_num, place_addr, place_addrinfo) "
                    + "VALUES (?,?,?,?,?,?,?,?)";

                const aisql = 'SELECT last_insert_id() as order_idorder';
                const aiInsert = 'INSERT INTO order_info (book_book_num, order_idorder, sum, coupon_id, coupon_money) VALUES (?,?,?,?,?)';
                const bookupdate = `UPDATE books set book_value = ? WHERE book_num = "${req.params.book_num}"`
                const updatecoupon = `UPDATE Coupon set coupon_use = ?, coupon_useDate = ? WHERE coupon_id = "${req.body.order_coupon}" `

                //카드 sql
                conn.query(cardsql, (err, card) => {
                    console.log("에러1");
                    console.log(card);
                    if (err) throw err;
                    else if (card == '') {
                        res.send('<script type="text/javascript">alert("카드 정보를 입력해주세요.");location.href="/";</script>');
                    }
                    else {
                        //배송지 sql
                        conn.query(placesql, (err, place) => {
                            console.log("에러2");
                            console.log(place);
                            if (err) throw err;
                            else if (place == '') {
                                res.send('<script type="text/javascript">alert("배송지 정보를 입력해주세요.");location.href="/";</script>');
                            }
                            else {
                                // 쿠폰 가져오기 
                                conn.query(couponsql, (err, coupon) => {
                                    console.log("에러8");
                                    console.log(coupon);
                                    if (err) throw err;
                                    else {

                                        //도서가격 sql
                                        conn.query(booksql, (err, book) => {
                                            console.log("에러3");
                                            if (err) throw err;
                                            else {

                                                const max = book[0].book_money * req.session.sum;
                                                const val = [req.session.user_id, max, card[0].card_num, card[0].card_date, card[0].card_kind, place[0].place_num, place[0].place_addr, place[0].place_addrinfo];


                                                // 주문 insert
                                                conn.query(sql, val, (err, row) => {
                                                    console.log("에러4");
                                                    if (err) throw err;
                                                    else {

                                                        // ai sql
                                                        conn.query(aisql, (err, ai) => {
                                                            console.log("에러5");
                                                            if (err) throw err;
                                                            else {
                                                                if (coupon[0].coupon_kind == "10") {
                                                                    const val2 = [req.params.book_num, ai[0].order_idorder, req.session.sum, coupon[0].coupon_id, Number(max) * Number(0.9)];
                                                                    console.log(val2);

                                                                    // order_info insert
                                                                    conn.query(aiInsert, val2, (err, aiInsert) => {
                                                                        console.log("에러6");
                                                                        if (err) {
                                                                            if (req.session.sum == null || req.session.sum == undefined || (req.session.sum == '')) {
                                                                                res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                                                            }
                                                                        }
                                                                        else {
                                                                            const update = [Number(book[0].book_value) - Number(req.session.sum)];
                                                                            console.log(update);
                                                                            // book update 
                                                                            conn.query(bookupdate, update, (err, row) => {
                                                                                console.log("에러7");
                                                                                if (err) throw err;
                                                                                else {
                                                                                    const val4 = ["Y", req.body.today]
                                                                                    conn.query(updatecoupon, val4, (err, row1) => {
                                                                                        if (err) throw err;
                                                                                        else {
                                                                                            next();
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                } else {
                                                                    const val3 = [req.params.book_num, ai[0].order_idorder, req.session.sum, coupon[0].coupon_id, Number(max) - Number(1000)];

                                                                    // order_info insert
                                                                    conn.query(aiInsert, val3, (err, aiInsert) => {
                                                                        console.log("에러9");
                                                                        if (err) {
                                                                            if (req.session.sum == null || req.session.sum == undefined || (req.session.sum == '')) {
                                                                                res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                                                            }
                                                                        }
                                                                        else {
                                                                            const update = [Number(book[0].book_value) - Number(req.session.sum)];
                                                                            console.log(update);
                                                                            // book update 
                                                                            conn.query(bookupdate, update, (err, row) => {
                                                                                console.log("에러10");
                                                                                if (err) throw err;
                                                                                else {
                                                                                    const val5 = ["Y", req.body.today]
                                                                                    conn.query(updatecoupon, val5, (err, row1) => {
                                                                                        if (err) throw err;
                                                                                        else {
                                                                                            next();
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
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

    //등록 쿠폰 정보 가져오기
    async getCouponInfo(req, res, next) {

        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `SELECT * FROM Coupon WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;

                req.couponinfo = row;
                next();
            })
        })
    }


    // 특정 도서 정보 가져오기
    async bookmoneyget(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `SELECT * FROM books WHERE book_num = "${req.params.book_num}"`
            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                else {
                    req.bookinfodetail = row[0];
                    next();
                }
            })
        })
    }

    // if면 장바구니 else면 주문
    async whatOrder(req, res, next) {
        if (req.body.basket != null) {
            pool.getConnection((err, conn) => {
                // session.userid의 사용자의 장바구니에 bookNum이랑 bookSum 박아 
                // 문제가 발생하는 장바구니에 있는 책을 한번더 장바구니에 담았을 경우

                //장바구니
                var useridsql = `SELECT * FROM baskets WHERE users_user_id = "${req.session.user_id}"`;
                var basketsql = `INSERT INTO baskets (users_user_id) VALUES (?)`;
                var basketinfosql = `INSERT INTO basket_info (basket_basket_num, book_book_num, amount) VALUES (?, ?, ?)`;
                var select = `SELECT LAST_INSERT_ID() as basket_basket_num`;

                const val = [req.session.user_id];

                conn.query(useridsql, (err, id) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {

                        // 유저가 장바구니 가지고 있는지 아닌지 검사
                        if (id.length == 0) { // 새로 만들기
                            conn.query(basketsql, val, (err, basket) => {
                                console.log("에러2");
                                if (err) throw err;
                                else {

                                    // 마지막 바스켓 번호 가져옴 
                                    conn.query(select, (err, bn) => {
                                        console.log("에러3");
                                        if (err) throw err;
                                        else {

                                            var basketinfosql2 = `INSERT INTO basket_info (basket_basket_num, book_book_num, amount) VALUES (?, ?, ?)`;
                                            const vall = [bn[0].basket_basket_num, req.params.book_num, req.body.sum];

                                            conn.query(basketinfosql2, vall, (err, info) => {
                                                console.log("에러4");
                                                if (err) {
                                                    if (req.body.sum == null || req.body.sum == undefined || (req.body.sum == '')) {
                                                        res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                                    }
                                                }
                                                else {
                                                    next();
                                                }
                                            })
                                        }

                                    })
                                }
                            })
                        } else { // 장바구니 가지고 있으면

                            var basketinfosql = `INSERT INTO basket_info (basket_basket_num, book_book_num, amount) VALUES (?, ?, ?)`;

                            const val2 = [id[0].basket_num, req.params.book_num, req.body.sum];

                            conn.query(basketinfosql, val2, (err, info) => {
                                console.log("에러5");
                                if (err) {

                                    if (req.body.sum == null || req.body.sum == undefined || (req.body.sum == '')) {
                                        res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                    }

                                    const amsql = `SELECT * FROM basket_info WHERE book_book_num = "${req.params.book_num}"`
                                    const sss = `UPDATE basket_info set amount = ? WHERE basket_basket_num = ? AND book_book_num = ?`;

                                    conn.query(amsql, (err, am) => {
                                        console.log("에러6");
                                        if (err) {
                                            res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                        }
                                        else {

                                            const am2 = [Number(req.body.sum) + Number(am[0].amount), id[0].basket_num, req.params.book_num];

                                            conn.query(sss, am2, (err, row) => {
                                                console.log("에러7");
                                                if (err) {
                                                    if (am[0].amount == null || am[0].amount == '' || am[0].amount == undefined) {
                                                        res.send('<script type="text/javascript">alert("도서 구매 수를 입력해주세요.");location.href="/";</script>');
                                                    }
                                                }
                                                else {
                                                    next();
                                                }
                                            })
                                        }
                                    })
                                }
                                else {

                                    next();
                                }
                            })

                        }


                        /// ================================================================== 여기 밑에는 잠시 무시해도됨
                        // conn.query(basketsql, (err, basket) =>{
                        //     console.log("에러2");
                        //     if(err) throw err;
                        //     else {

                        //         const val2 = [id[0].basket_num, req.params.book_num, req.body.sum];
                        //         console.log(val2);

                        //         conn.query(basketinfosql, val2, (err, basketinfoInsert) =>{
                        //             console.log("에러3");
                        //             if(err) throw err;
                        //             else {
                        //                 next();
                        //             }
                        //         })
                        //     }
                        // })
                    }
                })
            })
        } else {
            //주문
            req.session.sum = req.body.sum;
            req.session.price = req.body.price;
            res.redirect('/book/buy/' + req.params.book_num);
        }
    }

}




module.exports = bookController;
