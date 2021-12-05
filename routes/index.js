var main = require('./main');
var users = require('./users');
var book = require('./book');
var order = require('./order');
const { get } = require('./main');

const getRouter = (path, controller)=>({path, controller});

const route = [
  getRouter('/', main),
  getRouter('/users', users),
  getRouter('/book', book),
  getRouter('/order', order),
  getRouter('/*', (req, res)=>{
    res.send({
      status : 404,
      message : 'Empty API',
    })
  })
]

module.exports = route;