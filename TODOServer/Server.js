var express = require('express');
var app = express();
var port = 2000;

var bodyParser = require("body-parser");
app.use(bodyParser.json());

// Adds a static folder to host applications in the server

app.use(express.static('./TODOclient'));

var todo = require("./model/todo")

// Allow cross origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/todos", function(req, res, next) {
    //var stream = todo.find().stream();
    //var results = {};
    todo.find(function(err, results){
      if(err) {
            res.status(500);
            next("Internal server error.");
        } else if(results == null || results.length == 0) {
            res.status(404); // Not found
            next("No TODOs found in the DB");
        } else {
            res.status(200);
            res.json(results);
        }
    });
});

app.get("/todos/:id", function(req, res, next) {
    var idTodo = req.params.id;

    todo.findOne({id: idTodo}, function(err,result) {
        if(err) {
            res.status(500);
            next("Internal server error.");
        } else if(result == null) {
            res.status(404); // Not found
            next("No Todo with code " + idTodo + " found.");
        } else {
            res.status(200);
            res.json(result);
        }
    });
});

app.post("/todos", function(req, res, next) {

  var idNewTodo = req.body.id;
  //console.log("Id: " + idTodo);
//  const newTodo = req.body;

  console.log(req.body);
  console.log(req.body.id);

  todo.findOne({
    id:  idNewTodo
  }, function(err, result) {
    if (err) {
      res.status(500);
      next("Internal server error.");
    } else if (result != null) {
      res.status(400);
      res.send("Todo already exists");
    } else {
      res.status(200);
      todo.create(
         req.body,
        function(err, result) {
          if (err) {
            res.status(500);
            next("Internal server error.");
          } else {
            res.status(201);
            res.set("Location", "http://localhost:2000/todos/" + idNewTodo)
            res.send()
            next("New todo added to the list.");
          }
        }
      );
    }
  });


});


app.delete("/todos/:id", function(req, res, next) {
  var idTodo = req.params.id;
  todo.remove({
    "id": idTodo
  }, function(err, result) {
    if (err) {
      res.status(500);
      res.send();
    } else if (result.n == 0) {
      res.status(404);
      next("Product with id: " + idTodo + " is not in our catalog.");
    } else {
      res.status(200)
      res.send();
    }
  })
});


var server = app.listen(port, function() {
  console.log('Server running at http://127.0.0.1:' + port);
});
