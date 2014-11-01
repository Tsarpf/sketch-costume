var app = angular.module('TaskManager', []);

var username = "anon";

app.value('username', 'anon');

app.controller("ProjectsController", ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    $scope.target = "everyone";
    //console.log("ses " + global.loggedIn);
    $scope.projects = ['test', 'ses'];
}]);

app.controller("NewProjectController", ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    $scope.projectName = "";

    socket.on('projectCreateSuccess', function(data) {
       console.log('succesful project creation: ' + data); 
    });
    $scope.submit = function() {
        var obj = {projectName: $scope.projectName};
        socket.emit('newProject', obj);
        $scope.projectName = "";
    };
}]);


app.controller("UserHeaderController", ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    $rootScope.global = {loggedIn: false, username: 'anon'};
    //console.log("ses " + global.loggedIn);
    $scope.logIn = function() {
        var obj = {};
        obj.username = $scope.username;
        obj.password = $scope.password;

        $rootScope.global.username = $scope.username;
        socket.emit('login', obj);
    }
    $scope.logout = function() {
        $rootScope.global.loggedIn = false;
        $rootScope.global.username = "anon";
    };

    socket.on('loginSuccess', function(data) {
        console.log(data);
        $rootScope.global.loggedIn = true;
    });


    socket.on('loginFail', function(data) {
        console.log("login fail: " +  data);
        $rootScope.global.username = "anon";
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
