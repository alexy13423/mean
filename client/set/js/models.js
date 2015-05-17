/*  ---------------  *
    FACTORIES - SET
 *  ---------------  */
 
 app.factory('verification', function ($http, $window) {
  return {
      getUser: function getUserMethod(username, user_token) {
          return $http.get('/api/resetpassword/' + username + '/' + user_token)
          .success(function (data) {
            return data;
          });
      },
      emailVerify: function emailVerifyMethod(username, user_token) {
          return $http.put('/api/emailverify/' + username + '/' + user_token)
          .success(function (data) {
            console.log(data.message);
          });
      },
      updatePassword: function updatePasswordMethod(user) {
        return $http.put('/api/resetpassword/'+ user.username + '/' + user.user_token, user)
        .success(function (data) {
          console.log('Success!');
        });
      }
  };
});

app.factory('search', function ($http) {
  var u = {
    users: []
  };
  u.get = function (query) {
    return $http.get('/api/search/' + query).success(function(data){
      console.log(data);
      return data;
    });
  };
  return u;
});

app.factory('users', function ($http, $window) {
  var u = {
    users: []
  };
  u.get = function (handle) {
    return $http.get('/api/user/handle/' + handle).success(function(data){
      // console.log(data);
      return data;
    });
  };
  return u;
});