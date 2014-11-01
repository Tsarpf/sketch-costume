var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    taskname: {
        type: String
    },

    taskstatus: {
       type: String 
    },

    projectid: {
        type: String
    }
    
});

TaskSchema.methods = {
}

TaskSchema.statics = {
}


var Task = mongoose.model('Task', TaskSchema);
