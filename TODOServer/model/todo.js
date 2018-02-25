var db = require("./db");

var todo = db.model('todos', {
    id: {type: Number, required: true},
    title: {type: String, required: true},
});

module.exports = todo;
