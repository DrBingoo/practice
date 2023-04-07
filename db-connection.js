const sql = require('mysql');

const db = sql.createPool({
    host:'localhost',
    port:'3304',
    user:'root',
    password:'',
    database:'restaurant_review'
});

module.exports = db