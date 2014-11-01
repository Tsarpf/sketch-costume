var app = angular.module('TaskManager', []);

var username = "anon";

app.value('loggedIn', true);
app.controller("ProjectsController", ['$scope', 'socket', 'loggedIn', function($scope, socket, loggedIn) {
    $scope.target = "everyone";
    console.log("ses" + loggedIn);
    $scope.projects = ['test', 'ses'];
}]).value;

app.controller("NewProjectController", ['$scope', 'socket', 'loggedIn', function($scope, socket, loggedIn) {
    $scope.projectName = "";
    $scope.loggedIn = loggedIn;
    $scope.submit = function() {
        //submit something
        //socket.emit etc
    };
}]);

app.controller("UserHeaderController", ['$scope', 'socket', 'loggedIn', function($scope, socket, loggedIn) {
    $scope.loggedIn = loggedIn;
}]).;

app.directive('scNewProject', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/newproject',
        link: function(scope, element, attrs) {
        
        }

    };
});


app.directive('scProjects', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/projects',
        link: function(scope, element, attrs) {
            scope.roomName='room' + attrs.roomName;
        }
    };
});

app.directive('scUserheader', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/userheader',
        link: function(scope, element, attrs) {
            scope.roomName='room' + attrs.roomName;
        }
    };
});

app.factory('socket', function($rootScope) {
    var socket = io('datisbox.net:7890');
    return {
        on: function(channel, callback) {
            socket.on(channel, function () {
                var args = arguments; 
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        emit: function(channel, data, callback) {
            socket.emit(channel, data, function() {
                var args = arguments; 
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
