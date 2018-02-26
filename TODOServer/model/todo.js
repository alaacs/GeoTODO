var db = require("./db");

var todo = db.model('todos', {
    //id: {type: Number, required: true},
    title: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    due_date: {type: Date},
    postal_address:{type:String}

});

module.exports = todo;
