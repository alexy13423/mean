app.factory('verification', function ($http, $window) {
  return {
      getUser: function getUserMethod(user, name, token) {
          return $http.get('/resetpassword/'+ name + '/' + token)
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
      updatePassword: function updatePasswordMethod(user, name, token, password) {
          return $http.put('/api/resetpassword/'+ name + '/' + token).success(function (data) {
            console.log('Success!');
          });
      }
  };
});

app.factory('search', function ($http) {
  return {
    search: function searchMethod(q) {
    
      return $http.post('/search/', {query: q} ).success(function (data) {
        return data;
      });
    }
  };
});