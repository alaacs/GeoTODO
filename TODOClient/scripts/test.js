var app = angular.module("app", [])
  .controller("MyController", function($scope, $http) {

    //// Get full product catalog

    // get all products - GET

    function getTodos() {
      $http.get("http://localhost:2000/todos").then(function(response) {
          $scope.todos = response.data;
          console.log(response.data);
        },
        function(data) {
          console.log("Todos couldn't be loaded. Check if server is running!")
        }
      )
    }

    // lOad catalog on ready

    $(document).ready(function() {
      getTodos();
    });

    //// Add a product - POST

    // $scope.formData = {};
    //
    // $scope.addProduct = function() {
    //   console.log($scope.formData)
    //   $http.post("http://localhost:3000/catalog", $scope.formData).then(function(response) {
    //       $scope.formData = {}; // clear the form so our user is ready to enter another
    //       getCatalog()
    //     },
    //     function(data) {
    //       console.log("Could not add item");
    //     });
    // };
    //
    //
    // //// Update product - PUT
    //
    // $scope.updateProduct = function(id) {
    //    console.log($scope.products.id)
    // }
    //
    //
    // //// Delete product - DELETE
    //
    // $scope.deleteProduct = function(id) {
    //   $http.delete("http://localhost:3000/catalog/" + id)
    //     .then(function(response) {
    //         getCatalog();
    //         console.log(response.data);
    //       },
    //       function(data) {
    //         console.log(data)
    //         console.log("Delete request not working!")
    //       })
    // };

    });
