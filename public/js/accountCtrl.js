
app.controller('accountCtrl', function($scope, myData, $state, $rootScope) {
    console.log(myData.data)
    $rootScope.user = myData.data

});