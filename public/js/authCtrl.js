"use strict";

app.controller('authCtrl', function($scope, authFactory, $state, $rootScope, geolocation, gservice) {

    $scope.user = {};
    let coords = {};
    let lat = 0;
    let long = 0;

    // Set initial coordinates to the center of the Israel
    $scope.user.latitude = 32.074466;
    $scope.user.longitude = 34.791598;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data) {

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = { lat: data.coords.latitude, long: data.coords.longitude };

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.user.latitude = parseFloat(coords.lat).toFixed(3);
        $scope.user.longitude = parseFloat(coords.long).toFixed(3);

        // Display message confirming that the coordinates verified.
        $scope.user.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.user.latitude, $scope.user.longitude);

    });

    // Functions
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function() {

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function() {
            $scope.user.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.user.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Hey (You are not in this location...)";
        });
    });

    $scope.register = function() {
        authFactory.register($scope.user)
            .then(function(user) {
                $rootScope.currentUser = user.username;

                $state.go('map.find');
            }, function(err) {
                alert(err.data.message);
            });
    };
    $scope.registerCook = function() {
        authFactory.registerCook($scope.user)
            .then(function(user) {
                $rootScope.currentUser = user.username;
                $state.go('account');
            }, function(err) {
                alert(err.data.message);
            });
    };
    $scope.login = function() {
        authFactory.login($scope.user)
            .then(function(user) {
                $rootScope.currentUser = user;
                if( $rootScope.currentUser.cook) {
                    $state.go('account');
                }else {
                    $state.go('map.find');
                }
            }, function(err) {
                alert(err.data);
            });
    }
});