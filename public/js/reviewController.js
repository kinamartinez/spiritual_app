/**
 * Created by karina on 02/05/17.
 */
"use strict";
app.controller('reviewController', ["$scope", "reviewFactory", "relevantCook", "$http", 'authFactory', function ($scope, reviewFactory, relevantCook, $http, authFactory) {


    $scope.cook = relevantCook;
    // console.log(relevantCook);

    $scope.addReview = function (review) {
        let newReview = {
            text: review.text,
            author: $scope.currentUser
        };
        reviewFactory.addReview(newReview, $scope.cook._id)
            .then(function (reviews) {

                $scope.cook.reviews = reviews
            }, function (err) {
                console.error(err);
            });
    };

    $scope.upvote = function (user) {
        reviewFactory.upvote(user).then(function () {
            $scope.cook.upvotes++;
            console.log("i like it")
        });

    };

    $scope.downvote = function (user) {
        reviewFactory.downvote(user).then(function () {
            $scope.cook.downvotes++;
            console.log("i dislike it")
        });

    };

    $scope.deleteReview = function (reviewId) {
        var self = this;//this is the scope of a single review as defined by ng-repeat
        reviewFactory.deleteReview(reviewId, $scope.cook._id)
            .then(function (response) {
                console.log(response);
                $scope.cook.reviews.splice(self.$index, 1)
            }, function (err) {
                console.error(err);
            });
    }


}]);
