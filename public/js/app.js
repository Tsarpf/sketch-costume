var app = angular.module('TaskManager', []);

var username = "anon";

app.value('loggedIn', true);
app.value('username', 'anon');

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
    $scope.username = "";
    $scope.password = "";
    $scope.logIn = function() {
        var obj = {};
        obj.username = $scope.username;
        obj.password = $scope.password;

        socket.emit('login', obj);
    }

    socket.on('loginSuccess', function(data) {
        console.log(data);
        $scope.loggedIn = true;
    });


    socket.on('loginFail', function(data) {
        console.log(data);
    });
}]);

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
            //scope.roomName='room' + attrs.roomName;
        }
    };
});

app.directive('scUserHeader', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/userheader',
        link: function(scope, element, attrs) {
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
