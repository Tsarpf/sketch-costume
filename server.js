var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
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

io.on('connection', function(socket) {
    socket.emit('hello', {property: 'value'});

    socket.on('msg', function(data) {
        
    });

});