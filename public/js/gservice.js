"use strict";

// Creates the gservice factory.
// This will be the primary means of interaction with Google Maps

angular.module('gservice', [])
    .factory('gservice', function ($rootScope, $http) {


        // Initialize Variables
        // ---------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected location (initialize to center of Israel)
        var defaultLat = 32.074466;
        var defaultLng = 34.791598;

        // Handling clicks and location selection
        googleMapService.clickLat = 0;
        googleMapService.clickLong = 0;

        // Functions
        // ---------------------------------------------------
        // Refresh the Map with new data
        // Functions will take new latitude and longitude coordinates

        googleMapService.refresh = function (latitude, longitude, filteredResults) {

            console.log(`refresh(lat=${latitude}, lng=${longitude}, ${filteredResults})`);

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones
            // provided on the refresh() call
            //defaultLat = latitude;
            //defaultLng = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults) {

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db

                $http.get('/users').success(function (response) {

                    // Convert the results into Google Map Format
                    locations = convertToMapPoints(response);

                    // Then initialize the map-- noting that no filter was used.
                    initialize(latitude, longitude, false);

                }) // end success(...)
                    .error(function () {
                    });
            }
        }; // end googleMapService.refresh = function( ... )

        // Private Inner Functions
        // ---------------------------------------------------
        // Convert a JSON of users into map points

        var convertToMapPoints = function (response) {

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided
            // as response of call to API
            console.log(response);
            for (var i = 0; i < response.length; i++) {

                var user = response[i];

                console.log("adding location:", user.latitude, user.longitude);

                // Create popup windows for each record
                var contentString =
                    '<p><b>Username</b>: ' + user.username +
                    '<br><b>Email</b>: ' + user.email +
                    '<br><a href="/map/list">Find me on the menu</a>'+
                '</p>';

                // Converts each of the JSON records into Google Maps
                // Location format
                // (Note: [Lat,Lng] format)
                locations.push({

                    latlon: new google.maps.LatLng(user.latitude, user.longitude),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    // gender: user.gender,
                    // // age: user.age,
                    // favlang: user.favlang

                }); // end locations.push()

            } // end for loop over users

            // location is now an array populated with records in Google Maps format
            return locations

        }; // end convertToMapPoints function definition

        // Initializes the map
        var map;

        var initialize = function (latitude, longitude, filter) {

            console.log(`initialize(${latitude}, ${longitude}, ${filter})`);

            // Uses the selected lat, long as a starting point
            var myLatLong = {lat: latitude, lng: longitude};
            myLatLong = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

            // If map has not been created already ...
            if (!map) {

                // Create a new map and place it in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: myLatLong
                });

            } // end if(!map)

            // If a filter was used set the icons yellow, otherwise blue


            // if (filter) {
            //
            //     icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            //
            // }
            // else {
            //     icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            // }

            // Loop through each location in the array and place a marker
            locations.forEach(function (n, i) {

                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function (e) {

                    // when clicked, open the selected marker's message
                    //currentSelectedMarker = n;
                    n.message.open(map, marker);

                }); // end google.maps.event.addListener(...,function(e){...

            }); // end locations.forEach(function(...))

            // Bouncing red marker logic
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            });

            var lastMarker = marker;

            // Function for moving to a selected location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clicking on the Map moves the bouncing red marker
            google.maps.event.addListener(map, 'click', function (e) {
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"

                });

                // When a new spot is selected, delete the old red bouncing marker
                if (lastMarker) {
                    lastMarker.setMap(null);
                }

                // create a new red bouncing marker and move to it
                lastMarker = marker;
                map.panTo(marker.position);

                // Update broadcasted variable
                // (lets the panel know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();

                $rootScope.$broadcast('clicked');

            }); // end google.maps.event.addListener(map, 'click', function(e){...

        }; // end var initialize = function(...)

        // Refresh the page upon window load.
        // Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(defaultLat, defaultLng));

        return googleMapService;

    }); // end .factory('gservice'...)