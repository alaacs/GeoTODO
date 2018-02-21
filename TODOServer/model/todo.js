var db = require("./db");

var todo = db.model('todos', {
    id: {type: String, required: true},
    name: {type: String, required: true},
});

module.exports = todo;
