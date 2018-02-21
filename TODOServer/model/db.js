var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/geotodo");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error."));
db.on("open", function () {
    console.log("Mongodb connected");
});

module.exports = mongoose;
