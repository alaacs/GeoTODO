var app = angular.module("app", ["leaflet-directive"]);

app.controller("TheController", ["$scope", "$http", "leafletData", function($scope, $http, leafletData) {
  angular.extend($scope, {
    center: {
      lat: 39.98685368305097,
      lng: -0.04566192626953125,
      zoom: 14
    },
    tiles: {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    }

  });

  //$scope.markers = new Array();
  $http.get("http://localhost:2000/todos").then(function(response) {
    $scope.markers = response.data;

    console.log($scope.markers);
    //   for (i=0; i<$scope.markers.length; i++) {
    //     $scope.markers[i].icon = {
    //     iconUrl: '../img/tick.png',
    //     iconSize:     [40, 40],
    //   } ;
    // }
    // leafletData.getMap().then(function(map) {
    // setTimeout(function() {
    //     map.invalidateSize();
    //     map._resetView(map.getCenter(), map.getZoom(), true);
    //     map.zoomIn();
    //     map.zoomOut();
    // }, 1000);
    // });
    //  console.log($scope.markers);
    //    leafletData.getMap().then(function(map) {
    //   var group = new L.featureGroup($scope.markers);
    //   map.fitBounds(group.getBounds());
    // });

  }, function(err) {
    console.log("Something went wrong");
  });


  $scope.$on("leafletDirectiveMap.mousedown", function(event, args) {

    var mouseButton = args.leafletEvent.originalEvent.button;
    if (mouseButton == 2) { // Right button
      latlng = args.leafletEvent.latlng;
      reverseGeocoding(latlng);
    }
  });

  function reverseGeocoding(latlng) {
    var urlString = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      latlng.lat + "&lon=" +
      latlng.lng + "&zoom=18&addressdetails=1";
    $http.get(urlString).then(addMarker);
  }

  function addMarker(response) {
    var marker = {
      lat: parseFloat(response.data.lat),
      lng: parseFloat(response.data.lon),
      message: "Hello",
      dueDate: new Date(),
      postalAddress: response.data.display_name,
      icon: {
        iconUrl: '../img/tick.png',
        iconSize: [40, 40],
      }
    };

    $scope.markers.push(marker);

    $scope.formData = {};
    console.log(markers)

    $http.post("http://localhost:2000/todos", $scope.formData).then(function(response) {


      //$scope.currentMarker = marker;

    });
  }
  // $scope.$on("leafletDirectiveMap.mousedown", function(event, args) {
  //   //event.preventDefault();
  //
  //   var mouseButton = args.leafletEvent.originalEvent.button;
  //
  //   if (mouseButton == 2) { // Right button
  //     var latlng = args.leafletEvent.latlng;
  //     //var latlng = args.leafletEvent.latlng;
  //
  //     $scope.currentMarker = {
  //
  //         lat: latlng.lat,
  //         lng: latlng.lng,
  //         message: "Hello",
  //         dueDate: new Date()
  //
  //     };
  //     $scope.markers.push($scope.currentMarker);
  //     $('#myModal').modal('show');
  //
  //   }
  // });

  //$scope.currentMarker = {};

  $scope.showInfo = function(index) {
    $scope.currentMarker = $scope.markers[index];
  }


  $scope.deleteTodo = function(index) {
    //console.log(index);
    var idTodo = $scope.markers[index]._id;
    console.log(idTodo);
    $http.delete("http://localhost:2000/todos/" + idTodo)
      .then(function(idTodo, status) {
          $scope.ServerResponse = idTodo;
          $scope.currentMarker = $scope.markers.splice(index, 1);
        },
        function(err) {
          console.log("Something went wrong");
        });
  }



  $scope.highlightTodo = function(index) {
    $scope.center = {
      lat: $scope.markers[index].lat,
      lng: $scope.markers[index].lng,
      zoom: 15
    };
  }
  $scope.toggleEditTodo = function(index) {
    var marker = $scope.markers[index];
    if (marker)
      marker.editingEnabled = !marker.editingEnabled;
  }
}]);
