const pool = require("../../config/dbconfig")

class usersController {

    // 회원가입
    async userjoinInput(req, res, next) {
        console.log(req.body);
    
        const user = req.body;

        pool.getConnection((err, conn) => {
            if(err) throw res.json({success: false, err});
            else{
                var val = [user.user_id, user.user_pw, user.user_name]
                const {user_id, user_pw, user_name} = req.body
                console.log(val)
                var sql = "INSERT INTO users VALUES (?,?,?)";
                conn.query(sql, val, (err, row)=>{
                    conn.release();
                    if(err) {
                        if (req.body.user_id == undefined || req.body.user_pw == undefined || req.body.user_name == undefined){
                            console.log("33333"+user.user_id);
                            res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
                        }
                        else {
                            res.send('<script type="text/javascript">alert("아이디가 중복입니다.");history.back();</script>');
                        }
                        
                    }
                    else{
                            next();
                        }
                })               
            }
        })
    }
    

    // 로그인
    async userLogin(req, res, next){
        const {user_id, user_pw } = req.body;
        console.log(req.body);

        pool.getConnection((err, conn) => {
            if(err) throw err;
            else{
               
                var sql = `SELECT * FROM users WHERE user_id = "${user_id }" AND user_pw = "${user_pw }"`;

                conn.query(sql, (err, row)=>{
                    conn.release();
                    if(err) throw err;
                    else {
                        if(row.length === 0){
                            res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");history.back();</script>');
                        }else{
                            req.session.user_id = row[0].user_id;
                            console.log(row[0].user_id, row[0].user_pw, row[0].user_pw);
                            next();  
                        }

                    }
                })
            }
        })
    }


    // 카드등록
    async inputCard(req, res, next) {
        console.log(req.body);
    
        const card = req.body;

        pool.getConnection((err, conn) => {
            if(err) throw res.json({success: false, err});
            else{
                var val = [card.card_num, card.card_date, card.card_kind, req.session.user_id]
                const {card_num, card_date, card_kind} = req.body
                console.log(val)
                var sql = "INSERT INTO cards VALUES (?,?,?,?)";
                conn.query(sql, val, (err, row)=>{
                    conn.release();
                    if(err) {
                        if (card.card_num == '' || card.card_date == '' || card.card_kind == ''){
                            res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");location.href="/";</script>');
                        }
                        else {
                            res.send('<script type="text/javascript">alert("이미 있는 카드 입니다.");location.href="/";</script>');
                        }
                    }
                    else{
                            next();
                        }
                })               
            }
        })
    }


    //쿠폰등록
    async insertCoupon(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw res.json({success: false, err});

            else {
                const sql = `INSERT INTO Coupon(coupon_id, coupon_kind, users_user_id, coupon_startDate, coupon_lastDate,) VALUES (?,?,?,?,?)`;

                const val = [req.body.coupon_id, req.body.coupon_kind, req.body.user_id, req.body.coupon_startDate, req.body.coupon_lastDate];
    
                conn.query(sql, val, (err, row) => {
                    if (err) throw err;
                    else {
                        next();
                    }
                })
            }
            
        })

    }

    // 배송지등록
    async inputPlace(req, res, next) {
        console.log(req.body);
    
        const place = req.body;

        pool.getConnection((err, conn) => {
            if(err) throw res.json({success: false, err});
            else{
                var val = [place.place_num, place.place_addr, place.place_addrinfo, req.session.user_id]
                const {place_num, place_addr, place_addrinfo} = req.body
                console.log(val)
                var sql = "INSERT INTO places (place_num, place_addr, place_addrinfo, users_user_id) VALUES (?,?,?,?)";
                conn.query(sql, val, (err, row)=>{
                    conn.release();
                    if(err) {
                        if (place.place_num == '' || place.place_addr == '' || place.place_addrinfo == ''){
                            res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");location.href="/";</script>');
                        }
                        else {
                            res.send('<script type="text/javascript">alert("이미 있는 배송지 입니다.");location.href="/";</script>');
                        }
                    }
                    else{
                            next();
                        }
                })               
            }
        })
    }


    //등록 쿠폰 정보 가져오기
    async getCouponInfo(req, res, next) {
        
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = `SELECT * FROM Coupon WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row)=>{
                conn.release();
                if(err) throw err;
                
                req.couponinfo = row;
                next();
            })
        })
    }


    //등록 카드 정보 가져오기
    async getCardInfo(req, res, next) {
        
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = `SELECT * FROM cards WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row)=>{
                conn.release();
                if(err) throw err;
                req.cardinfo = row;
                next();
            })
        })
    }

    
    //카드정보 삭제
    async deleteCard(req,res,next){

        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = `DELETE FROM cards WHERE card_num = "${req.params.card_num}"`
            conn.query(sql, (err, row)=>{
                conn.release();
                if(err) throw err;
                else{
                    next();
                }
            })
        })
    }


    //등록 배송 정보 가져오기
    async getPlaceInfo(req, res, next) {
        
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = `SELECT * FROM places WHERE users_user_id ="${req.session.user_id}"`;

            conn.query(sql, (err, row)=>{
                conn.release();
                if(err) throw err;
                req.placeinfo = row;
                next();
            })
        })
    }


    //배송정보 삭제
    async deletePlace(req,res,next){

        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = `DELETE FROM places WHERE place_id = "${req.params.place_id}"`

            conn.query(sql, (err, row)=>{
                console.log
                conn.release();
                if(err) throw err;
                else{
                    next();
                }
            })
        })
    }


    // 배송지 수정
    async updatePlace(req, res, next) {
        pool.getConnection((err, conn) => {
            if(err) throw err;

            const place = req.body;

            const sql = `UPDATE places SET place_num = ?, place_addr = ?, place_addrinfo= ? WHERE place_id = "${req.params.place_id}"`;
            const val = [req.body.place_num, req.body.place_addr, req.body.place_addrinfo];

            conn.query(sql, val, (err, row)=>{
                if (err) {
                    if (place.place_num == '' || place.place_addr == '' || place.place_addrinfo == ''){
                        res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");location.href="/";</script>');
                    }
                    else {
                        res.send('<script type="text/javascript">alert("이미 있는 배송지 입니다.");location.href="/";</script>');
                    }
                }
    
                else {
                    next();
                }
            })
        })
    }




    




}
  
  module.exports = usersController;
  