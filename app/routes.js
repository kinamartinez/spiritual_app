// Dependencies
const mongoose = require('mongoose');
const User = require('./model.js');
const expressJWT = require('express-jwt');
const ensureAuthenticated = expressJWT({ secret: 'thisIsTopSecret' });

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        const query = User.find({});
        query.exec(function(err, users) {
            if (err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            // console.log(users);
            return res.json(users);
        });
    });





    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res) {

        // Grab all of the query parameters from the body.
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var distance = req.body.distance;
        var male = req.body.male;
        var female = req.body.female;
        var other = req.body.other;
        var favLang = req.body.favlang;
        var reqVerified = req.body.reqVerified;

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
};