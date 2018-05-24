/**
 * Created by karina on 02/05/17.
 */
"use strict";
app.factory('reviewFactory', function ($http) {

    const reviewFactory = {};

    reviewFactory.addReview = function (review, userId) {
        return $http.post('/review/' + userId, review)
            .then(function (response) {
                console.log("from the factory");
                console.log(response);
                return response.data
            })
    };

    reviewFactory.upvote = function (userToUpvote) {
        console.log("user to upvote!" + userToUpvote);
        return $http.post('/review/'+ userToUpvote + '/upvote', null)
            .then(function (response) {
           //     console.log("aqui desde el upvote en factory!", response.data);
                return response.data;

            }, function (err) {
                console.error(err.data.message)
            });
    };

    reviewFactory.downvote = function (userToDownvote) {
        console.log("user to downvote" + userToDownvote);
        return $http.post('/review/' + userToDownvote + '/downvote', null)
            .then(function (response) {
                console.log("aqui desde el downvote en factory!", response);

                return response.data;

            }, function (err) {
                console.error(err.data.message)
            });
    };

    reviewFactory.deleteReview = function (reviewId, cookId) {
        return $http.delete('/review/' + reviewId + '/' + cookId)
            .then(function(response) {
                return response.data
            })
    }

    return reviewFactory;

})
;
