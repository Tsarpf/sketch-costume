var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    projectname: {
        type: String
    },

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Task'
    }],

    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

ProjectSchema.methods = {
}

ProjectSchema.statics = {

}


var Project = mongoose.model('Project', ProjectSchema);

