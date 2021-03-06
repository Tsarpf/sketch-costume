var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    project_model = require('./app/models/project.js'),
    ProjectModel = mongoose.model('Project'),
    user_model = require('./app/models/user.js'),
    UserModel = mongoose.model('User'),
    task_model = require('./app/models/task.js'),
    TaskModel = mongoose.model('Task'),
    app = express();



var connect = function() {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect("mongodb://localhost/", options);
};

connect();
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.on('disconnected', connect);
mongoose.connection.on('connected', function(){
    console.log("(re)connected to database.");
});


var pub = __dirname + '/public';
app.use(express.static(pub));
app.use(bodyParser.urlencoded({extended:true}));

//Use jade
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');

var server = app.listen(7890, function() {
    console.log("serve running");
});


var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.render('index');
});


app.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

app.get('/project/:id', function(req, res) {
    var id = req.params.id;

    ProjectModel.find({_id: id}, function(err, doc) {
        res.render('project', {project: doc});
    });
});

io.on('connection', function(socket) {
    console.log("got new connection!");

    var username = "anon";
    socket.emit('hello', {testproperty: 'testvalue'});

    socket.on('login', function(data) {
        console.log(data);
        findUser(data.username, function(doc) {
            if(doc.password === data.password){
               socket.emit("loginSuccess", {}); 
               username = data.username;
            }
            else {
                socket.emit("loginFail", "No such user/password combo found");
            }
        });
    });

    socket.on('register', function(data) {
        findUser(data.username, function(doc) {
            if(!doc) { //If document doesn't already exist with given name then create new user
                var user = UserModel({
                    username: data.username,
                    password: data.password,
                    projects: []
                });
                
                user.save(function(err, doc) {
                    console.log("new user creation");
                    console.log(err);
                    console.log(doc);
                });

                socket.emit('registerSuccess', {});
            }
            else { //Username already taken
                socket.emit('registerFail', "username already taken");
            }
        });
    });

    socket.on('newTask', function(data) {
        var task = TaskModel({taskname: data.taskName, taskstatus: "not_started", projectid: data.projectId
        });        

        task.save(function(err, doc) {
            if(!err){
                getProjectData(data.projectId, function(doc) {
                    console.log(doc);
                    io.sockets.emit('projectData' + data.projectId, doc);
                });
            }
        });
    });

    socket.on('getAllProjects', function(data) {
        ProjectModel.find({}, function(err, docs) {
            var documents = [];
            for(var i = 0; i < docs.length; i++){
                documents.push({
                    id: String(docs[i]._id),
                    projectname: docs[i].projectname
                });
            }
            socket.emit('allProjects', {projects: documents});
        });
    });

    socket.on('getProject', function(data) {
        console.log(data);
        getProjectData(data.id, function(doc) {
            console.log(doc);
            socket.emit('projectData', doc);
        });
    });
    

    socket.on('newProject', function(data) {
        if(username == 'anon') {
            socket.emit('projectCreateFail', {error: 'Not logged in!'});
        }

        findUser(username, function (doc) {
            var project = ProjectModel({
                projectname: data.projectName,
                tasks: [],
                collaborators: [doc]
            });


            project.save(function(err, doc) {
                if(err){
                    console.log("error: " + err);
                    socket.emit('projectCreateFail', {error: err});
                    return;
                }

                console.log("new project created");
                console.log(doc);

                socket.emit('projectCreateSuccess', {id: doc.id});
            });
        });
    });

});

var getProjectData = function(id, callback) {
    ProjectModel.findOne({_id: id}).exec(function(err, doc){
        callback(doc);
    });
};

var findUser = function(username, callback) {
    UserModel.findOne({username: username}).exec(function(err, doc) {
        console.log("found user:");
        console.log(doc);
        callback(doc);
    });
}
