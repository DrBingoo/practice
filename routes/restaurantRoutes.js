const express = require('express');
const requireAuth = require('../middleware/authMiddleware')
const db = require('../db-connection.js');

const router = express.Router();


//get all restaurants
router.get('/restaurant', (req,res) => {
    let sql = `SELECT restaurant.restaurant_id,restaurant.name, restaurant.description, restaurant.poster, AVG(review.rating) AS average
            FROM restaurant_review.restaurant
            LEFT JOIN restaurant_review.review ON restaurant.restaurant_id = review.restaurantId 
            GROUP BY restaurant.name
            ORDER BY AVG(review.rating) DESC`
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if (status === 'failed'){
        db.query(sql, (err,result) => {
            if (err){
                throw err;
            }
            else{
                res.json({result,auth:false});
            }
        });
    }
    else{
        status.then(user_id => {
            db.query(sql, (err,result) => {
                if (err){
                    throw err;
                }
                else{
                    let sql2 = 'SELECT username FROM restaurant_review.users WHERE user_id = ?'
                    db.query(sql2, user_id, (err,result2) => {
                        if (err){
                            throw err;
                        }
                        else{
                            res.json({result,auth:result2[0].username});
                        }
                    })
                }
            });
        }).catch(err => res.json({result, auth:false}));
    }

});


//get details of 1 restaurant
router.get('/restaurant/:id', (req,res) => {
    const id = req.params.id;
    let data = undefined;
    let sql = 'SELECT * FROM restaurant_review.restaurant WHERE restaurant_id = ?';
    let sql2 = 'SELECT COUNT(review_id) AS Count, AVG(rating) AS Average FROM restaurant_review.review WHERE restaurantId = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        else{
            data = result;
            db.query(sql2,id, (err,avg_count) => {
                if (err){
                    throw err;
                }
                else{
                    res.json({data, avg_count});
                }
            });
        }
    });
});

//get reviews of restaurant
router.get('/restaurant/:id/reviews', (req,res) => {
    const id = req.params.id;
    let data = undefined;
    let sql = 'SELECT review.review_id,review.rating, review.comment, review.datePosted, users.username FROM restaurant_review.review JOIN restaurant_review.users ON users.user_id = review.userId WHERE review.restaurantId = ?';
    let sql2 = 'SELECT AVG(rating) AS Average, COUNT(review_id) AS Count FROM restaurant_review.review WHERE restaurantId = ?'
    db.query(sql,id, (err,result) => {
        if (err){
            throw err;
        }
        else{
            data = result;
            db.query(sql2,id, (err, avg_count) => {
                if (err){
                    throw err;
                }
                else{
                    res.json({data, avg_count});
                }
            })
        }
    });
});

//get photos of restaurant
router.get('/restaurant/:id/photos', (req,res) =>{
    const id = req.params.id;
    let sql = 'SELECT * FROM restaurant_review.photos WHERE restaurantId = ?';
    db.query(sql,id, (err,result) => {
        if (err){
            throw err;
        }
        else{
            res.json(result);
        }
    });
});

//insert new review
router.post('/restaurant/:id/reviews', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if(status === 'failed'){
        res.json({error : 'failed'});
    }
    else{
        status.then(user_id => {
            const id = req.params.id;
            let timestamp = new Date();
            let sql = 'INSERT INTO restaurant_review.review (rating, comment, datePosted, userId, restaurantId) VALUES (?,?,?,?,?)';
            let data = [req.body.rating, req.body.comment, timestamp.toString(), user_id, id];
            db.query(sql,data, (err,result) => {
                if (err){
                    throw err;
                }
                else{
                    res.json({user : 'success'});
                }
        });     
        }).catch(err => res.json({error : '/user/signup'}));
    }
    
});

//delete review
router.delete('/restaurant/:id/reviews/:R_id', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if(status === 'failed'){
        res.json({redirect : '/user/signup'});
    }
    else{
        status.then(user_id => {
            const id = req.params.R_id;
            let values = [id,user_id];
            let sql = 'DELETE FROM restaurant_review.review WHERE review_id = ? AND userId = ?';
            db.query(sql, values, (err,result) => {
                if (err){
                    throw err;
                }
                else{
                    if (result.affectedRows === 0){
                        res.json({error : 'The DELETE request had failed because the review is invalid or you attempted to delete a review that was not made by you'});
                    }
                    else{
                        res.json({user : 'success'});
                    }
                }
        });
        }).catch(err => res.json({redirect : '/user/signup'}));
    }
});

//edit review
router.put('/restaurant/:id/reviews/:R_id', (req,res) => {
    const token = req.cookies.jwt;
    const status = requireAuth(token);
    if(status === 'failed'){
        res.json({redirect : '/user/signup'});
    }
    else{
        status.then(user_id => {
            const id = req.params.R_id;
            let timestamp = new Date();
            let sql = 'UPDATE restaurant_review.review SET rating = ?, comment = ?, datePosted = ? WHERE review_id = ? AND userId = ?';
            let values = [req.body.updatedRating, req.body.updateComment, timestamp.toString(), id, user_id];
            db.query(sql, values, (err,result) => {
                if (err){
                    throw err;
                }
                else{
                    if (result.affectedRows === 0){
                        res.json({error : 'The UPDATE request had failed because the review is invalid or you attempted to edit a review that was not made by you'});
                    }
                    else{
                        res.json({user : 'success'});
                    }
                }
            });
        }).catch(err => res.json({redirect: '/user/signup'}))
    }
});

module.exports = router;

