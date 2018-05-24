// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', [
    'ui.router',
    'addCtrl',
    'queryCtrl',
    'geolocation',
    'gservice'

]);


// Configures Angular routing -- showing the relevant view and controller when needed.
//'authProvider','$httpProvider', 'jwtInterceptorProvider',
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$provide',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $stateProvider

            .state('map.join', {
                url: '/join',
                controller: 'authCtrl',
                templateUrl: 'partials/addForm.html',

                // Find Home Cooks Control Panel
            })


            .state('map.list', {
                url: '/list',
                templateUrl: 'partials/list.html',
                controller: 'foodController',
                resolve: {
                    users: function ($http) {
                        return $http.get('/users')
                            .catch(function (err) {
                                console.log(err)
                            }); // post es la ruta que le dimos en el server.js
                    }
                }
                // All else forward to the Join Home Cook Team Control Panel
            })
            .state('profile', {
                url: '/profile/:id',
                templateUrl: 'partials/profile.html',
                controller: 'reviewController',
                resolve: {

                    relevantCook: ["authFactory", "$stateParams", "$http", function (authFactory, $stateParams, $http) {
                        let userId = $stateParams.id;
                        console.log("getting review from: ", "/review/" + userId);
                        return $http.get("/review/" + userId).then(function (theWholeUserObj) {
                            // console.log("the next obj comes from app.js - Profile State");
                            // console.log(theWholeUserObj.data);
                            // console.log("this is the users reviews");
                            // console.log(theWholeUserObj.data.reviews);
                            return theWholeUserObj.data;
                        })
                    }]

                }
            })


            .state('orderForm', {
                url: '/orderForm',
                controller: 'foodController',
                templateUrl: 'partials/orderForm.html',

                // All else forward to the Join Home Cook Team Control Panel
            })
            .state('home', {
                url: '/home',
                templateUrl: 'js/components/home/home.tpl.html',
            })

            .state('aboutUs', {
                url: '/aboutUs',
                templateUrl: 'partials/aboutUs.html',
            })

            .state('account.addFood', {
                url: '/addFood',
                templateUrl: 'partials/addFood.html',

                // All else forward to the Join Home Cook Team Control Panel
            })

            .state('map', {
                url: '/map',
                templateUrl: 'partials/map.html',
                controller: 'queryCtrl'
            })
            .state('map.find', {
                url: '/find',
                templateUrl: 'partials/queryForm.html',
                controller: 'authCtrl'
                // All else forward to the Join Home Cook Team Control Panel
            })
            .state('register', {
                url: '/register',
                templateUrl: '/partials/userRegistration.html',
                controller: 'authCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/partials/login.html',
                controller: 'authCtrl'
            })
            .state('account', {
                url: '/myAccount',
                templateUrl: '/partials/account.html',
                controller: 'accountCtrl',
                resolve: {
                    myData: function ($http, $state) {
                        console.log('yup');
                        return $http.get('/account/updateProfile')
                            .catch(function (err) {
                                console.log('yes i am');
                                $state.go('home')
                            })
                    }
                }
            });

        $urlRouterProvider.otherwise('/home');
    }
]);