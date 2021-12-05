const pool = require("../../config/dbconfig")

class mainController {
    async bookInfo(req, res, next) {
        pool.getConnection((err, conn)=>{
          if(err) throw err;
          const sql = `SELECT * FROM books WHERE book_name LIKE "%${req.session.book_name}%" `;

          conn.query(sql, (err, row)=>{
              conn.release();
              if(err) throw err;
              req.bookinfo = row;
              next();
          })
      })
    }
    
    
}
  
  module.exports = mainController;
  