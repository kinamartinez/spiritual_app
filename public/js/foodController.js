app.controller('foodController', function ($scope, users) {

    $scope.users = users.data;
    console.log(users);
    

});