var express = require('express');
var router = express.Router();
var User = require("../app/model");
var passport = require('passport')

//the '/users' routes will go here

router.post('/register', function(req, res, next) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        cook: false,
        htmlverified: req.body.htmlverified,
        fullname: req.body.fullname
    }), req.body.password, function(err, user) {
        if (err) {
            console.log('Error registering!', err);
            return next(err);
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            res.send(req.user);
        });
    });
});

router.post('/registerCook', function(req, res, next) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        cook: true,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        location: [req.body.longitude, req.body.latitude],
        htmlverified: req.body.htmlverified,
        fullname: req.body.fullname
    }), req.body.password, function(err, user) {
        if (err) {
            console.log('Error registering!', err);
            return next(err);
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            res.send(req.user);
        });
    });
});

// ******** UNTIL HERE WORK IN PROGRESS **********//

router.post('/login', passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.send(req.user)
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/currentuser', function(req, res) {
    if (req.user) {
        return res.send(req.user)
    } else {
        return res.status(401).send('Doh');
    }
});



router.post('/query/', function(req, res) {

    // Grab all of the query parameters from the body.
    var lat = req.body.latitude;
    var long = req.body.longitude;
    var distance = req.body.distance;
    var favLang = req.body.favlang;


    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = User.find({});

    // ...include filter by Max Distance (converting Kms to meters)
    if (distance) {

        // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
        query = query.where('location').near({
            center: { type: 'Point', coordinates: [long, lat] },

            // Converting Kms to meters. Specifying spherical geometry (for globe)
            maxDistance: distance * 1000,
            spherical: true
        });
    }

    // ...include filter by Gender (all options)
    if (male || female || other) {
        query.or([{ 'gender': male }, { 'gender': female }, { 'gender': other }]);
    }

    // ...include filter by Type of Food
    if (favLang) {
        query = query.where('favlang').equals(favLang);
    }

    // ...include filter for Verified Locations
    if (reqVerified) {
        query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
    }

    // Execute Query and Return the Query Results
    query.exec(function(err, users) {
        if (err)
            res.send(err);

        // If no errors, respond with a JSON of all users that meet the criteria
        res.json(users);
    });
});

module.exports = router;