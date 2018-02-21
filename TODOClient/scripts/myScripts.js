var app = angular.module("app", ["leaflet-directive"]);

app.controller("TheController", ["$scope", "$http", function($scope, $http) {
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

  $scope.markers = new Array();
  $scope.$on("leafletDirectiveMap.mousedown", function (event,args) {

      var mouseButton = args.leafletEvent.originalEvent.button;
      if(mouseButton == 2) { // Right button
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
        icon:{
          iconUrl: '../img/tick.png',
          iconSize:     [40, 40],
        }
    };
    $scope.markers.push(marker);
    $scope.currentMarker = marker;
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
  $scope.deleteTodo = function(index){
    $scope.markers.splice(index,1);
  }
  $scope.highlightTodo = function(index)
  {
    $scope.center = {lat: $scope.markers[index].lat, lng: $scope.markers[index].lng, zoom:15};
  }
}]);
