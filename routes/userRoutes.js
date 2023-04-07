const express = require('express');
const db = require('../db-connection.js');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router();


//insert new user 
router.post('/user/signup',(req, res) => {
    let sql = 'INSERT INTO restaurant_review.users (username,password,first_name,last_name,gender,address,mobile_number,email_address) VALUES(?,?,?,?,?,?,?,?)';
    let sql2 = 'SELECT user_id FROM restaurant_review.users WHERE username = ?'
    let values = [req.body.username,req.body.password,req.body.first_name,req.body.last_name,
        req.body.gender,req.body.address,req.body.mobile_number,req.body.email_address];
    db.query(sql, values, (err,result) => {
        if (err){
            throw err;
        }
        else{
            db.query(sql2, req.body.username, (err,result2) => {
                if (err) {
                    throw err;
                }
                else{
                    const token = createToken(result2[0].user_id);
                    res.cookie('jwt', token, { httpOnly : true, maxAge : 24*60*60*1000});
                    res.redirect('/');

                }
            })
        }
    })
});

//login user
router.post('/user/login', (req,res) => {
    let sql = 'SELECT * FROM restaurant_review.users WHERE username = ?';
    db.query(sql, req.body.username, (err,result) => {
        if (err) {
            throw err;
        }
        else{
            if (result.length > 0){
                if (req.body.password === result[0].password){
                    const token = createToken(result[0].user_id);
                    res.cookie('jwt', token, { httpOnly : true, maxAge : 24*60*60*1000});
                    res.json({user : 'success'});
                }
                else{
                    res.json({errors : 'Incorrect password'});
                }
            }
            else{
                res.json({errors : 'Incorrect username'});
            }
        }
    });
    
});

router.get('/user/info', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if (status === 'failed') {
        res.json({redirect:'/user/signup'});
    }
    else{
        status.then(user_id => {
            let sql = 'SELECT * FROM restaurant_review.users WHERE user_id = ?';
            db.query(sql, user_id, (err, result) => {
                res.json(result)
            })
        })
        .catch(err => res.json({redirect:'/user/signup'}));
    }
})

//edit profile details
router.put('/user/profile', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if (status === 'failed') {
        res.json({redirect:'/user/signup'});
    }
    else{
        status.then(user_id => {
            let sql = 'UPDATE restaurant_review.users SET username = ?,password =?,first_name = ?,last_name = ?,gender = ?,address = ?,mobile_number = ?,email_address = ? WHERE user_id = ?';
            let values = [req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.gender, req.body.address, req.body.number, req.body.email, user_id]
            db.query(sql, values, (err, result) => {
                if (err){
                    throw err;
                }
                else{
                    res.json({user : 'success'})
                }
            })
        })
        .catch(err => res.json({redirect:'/user/signup'}));
    }

});

//delete user
router.delete('/user/profile', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if (status === 'failed') {
        res.json({redirect:'/user/signup'});
    }
    else{
        status.then(user_id => {
            let sql = 'DELETE FROM restaurant_review.users WHERE user_id = ?';
            db.query(sql, user_id, (err, result) => {
                if (err){
                    throw err;
                }
                else{
                    res.cookie('jwt', '', {maxAge:1})
                    res.json({user : 'success'})
                }
            })
        })
        .catch(err => res.json({redirect:'/user/signup'}));
    }

});

router.get('/user/logout', (req,res) => {
    res.cookie('jwt','', {maxAge : 1});
    res.redirect('/');
});

function createToken(id){
    return jwt.sign({ id }, 'This secret should be long', {expiresIn: '1d'});
}

module.exports = router;