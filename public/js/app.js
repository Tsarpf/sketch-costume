var app = angular.module('TaskManager', []);

var username = "anon";

app.value('username', 'anon');

app.controller("ProjectsController", ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    $scope.viewing = [];
    socket.on('allProjects', function(data) {
        console.log(data.projects);
        $scope.projects = data.projects;
    });
    var showing = {};
    $scope.show=function(id){
        for(var i = 0; i < $scope.projects.length; i++){
            if(!showing.hasOwnProperty(id) && $scope.projects[i].id === id){
                $scope.viewing.push($scope.projects[i]);
                showing[id] = "ses";
            }
        }
    };
    socket.emit('getAllProjects', {value:"value"});
    $scope.target = "everyone";
    //console.log("ses " + global.loggedIn);
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
        socket.emit('getAllProjects', {});
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

app.controller("ProjectController", ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    $scope.taskName = "";
    $scope.submit = function() {
        socket.emit('newTask', {projectId: $scope.projectId, taskName: $scope.taskName});
    };
    $scope.projectData = {};
    socket.on("projectData" + projectId, function(data) {
            $scope.projectData = data; 
    });
    socket.emit("getProject", {id: $scope.projectId});
}]);

app.directive("scProject", function() {
    return {
        restrict: "E",
        templateUrl: '/partials/newproject',
        link: function(scope, element, attrs) {
            console.log(attrs.projectId);
            scope.projectId = attrs.projectId;
         }
    }
})

app.directive('scNewProject', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/newproject',
        link: function(scope, element, attrs) {
        
        }

    };
});

/*
app.directive('', function() {
    return {
        restrict: "E",
        templateUrl: '/partials/projects',
        link: function(scope, element, attrs) {
            //scope.roomName='room' + attrs.roomName;
        }
    };
});
*/

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
