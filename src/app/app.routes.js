app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/app/components/home/homeView.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
        })
        .otherwise({
            redirectTo: '/'
        })

    $locationProvider.html5mode(true);

}).run(['$rootScope', '$location', function($rootScope, $location) {
    var path = function() {
        return $location.path();
    }

    $rootScope.$watch(path, function(newVal) {
        $rootScope.activetab = newVal;
    });
}])
