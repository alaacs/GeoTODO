# GeoTODO

## Description
GeoTODO was developed as the final assignment for the Web Development course for the Master in Geospatial Technologies at Universitat Jaume I. The simple web application serves as a Todo list, but has extended interactive map functionality. Users can create new errands or tasks as map markers on a web map, then add a due date and a description.

## Applied Technologies
GeoTODO is a MEAN web application, referring to the applied technologies:
* [**M**ongoDB](https://www.mongodb.com/)
* [**E**xpressJS](https://expressjs.com/)
* [**A**ngularJS](https://angularjs.org/)
* [**N**odeJS](https://nodejs.org/en/)

TODO list items are saved in a MongoDB noSQL database. They are created, read, updated and deleted using a RESTful interface. CRUD operations are defined in a NodeJS Express server. The Client interface is developed using AngularJS, ensuring a dynamic Model-View-Controller architecture.

## Prerequisites:
To install and run GeoTODO the following software need to be installed locally:
* Git
* MongoDB
* NodeJS

## Install & Run
1. In your console (cmd, gitbash...), clone Git repository and enter the directory:
  ```
  git clone https://github.com/alaacs/GeoTODO
  cd GeoTODO
  ```

2. Enter the client and server folders and install node modules (make sure to run both code blocks from the root directory):
  ```
  cd TODOClient
  npm install
  ```

  ```
  cd TODOServer
  npm install
  ```
3. Create and seed the GeoTODO database:
* Make sure MongoDB Server is running (execute mongod.exe in your MongoDB root directory)
* Run the MongoDB shell (execute mongo.exe in your MongoDB root directory)
* Copy, paste and execute the following code in the shell:
```
  use geotodo;
  db.todos.save({"id": 1, "title": "To do number 1", "due_date": ISODate("2018-02-30"), "lat":39.9772525, "lng": 0.0210959});
  db.todos.save({"id": 2, "title": "To do number 2", "due_date": ISODate("2018-04-03"), "lat":39.9935806, "lng": -0.0864501});
  db.todos.save({"id": 3, "title": "To do number 3", "due_date": ISODate("2018-03-13"), "lat":39.972882, "lng": -0.0515582});
  db.todos.save({"id": 4, "title": "To do number 4", "due_date": ISODate("2018-02-20"), "lat":39.9966783, "lng": -0.0290749});
  db.todos.save({"id": 5, "title": "To do number 5", "due_date": ISODate("2018-03-08"), "lat":39.9766175, "lng": -0.0530854149125489});
  db.todos.save({"id": 6, "title": "To do number 6", "due_date": ISODate("2018-04-01"), "lat":40.0000804, "lng": -0.0659982});
  db.todos.save({"id": 7, "title": "To do number 7", "due_date": ISODate("2018-06-02"), "lat":39.9624566, "lng": -0.0172195});
  db.todos.save({"id": 8, "title": "To do number 8", "due_date": ISODate("2018-02-26"), "lat":39.9494619, "lng": -0.0739652});
  ```

4. Run [index.html](https://github.com/alaacs/GeoTODO/blob/master/TODOClient/html/index.html) from the TODOClient folder in your web browser

## Authors
Alaa B. Abdelfattah ([alaa.cs@hotmail.com](mailto:alaa.cs@hotmail.com))

Fabian Perotti ([al376286@uji.es](mailto:al376286@uji.es))

Vanesa Peréz Sancho ([vanesa.perez.sancho@gmail.com](mailto:vanesa.perez.sancho@gmail.com))

Daniel Marsh-Hunn ([al373405@uji.es](mailto:al373405@uji.es))
