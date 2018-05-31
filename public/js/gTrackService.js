'use strict';

// Creates the gservice factory.
// This will be the primary means of interaction with Google Maps

angular.module('gTrackService', [])
    .factory('gTrackService', function ($rootScope, $http) {


        // Initialize Variables
        // ---------------------------------------------------
        // Service our factory will return
        const googleMapService = {};

        let map;

        googleMapService.initMap = function (user) {
            console.log('user', user);
            const directionsService = new google.maps.DirectionsService;
            const directionsDisplay = new google.maps.DirectionsRenderer;

            const map = new google.maps.Map(document.getElementById('mapTrack'), {
                zoom: 6,
                center: {lat: user.latitude, lng: user.longitude},
            });
            directionsDisplay.setMap(map);


            calculateAndDisplayRoute(directionsService, directionsDisplay, user);

        };

        function calculateAndDisplayRoute(directionsService, directionsDisplay, user) {
            const waypts = [];
            const startLatPoint = user.location[1];
            const startLngPoint = user.location[0];

            const wayPointsArray = document.getElementById('waypoints');
            for (const wayPoint of user.foods) {
                waypts.push({
                    location: wayPoint.type,
                    stopover: true,
                });
            }
            const endPoint = waypts[waypts.length - 1];
            console.log('endPoint', endPoint);
            // let varee = use.foods.length -
            // lugares = for loop de foods.places - last

            directionsService.route({
                origin: {lat: startLatPoint, lng: startLngPoint},
                destination: endPoint,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: 'DRIVING',
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    const route = response.routes[0];
                    const summaryPanel = document.getElementById('directions-panel');
                    summaryPanel.innerHTML = '';
                    // For each route, display summary information.
                    for (let i = 0; i < route.legs.length; i++) {
                        const routeSegment = i + 1;
                        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                            '</b><br>';
                        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                    }
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        };

        // Initializes the map


        return googleMapService;

    });