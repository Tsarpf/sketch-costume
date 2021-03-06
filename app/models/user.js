var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String
    },

    password: {
        type: String
    },

    projects: [{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Project'
    }]
});

UserSchema.methods = {
}

UserSchema.statics = {
}


var User = mongoose.model('User', UserSchema);


