app.controller('masterController', function($scope, $rootScope, authFactory) {
    authFactory.getCurrentUser().then(function(data) {
        $rootScope.currentUser = data
    });
});