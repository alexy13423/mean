var app = angular.module('mainApp', ['templates']);
app.controller('MainCtrl', ['$scope', 'auth', '$location', function ($scope, auth) {
  $scope.user = {};
  $scope.register = function () {
    auth.register($scope.user).error(function (error) {
      $scope.error = error;
    }).then(function () {
      window.location = "http://localhost:3000/user/#/home";
    });
    mixpanel.track("HomePage: Register");
  };

  $scope.logIn = function () {
    auth.logIn($scope.login).error(function (error) {
      $scope.error = error;
    }).then(function () {
      window.location = "http://localhost:3000/user/#/home";
    });
    mixpanel.track("HomePage: Login");
  };

  $scope.forgotPassword = function () {
    auth.forgotPassword($scope.forgot).error(function (error) {
      console.log($scope.forgot);
      $scope.error = error;
    });
    mixpanel.track("HomePage: Reset Password, Submit Email");
  };

  // $scope.verifyEmail = function() {
  //   confirmEmail.confirm($scope.verify).error(function (error) {
  //     $scope.error = error;
  //     $scope.showSuccessAlert = true;
  //   }).then(function () {
  //     window.location = "http://localhost:3000/user/#/home";
  //   });
  // };

  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;

}]);
app.factory('auth', ['$http', '$window', function ($http, $window) {
  var auth = {};
  auth.saveToken = function (token) {
    $window.localStorage['admin-token'] = token;
  };

  auth.getToken = function () {
    return $window.localStorage['admin-token'];
  };
  auth.isLoggedIn = function () {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  // auth.isGroupMember = function (){
  //   var token = auth.getToken();

  //   if (token) {
  //     var payload = JSON.parse($window.atob(token.split('.')[1]));

  //     return payload.group_id = this.group_id;
  //   } else {
  //     return false;
  //   }
  // };
  auth.currentUser = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };
  auth.register = function (user) {
    return $http.post('/api/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function (user) {
    return $http.post('/api/login', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };
  auth.logOut = function () {
    $window.localStorage.removeItem('admin-token');
  };
  auth.forgotPassword = function (user) {
    return $http.post('/api/forgot', user).success(function (data) {
      auth.saveToken(data.token);
      $scope.success = true;
    });
  };
  // auth.isGroupMember = function(){
    
  // };
  return auth;
}]);
// app.factory('confirmEmail',['$http', '$window', function ($http, $window) {
//   var confirmEmail = {};
//   confirmEmail.confirm = function (user) {
//     return $http.put('/api/emailverify/:username/:token').success(function (data) {
//     });
//   };
//   return confirmEmail;
// }]);