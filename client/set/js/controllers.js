app.controller('MainCtrl', ['$scope', '$location', function ($scope) {
  // $scope.verifyEmail = function() {
  //   confirmEmail.confirm($scope.verify).error(function (error) {
  //     $scope.error = error;
  //     $scope.showSuccessAlert = true;
  //   }).then(function () {
  //     window.location = "http://localhost:3000/user/#/home";
  //   });
  // };

}]);
app.controller('ResetCtrl', ['$scope', '$location','resetPassword', '$stateParams', function ($scope, $stateParams, resetPassword) {
  $scope.submitPassword = function() {
    console.log($scope.user);
    console.log($stateParam.username);
    console.log($stateParam.token);
    resetPassword.updatePassword($scope., $stateParams.username, $stateParams.token).success(function () {
      // output message
      // redirect them home
    })
    .error(function (error) {
      $scope.error = error;
      $scope.showSuccessAlert = true;
    });
  }; 
}]);