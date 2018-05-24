var express = require('express');
var router = express.Router();
var User = require("../app/model");
var Review = require("../app/reviewModel");
var passport = require('passport');

// ******** WORK IN PROGRESS **********

router.get('/updateProfile', (req, res, next) => {
    return res.send(req.user);
});

router.post('/updateProfile', (req, res, next) => {

    //const errors = req.validationErrors();

    User.findById(req.user._id, (err, user) => {
        // http://localhost:3000/users/currentUser
        // console.log(req.user.id);
        if (err) {
            return next(err);
        }

        user.email = req.body.email || '';
        user.username = req.body.username || '';
        user.fullname = req.body.fullname || '';
        user.cookPic = req.body.image || '';
        user.descrip = req.body.descrip || '';
        user.phoneNumber = req.body.phoneNumber || '';
        user.place = req.body.place || '';
        // user.cook = x || '';

        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    // req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                    return res.redirect('/myAccount');
                }
                return next(err);
            }
            //req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/myAccount');
        });
    });
});

// Add Product

router.post('/addfood', (req, res, next) => {

    var Food = {
        dish: req.body.dish,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        img: req.body.img,
        options: req.body.options,
        availability: req.body.availability
    };

    //const errors = req.validationErrors();


    User.findById(req.user._id, (err, user) => {
        // console.log(req.user.id)
        if (err) {
            return next(err);
        }
        if (req.user.cook) {
            user.foods.push(Food)

            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        // req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                        return res.redirect('/home');
                    }
                    return next(err);
                }
                //req.flash('success', { msg: 'Profile information has been updated.' });
                res.redirect('/home');
            });
        }
        else {
            // console.log("not a cook");
        }
    });
});


module.exports = router;