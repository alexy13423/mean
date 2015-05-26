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
    return $http.post('/api/forgot', user);
  };
  // // auth.isGroupMember = function(){
  auth.facebook = function () {
    var deferred = $q.defer();
        FB.api('/me', {
            fields: 'last_name'
        }, function(response) {
            if (!response || response.error) {
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
              }
          });
    return deferred.promise;
  };

  auth.statusChangeCallback = function (response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  };
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
app.factory('facebookService', function($q) {
  var facebookService = {};


  facebookServce.getMyLastName = function() {
      var deferred = $q.defer();
        FB.api('/me', {
            fields: 'last_name'
        }, function(response) {
            if (!response || response.error) {
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
              }
          });
    return deferred.promise;
  };
  // facebookServce.getMyFirstName = function() {
  //     var deferred = $q.defer();
  //       FB.api('/me', {
  //           fields: 'first_name'
  //       }, function(response) {
  //           if (!response || response.error) {
  //             deferred.reject('Error occured');
  //           } else {
  //             deferred.resolve(response);
  //             }
  //         });
  //   return deferred.promise;
  // };
});


