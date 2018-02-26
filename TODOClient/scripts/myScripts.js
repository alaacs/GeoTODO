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
  $scope.icon = {
    iconUrl: '../img/tick.png',
    iconSize:     [40, 40],
  }
  $scope.editing_icon = {
    iconUrl: '../img/newTodo.png',
    iconSize: [48, 48],
  }
  $scope.restoreUpdateTodoLocation = function(){
    var currentToUpdateItem = $scope.markers.find(m=>m.isUpdate);
    if(currentToUpdateItem)
    {
      currentToUpdateItem.lat = $scope.currentMarker.lat;
      currentToUpdateItem.lng = $scope.currentMarker.lng;
      currentToUpdateItem.postal_address = $scope.currentMarker.postal_address;
      currentToUpdateItem.icon = $scope.icon;
    }
  }
  $scope.btnCancelEditing = function(){
    if($scope.isUpdateMode)
      $scope.restoreUpdateTodoLocation();
    $scope.isAddMode = false;
    $scope.isUpdateMode = false;
    $scope.toggleCrossHairCursor(false);
    $scope.isAddingToMapEnabled = false;
    $scope.markers = $scope.markers.filter(m=> !m.isNew);
    var toUpdateItem = $scope.markers.find(m=>m.isUpdate)
    if(toUpdateItem)
    {
      toUpdateItem.icon = $scope.icon;
    }
    // $scope.zoomToAllMarkers();
  }
  $scope.btnUpdateTodo = function(){
    var currentToUpdateItem = $scope.markers.find(m=>m.isUpdate);
    if(currentToUpdateItem)
    {
      // currentToUpdateItem.lat = $scope.currentMarker.lat;
      // currentToUpdateItem.lng = $scope.currentMarker.lng;
      // currentToUpdateItem.postal_address = $scope.currentMarker.postal_address;
      // currentToUpdateItem.icon = $scope.icon;
      var toUpdate = {};
      toUpdate._id = $scope.currentMarker._id;
      toUpdate.title = $scope.currentMarker.title;
      if($scope.currentMarker.due_date && $scope.currentMarker.due_date.toISOString)
        toUpdate.due_date = $scope.currentMarker.due_date.toISOString();
      toUpdate.postal_address = $scope.currentMarker.postal_address;
      toUpdate.lat = currentToUpdateItem.lat;
      toUpdate.lng = currentToUpdateItem.lng;
      $http.put("http://localhost:2000/todos", toUpdate).then(function(response) {
        currentToUpdateItem.icon = $scope.icon;
        currentToUpdateItem.title = $scope.currentMarker.title;
        currentToUpdateItem.due_date = $scope.currentMarker.due_date;
        currentToUpdateItem.postal_address = $scope.currentMarker.postal_address;
        $scope.currentMarker = {};
        $scope.isUpdateMode = false;
        $scope.toggleCrossHairCursor(false);
        $scope.isAddingToMapEnabled = false;
      });
    }
  }
  $scope.btnAddTodo = function(){
    //$scope.currentMarker
    var mapMarker = $scope.markers.find(m=>m.isNew);
    if(mapMarker)
    {
      var newTodo = {};
      newTodo.title = $scope.currentMarker.title;
      if($scope.currentMarker.due_date && $scope.currentMarker.due_date.toISOString)
        newTodo.due_date = $scope.currentMarker.due_date.toISOString();
      newTodo.postal_address = $scope.currentMarker.postal_address;
      newTodo.lat = mapMarker.lat;
      newTodo.lng = mapMarker.lng;
      $http.post("http://localhost:2000/todos", newTodo).then(function(response) {
        response.data.icon = $scope.icon;
        $scope.markers.push(response.data);
        $scope.markers = $scope.markers.filter(m=> !m.isNew);
        $scope.currentMarker = {};
        $scope.isAddMode = false;
        $scope.toggleCrossHairCursor(false);
        $scope.isAddingToMapEnabled = false;
      });
    }
    else {
      console.log("No marker added to the map");
    }
  }
  $scope.btnEnableAddClicked = function(){
    $scope.restoreUpdateTodoLocation();
    $scope.isAddMode = !$scope.isAddMode;
    if($scope.isAddMode)
    {
      $scope.isUpdateMode = false;
      $scope.toggleCrossHairCursor(true);
      $scope.isAddingToMapEnabled = true;
    }
    else {
      $scope.toggleCrossHairCursor(false);
      $scope.isAddingToMapEnabled = false;
    }
    $scope.currentMarker = {};
  }
  $scope.toggleCrossHairCursor = function(isCrossHairEnabled){
    leafletData.getMap().then(function(map) {
      if(isCrossHairEnabled)
        L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');
      else L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
});
  }
  //$scope.markers = new Array();
  $http.get("http://localhost:2000/todos").then(function(response) {
    $scope.markers = response.data;

    console.log($scope.markers);
      for (i=0; i<$scope.markers.length; i++) {
        $scope.markers[i].icon = $scope.icon ;
    }
    $scope.zoomToAllMarkers();
     console.log($scope.markers);


  }, function(err) {
    console.log("Something went wrong");
  });
  $scope.btnShowAllMarkers = function(){
    $scope.zoomToAllMarkers();
  }

  $scope.zoomToAllMarkers = function(){
    for (i=0; i<$scope.markers.length; i++) {
      if(!$scope.markers[i].getBounds)
        $scope.markers[i].getBounds = function(){
          var corner1 = L.latLng(this.lat, this.lng);
          var corner2 = L.latLng(this.lat, this.lng);
          return L.latLngBounds(corner1, corner2);
          //return L.latLng(this.lat, this.lng);
        }
    }
    leafletData.getMap().then(function(map) {
     var group = new L.featureGroup($scope.markers);
     map.fitBounds(group.getBounds());
    });
  }

  $scope.$on("leafletDirectiveMap.click", function(event, args) {

    //var mouseButton = args.leafletEvent.originalEvent.button;
    //if (mouseButton == 0) { // Left button
      if($scope.isAddingToMapEnabled)
      {
        latlng = args.leafletEvent.latlng;
        reverseGeocoding(latlng);
      }
  //  }
  });

  function reverseGeocoding(latlng) {
    var urlString = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      latlng.lat + "&lon=" +
      latlng.lng + "&zoom=18&addressdetails=1";
    $http.get(urlString).then(addMarker);
  }

  function addMarker(response) {
    $scope.markers = $scope.markers.filter(m=> !m.isNew);

      var marker = {
      isNew : true,
      lat: parseFloat(response.data.lat),
      lng: parseFloat(response.data.lon),
      //message: "Hello",
      //dueDate: new Date(),
      //postalAddress: response.data.display_name,
      icon: $scope.editing_icon
    };
    if($scope.isAddMode)
    {
      if($scope.currentMarker)
        $scope.currentMarker.postal_address = response.data.display_name;
      $scope.markers.push(marker);
    }
    else {
      var currentToUpdateItem = $scope.markers.find(m=>m.isUpdate);
      if(currentToUpdateItem)
      {
        currentToUpdateItem.lat = parseFloat(response.data.lat);
        currentToUpdateItem.lng = parseFloat(response.data.lon);
        currentToUpdateItem.postal_address = response.data.display_name;
        $scope.currentMarker.postal_address = response.data.display_name;
      }
    }
    // else {
    //
    // }
    // if($scope.isAddMode){
    //   $http.post("http://localhost:2000/todos", marker).then(function(response) {
    //     $scope.markers.push(marker);
    //     //$scope.formData = {};
    //   });
    // }

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
        //  $scope.ServerResponse = idTodo;
          $scope.markers.splice(index, 1);
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
    $scope.isUpdateMode = true;
    $scope.isAddMode = false;
    $scope.toggleCrossHairCursor(true);
    $scope.isAddingToMapEnabled = true;
    $scope.currentMarker = jQuery.extend({}, $scope.markers[index]);
    $scope.center = {
      lat: $scope.markers[index].lat,
      lng: $scope.markers[index].lng,
      zoom: 15
    };
    var currentToUpdateItem = $scope.markers.find(m=>m.isUpdate)
    if(currentToUpdateItem)
    {
      currentToUpdateItem.isUpdate = false;
      currentToUpdateItem.icon = $scope.icon;
    }
    $scope.markers[index].isUpdate = true;
    $scope.markers[index].icon = $scope.editing_icon;
    if($scope.currentMarker && $scope.currentMarker.due_date &&
      typeof $scope.currentMarker.due_date == "string")
      $scope.currentMarker.due_date = new Date($scope.currentMarker.due_date);
    // $scope.$apply();
    // var marker = $scope.markers[index];
    // if (marker)
    //   marker.editingEnabled = !marker.editingEnabled;
  }
}]);
