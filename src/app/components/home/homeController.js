app.controller('HomeCtrl', function($scope, $location, $http) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
})
