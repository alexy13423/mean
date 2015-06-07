/*  -----------------  *
    APP MODULE - USER 
 *  -----------------  */
var app = angular.module('mainApp', ['ui.router','templates', 'btford.socket-io']);
// var app = angular.module('mainApp', ['ui.router','templates', 'btford.socket-io']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'DashCtrl',
      resolve: {
        postsPromise: function(posts){
          return posts.getAll();
        }
      }
    })
    .state('post', {
      url: '/post/:post',
      templateUrl: 'post.html',
      controller: 'PostCtrl',
      resolve: {
        postPromise: function($stateParams, posts) {
        return posts.get($stateParams.post);
        }
      }
    })
    .state('shop', {
      url: '/shop',
      templateUrl: 'shop.html',
      controller: 'ShopCtrl',
      resolve: {
        itemPromise: function (items) {
          return items.getAll();
        }
        // , userPromise: function (auth, users) {
        //   return users.get(auth.isThisUser());
        // }
      }
    })
    .state('events', {
      url: '/events',
      templateUrl: 'events.html',
      controller: 'ShopCtrl',
      resolve: {
        itemPromise: function($stateParams, items) {
          console.log($stateParams);
          return items.get($stateParams.item);
        }
        // , userPromise: function (auth, users) {
        //   return users.get(auth.isThisUser());
        // }
      }
    })
    .state('item', {
      url: '/item/:id',
      templateUrl: 'item.html',
      controller: 'ItemCtrl',
      resolve: {
        itemPromise: function($stateParams, items) {
          return items.get($stateParams.id);
        }
      }
    })
    .state('challenge', {
      url: '/items/challenge/:id',
      templateUrl: 'challenge.html',
      controller: 'ItemsCtrl',
      resolve: {
        itemPromise: function($stateParams, items) {
          console.log($stateParams.id);
          return items.get($stateParams.id);
        }
      }
    })
    .state('workoutPlan', {
      url: '/items/workoutplan/:id',
      templateUrl: 'workoutPlan.html',
      controller: 'ItemsCtrl',
      resolve: {
        itemPromise: function($stateParams, items) {
          console.log($stateParams.id);
          return items.get($stateParams.id);
        }
      }
    })
    .state('exerciseSteps', {
      url: '/items/exercise/:exercise',
      templateUrl: 'exerciseSteps.html',
      controller: 'ExerciseCtrl',
      resolve: {
        exercisePromise: function($stateParams, items) {
          console.log($stateParams.exercise);
          return items.getExercise($stateParams.exercise);
        }
      }
    })
    .state('stepConsumption', {
      url: '/items/step/:step',
      templateUrl: 'stepConsumption.html',
      controller: 'StepCtrl',
      resolve: {
        stepPromise: function($stateParams, items) {
          console.log($stateParams.step);
          return items.getStep($stateParams.step);
        }
      }
    })
    .state('transactions', {
      url: '/transactions/:item',
      templateUrl: 'transactions.html',
      controller: 'TransCtrl',
      resolve: {
        itemPromise: function($stateParams, items) {
          return items.get($stateParams.item);
        }
      }    
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'checkout.html',
      controller: 'CheckoutCtrl',
      resolve: {
        item: ['$stateParams', 'items', function($stateParams, items) {
          return items.get($stateParams.id);
        }]    
      }
    })  
    .state('groups', {
      url: '/groups',
      templateUrl: 'groups.html',
      controller: 'GroupsCtrl',
      resolve: {
        groupPromise: function(groups){
          return groups.getAll();
        }
      }
    })
    .state('groupHome', {
      url: '/group/:id',
      templateUrl: 'group_home.html',
      controller: 'GHomeCtrl',
      resolve: {
        groupsPromise: function($stateParams, groups){
          return groups.get($stateParams.id);
        }
      } 
    })
    .state('messenger', {
      url: '/messenger',
      templateUrl: 'messenger.html',
      controller: 'MessengerCtrl',
      resolve: {
        // userPromise: function(auth, users) {
          // var _id = auth.isThisUser();
          // return users.get(_id);
        // },
        usersPromise: function(users) {
          return users.getAll();
        },
        conversationsPromise: function(messenger) {
          return messenger.getAll();
        }
      }
    })
    // .state('/gposts', {
    //   url: '/gposts/:gpost',
    //   templateUrl: 'gposts.html',
    //   controller: 'GpostCtrl',
    //   resolve: {
    //     gcommentPromise: ['gcomments', function(gcomments){
    //       return gcomments.getAll();
    //     }]
    //   }
    // })
    .state('settings', {
       url: '/settings/:id',
       templateUrl: 'settings.html',
       controller: 'SettingsCtrl',
       resolve: {
         languagePromise: function (languages) {
           return languages.getAll();
         },
         userPromise: function ($stateParams, users) {
          return users.get($stateParams.id);
         }
       }
    })

    .state('user', {
      url: '/user/:handle',
      templateUrl: 'users.html',
      controller: 'UserCtrl',
      resolve: {
        userPromise: function($stateParams, users) {
          return users.get($stateParams.id);
        }
      }
    });
  $urlRouterProvider.otherwise('home');
}]);

/*  ------------------  *
    CONTROLLERS - USER
 *  ------------------  */

 app.controller('MainCtrl', function ($scope, auth, messageSocket) {
  
    $scope.user = auth.getUser();
    mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.people.set({
    //     "$name": $scope.user.firstname + ' ' + $scope.user.lastname,
        "$email": $scope.user.username,
    //     "$created": $scope.user.created,
    //     "gender" : $scope.user.gender,
    //     "age" : $scope.user.age,
    //     "type" : $scope.user.permissions,
        "$last_login": new Date()
    });
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isUser = auth.isUser;
  $scope.isContributor = auth.isContributor;
  $scope.isAdmin = auth.isAdmin;
  $scope.logOut = auth.logOut;
  $scope.isThisUser = auth.isThisUser;


  $scope.$on('socket:tokenrequest', function(event, data) {
    console.log('socket:tokenrequest', event.name, data);
    console.log(data.message);
    messageSocket.emit('authenticate', { token: auth.getToken() });
  });

  $scope.$on('socket:broadcast', function(event, data) {
    console.log('broadcast to socket', event.name, data);
  });
  
});


app.controller('DashCtrl', function ($scope, posts, auth) {

  $scope.posts = posts.posts;
  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Post",{"area":"group", "page":"groupHome", "action":"create"});
    // mixpanel.track("User Dashboard: Add Post");
  };
  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Upvote Post",{"area":"group", "page":"groupHome", "action":"upvote"});
    // mixpanel.track("User Dashboard: Upvoted Comment");
  };
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;

});


app.controller('PostCtrl', function ($scope, auth, posts, postPromise) {

  $scope.post = postPromise.data;
  $scope.comment = { 
    post: $scope.post._id, 
    body: null, 
    author: $scope.user.username 
  };

  $scope.addComment = function() {
    if (!$scope.comment.body || $scope.comment.body === '') { return; }
    posts.addComment($scope.post, $scope.comment).success(function(comment) {
      $scope.post.comments.push(comment);
      $scope.comment.body = null;
    });
    $scope.body = '';
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Comment",{"area":"group", "page":"groupHome", "action":"comment"});
  };
  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Upvote Comment",{"area":"group", "page":"groupHome", "action":"upvote"});
  };
  $scope.incrementUpvotes = function(comment) {
    posts.upvoteComment($scope.post, comment);
  };
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
});

app.controller('ShopCtrl', function ($scope, items, Item, auth) {

  $scope.items = items.items;
  $scope.addItem = function() {
    items.create($scope.item).success(function(data){
      console.log('success');
      $scope.items = items.items;
      $scope.item = new Item();
      console.log(data);
   }).error(function(){
       console.log('failure');
   });
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Item",{"area":"shop", "page":"shop", "action":"create"});
   // mixpanel.track("Shop Page: Added Item");
 };

   $scope.itemTitles = {
    workoutplan: 'Workout Plan',
    dietplan: 'Diet Plan',
    book: 'Book',
    video: 'Video',
    podcast: 'Podcast',
    bootcamp: 'Bootcamp',
    challenge: 'Online Challenge'
   };

  $scope.incrementUpvotes = function(item){
    items.upvoteItem(item);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Upvote Item",{"area":"shop", "page":"shop", "action":"upvote"});
    // mixpanel.track("Shop Page: Upvoted Comment");
  };  

  $scope.editItem = function(item) {
    $scope.item = item;
  };

  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
});


app.controller('ItemCtrl', function ($scope, $state, $stateParams, items, auth, Item, itemPromise, popupService) {

  $scope.items = items.items;
  $scope.item = itemPromise.data;
  item = itemPromise;
  $scope.deleteItem = function () {
    console.log('delete', $scope.item._id);
    if (popupService.showPopup('Are you sure you want to delete this item?')) {
      items.delete($scope.item._id).success(function(data){
        console.log(data.message);
        $scope.items = items.items;
        $state.go('shop');
    });
    }
  };
  $scope.createDay = function(){
    items.newDay($stateParams.id, $scope.day.day).success(function(day) {
      $scope.item.days.push(day);
    });
  };
  $scope.incrementUpvotes = function(item){
    items.upvoteItem(item);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Upvote Item",{"area":"shop", "page":"shop", "action":"upvote"});
    // mixpanel.track("Items Page: Upvoted Comment");
  };
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
  $scope.addPlan = function() {
    items.newPlan($scope.workoutPlan, $stateParams.id).success(function(data){
      console.log('success');
      $scope.item.exercises.push(data);
   }).error(function(){
       console.log('failure');
   });
  };
});

app.controller('ExerciseCtrl', function ($scope, items, exercisePromise, $stateParams) {
  $scope.exercise = exercisePromise;
  $scope.addStep = function() {
    items.newStep($scope.step, $stateParams.exercise).success(function(data){
      console.log('success');
      $scope.step = null;
      $scope.exercise.steps.push(data);
   }).error(function(){
       console.log('failure');
   });
  };
});

app.controller('StepCtrl', function ($scope, items, stepPromise, $stateParams) {
  $scope.step = stepPromise;
});


app.controller('NavCtrl', function ($scope, auth) {
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.home = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
});

app.controller('TransCtrl', function ($scope, items, auth, transactions, itemPromise) {
  $scope.item = itemPromise.data;

  $scope.startTrans = function () {
    console.log($scope.item);
    transactions.purchase($scope.item);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Start Transaction",{"area":"shop", "page":"transactions", "action":"transaction"});
    // mixpanel.track("Checkout: Purchase Item");
    // mixpanel.people.track_charge(10,{  item: $scope.item.name, type: $scope.item.type, "$time": new Date() });
  };
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
});


app.controller('SettingsCtrl', function ($scope, languages, settings, userPromise, auth) {
  $scope.user = angular.extend($scope.user, settings.settings);
  $scope.languages = languages.languages;
  $scope.addLanguage = function(){
    console.log($scope.language.name);
    languages.addLanguage($scope.language.name).success(function(data) {
    $scope.languages.push(data);
    });
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Languange",{"area":"settings", "page":"settings", "action":"add"});
  };
  $scope.updateSettings = function() {
    console.log($scope.user);
    settings.update($scope.user);
    settings.uploadAvatar($scope.user.avatar);
    console.log($scope.user.avatar);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Settings update",{"area":"settings", "page":"settings", "action":"update"});
    // mixpanel.track("Settings: Update User");
  };
  $scope.user = userPromise.data;
  console.log(userPromise);
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
  $scope.isThisUser = auth.isThisUser;
});

app.controller('GroupsCtrl',
function ($scope, groups, auth) {

  $scope.groups = groups.groups;
  $scope.addGroup = function(){
    groups.create($scope.group);
    console.log($scope.group);
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Group", {"area":"group", "page":"groups", "action":"create"});
  };
  $scope.group = '';
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
});

app.controller('GHomeCtrl',
function ($scope, auth, groups, gposts, gcomments, groupsPromise, $stateParams){
  var group = groups.group[$stateParams.id];
  var gpost = gposts.gpost[$stateParams.id];
  // var gpost = gposts.gpost[$stateParams.id];
  $scope.group = groupsPromise.data;
  console.log(groupsPromise.data);
  // $scope.gpost = gpostsPromise.data;
  // console.log(gpostsPromise.data);

  $scope.currentUser = auth.currentUser();
  $scope.groups = groups.groups;
  $scope.gposts = gposts.gposts;
  $scope.gcomments = gcomments.gcomments;
  $scope.addGpost = function(){
    console.log($stateParams.id);
    console.log($scope.gpost);
    // if(!$scope.body || $scope.body === '') { return; }
    groups.createGpost($scope.gpost, $stateParams.id).success(function(gpost) {
      $scope.group.gposts.push(gpost);
      $scope.gpost = null;
    });
    // mixpanel.alias($scope.user._id);
    mixpanel.identify($scope.user._id);
    mixpanel.track("Add Post", {"area":"group", "page":"groupHome", "action":"create"});
  };
  $scope.addGcomment = function (gpost, gcomment) {
    console.log('in controller', gpost, gcomment);
    gpost.gcomments.push(gcomment);
    groups.createGcomment(gpost._id, gcomment); 
    console.log(gpost._id, gcomment);
  };
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
  
  // $scope.addComment = function(){
  //   console.log($scope.post);
  //   // posts.addComment(posts.post._id, {
  //   //   body: $scope.post.comment,
  //   //   author: $scope.currentUser
  //   // }).success(function(comment) {
  //   //   $scope.post.comments.push(comment);
  //   // });
  //   // $scope.body = '';
  // };
  // $scope.incrementUpvotes = function(gpost){
  //   gposts.upvoteGroupPost(gpost);
  // };
  $scope.isLoggedIn = auth.isLoggedIn;
});

app.controller('GpostCtrl', [
'$scope',
'$stateParams',
'gposts',
'gcomments',
'auth',
function($scope, $stateParams, gposts, gcomments, auth){
  var gpost = gposts.gpost[$stateParams.id];
  $scope.get(gpost._id);
  $scope.gpost = gposts.gpost;
  $scope.gcomments = gcomments.gcomments;
  $scope.addGcomment = function(){
    if(!scope.body || $scope.body === '') { return; }
    gposts.addGcomment(gposts.gpost._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(gcomment) {
      $scope.gpost.gcomments.push(gcomment);
    });
    $scope.body = '';
  };
  $scope.incrementUpvotes = function(gcomment){
    gposts.upvoteGroupComment(gpost, gcomment);
  };
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isAdmin = auth.isAdmin;
  $scope.isUser = auth.isUser;
}]);


/*  ----------------  *
    FACTORIES - USER
 *  ----------------  */

// POSTS 
app.factory('posts', function($http, auth){
  var o = {
    posts: [],
    post: {}
  };

  o.getAll = function() {
    return $http.get('/api/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
    console.log(post);

    return $http.post('/api/posts', post, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.posts.push(data);
    });

  };
  o.upvote = function(post) {
    return $http.put('/api/post/' + post._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      post.upvotes += 1;
    });
  };
  o.get = function(id) {
    return $http.get('/api/posts/' + id).then(function(data){
       console.log(data);
      return data;
    });
  };

  o.addComment = function(post, comment) {
    console.log(post, comment);
    return $http.post('/api/post/' + post._id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  o.upvoteComment = function(post, comment) {
    return $http.put('/api/post/' + post._id + '/comment/'+ comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };

  return o;
});

// COMMENTS
app.factory('comments', ['$http', 'auth', function($http, auth){
  var o = {
    comments: []
  };
  o.getAll = function() {
    return $http.get('/api/comments').success(function(data){
      angular.copy(data, o.comments);
    });
  };
  return o;
}]);  

// ITEMS

app.factory('items', function($http, auth){

  var o = {
    items: [],
    item: {}, 
    videos: [],
    video: {},
    books: [],
    book: {}
  };

  // CREATE
  o.create = function(item) {
    return $http.post('/api/items', item, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      // base item data comes back from API, extend it with
      // the item's original submitted descriptive parameters
      var extendedItem = angular.extend(data, item);
      o.items.push(extendedItem);
      // will be added to the appropriate service object subarray
      // based on submitted type
      return data;
    });
  };

  // READ - basic getting of data
  o.getAll = function() {
    return $http.get('/api/items').success(function(data){
      angular.forEach(data, function(item) {
        item = flattenItem(item);
      });
      angular.copy(data, o.items);
    });
  };

  o.get = function(item_id) {
    return $http.get('/api/item/' + item_id).success(function(data){
      return flattenItem(data);
    });
  };

  function flattenItem (item) {
    var subitem = item[item.type];
    for (var k in subitem) {
      if (subitem.hasOwnProperty(k) && subitem[k] !== subitem._id) {
        item[k] = subitem[k];
        item[item.type] = subitem._id;
      }
    }
  }

  o.delete = function(item_id) {
    return $http.delete('/api/item/' + item_id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  o.getAllVideos = function () {
    return $http.get('/api/videos').success(function(data){
      angular.copy(data, o.videos);
    });
  };

  // UPDATE

  // API hits specific to item type
  o.update = function(item) {
    // e.g. PUT diet @ /api/item/dietplan/dietplan_id, 
    return $http.put('/api/item/' + item._id, item, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvote = function(item) {
    return $http.put('/api/items/' + item._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      item.upvotes += 1;
    });
  };

  o.addTransaction = function(id, transaction) {
    return $http.post('/api/items/' + id + '/transactions', transaction, {
      headers: {Authorization: 'Bearer '+transactions.getToken()}
    }).success(function(data){
      transactions.push(data);
    });
  };

  o.newPlan = function (plan, id) {
    return $http.post('/api/workoutPlans/' + id, plan, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      // base item data comes back from API, extend it with
      // the item's original submitted descriptive parameters
      var extendedItem = angular.extend(data, plan);
      o.items.push(extendedItem);
    });
  };
  o.newStep = function (step, id) {
    return $http.post('/api/item/exercise/' + id, step, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      // base item data comes back from API, extend it with
      // the item's original submitted descriptive parameters
      var extendedItem = angular.extend(data, step);
      o.items.push(extendedItem);
    });
  };
  o.getExercise = function(exercise) {
    console.log(exercise);
    return $http.get('/api/item/exercise/' + exercise).then(function(res){
      return res.data;
    });
  };
  o.getExercises = function(id) {
    return $http.get('/api/items/' + id + '/exercises').success(function(data){
      console.log(data);
      angular.copy(data, o.items);
    });
  };
  o.getStep = function(step) {
    console.log(step);
    return $http.get('/api/item/step/' + step).then(function(res){
      return res.data;
    });
  };

  o.updateDietplan = function(item, object) {
    var dietplan_id = item.dietplan;
    var current_days_set = item.days_set;

    var dietplanAPI = '/api/item/dietplan/' + dietplan_id + '/';

    // saving the whole day, 
    // basically a meal was added or changed
    if (object.order) {
      // this is a new day beyond those set before
      if (current_days_set < object.order) {
        object.days_set = current_days_set;
        return $http.post(dietplanAPI + 'days', object, {
          headers: {Authorization: 'Bearer '+auth.getToken()}
        });
      }
      // this is an update of a previously set day
      return $http.put(dietplanAPI + 'days', object, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      });
    }


  };


  // DELETE
  //  ...

  return o;
  

});


// TRANSACTIONS
app.factory('transactions', ['$http', 'auth', function($http, auth){
  var o = {
    transactions: []
  };  
  // o.getAll = function() {
  //   return $http.get('/api/transactions').success(function(data){
  //     angular.copy(data, o.transactions);
  //   });
  // };
  o.get = function(id) {
    return $http.get('/api/transactions/' + id).then(function(res){
      return res.data;
    });
  };
  o.purchase = function(card) {
    console.log(card);
    return $http.post('/api/transactions', card, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      console.log(data);
    });
  };
  return o;
}]);

// CUSTOMERS

app.factory('customers', ['$http', 'auth', function($http, auth){
  var o = {
    customers: []
  };  
  o.get = function(id) {
    return $http.get('/api/customers/' + id).then(function(res){
      return res.data;
    });
  };
  return o;
}]);  


// AUTH
app.factory('auth', function($http, $window){
   var auth = {};
   auth.saveToken = function (token){
      $window.localStorage['admin-token'] = token;
    };

    auth.getToken = function (){
      return $window.localStorage['admin-token'];
    };
    auth.isLoggedIn = function(){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    };
    auth.isThisUser = function() {
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload._id;
      }
    };
    auth.isUser = function(){
      var token = auth.getToken();

      if(token){
       var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.permissions === 'User' || 'Admin' || 'Contributor';
      } else {
        return false;
      }
    };
    auth.isContributor = function () {
      var token = auth.getToken();

      if(token){
       var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.permissions === 'Admin' || 'Contributor';
      } else {
        return false;
      }
    };
    auth.isAdmin = function(){
      var token = auth.getToken();

      if(token){
       var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.permissions === 'Admin';
      } else {
        return false;
      }
    };
    auth.logOut = function(){
      $window.localStorage.removeItem('admin-token');
      $window.location = "/";
    };
    auth.getUser = function (){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload;
      }
    };
  return auth;
});


// LANGUAGES
app.factory('languages', ['$http', '$window', function($http, $window){
  var lang = { languages : [] };
                       // no function parameters -- function ()
  lang.getAll = function () { 
    return $http.get('/api/languages').success(function(data){
      console.log(data); // <<-- does this print anything?
      angular.copy(data, lang.languages);
    });
  };
  lang.addLanguage = function (language) {
    console.log(language);
    return $http.post('/api/user/:id/languages', { 'name': language }).success(function(data){
      console.log(data);
      lang.languages.push(data);
    });
  }; 
  
  return lang; 
}]);

// SETTINGS

app.factory('settings', function ($http, $window) {
   var s = { settings : {} };
   s.getAll = function (){
    return $http.get('/api/settings').success(function(data){
      angular.copy(data, s.settings);
    });
   };
   s.update = function (user){
    console.log('updating user', user);
    return $http.put('/api/settings', user).success(function(data){
        s.settings = data;
      });
   };
   s.uploadAvatar = function (avatar){
     return $http.get('/api/signedrequest?name='+avatar.name+'&type='+avatar.type).then(function(res) {
       console.log(res.data);
       return $http.put(res.data.signed_request, avatar, {
        Header: { 'x-amz-acl': 'public-read'}
       }).then(function(res){
        console.log(res.data);
       }).catch(function(err) {
        console.log(err); 
       });
     }); 
   };
   s.get = function (handle) {
     return $http.get('/api/user/handle/' + handle).success(function(data){
       console.log(data);
       return data;
     });
   };
   return s;
});

// USERS

app.factory('users', function ($http, $window, auth) {
  var u = { users: [], user: {} };

  u.getAll = function() {
    return $http.get('/api/users').success(function(data) {
      angular.copy(data, u.users);
    });
  };

  u.getRange = function(start, end) {
    return $http.get('/api/users/' + start + '/' + end, {
     headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  u.search = function(query) {
    return $http.get('/api/users/search/' + query).success(function(data) {
      return data;
    });
  };
  u.get = function (id) {
    return $http.get('/api/user/' + id).success(function(data){
      console.log(data);
      return data;
    });
  };
  u.update = function (user){
    console.log('updating user', user);
    return $http.put('/api/settings', user).success(function(data){
        u.users = data;
    });
  };

  u.get = function (id) {
    return $http.get('/api/user/' + id).success(function(data){
      u.user = data;
      return data;
    });
  };

  u.getAllButSelf = function() {
    var set = u.users;
    angular.forEach(set, function(user, index) {
      if (user.username === auth.currentUser()) {
        set.splice(index, 1);
      }
    });
    return set;
  };

  return u;
});


// GROUPS
app.factory('groups', ['$http', 'auth', function($http, auth){
  var o = {
    groups: [],
    group: {}
  };

  o.getAll = function() {
    return $http.get('/api/groups').success(function(data){
      console.log(data);
      angular.copy(data, o.groups);
    });
  }; 
  o.create = function (group) {
   console.log(group);
   return $http.post('/api/groups', group ).success(function(data){
     console.log(data);
     o.groups.push(data);
   });
  };
  o.get = function(id) {
    return $http.get('/api/group/' + id).then(function(data){
      console.log(data);
      return data;
    });
  };
  o.createGpost = function(gpost, id) {
    console.log(gpost, id);
    return $http.post('/api/group/' + id + '/gposts', gpost, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  o.createGcomment = function (gpost_id, gcomment) {
    console.log('gpost_id in factory', gpost_id);
    console.log('gcomment in factory', gcomment);
    return $http.post('/api/gpost/' + gpost_id + '/gcomments', gcomment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  return o;
}]);


app.factory('gposts', ['$http', 'auth', function($http, auth){
  var o = {
    gposts: [],
    gpost: {}
  };

  o.getAll = function(id) {
    return $http.get('/api/group/' + id + '/gposts').success(function(data){
      console.log(data);
      angular.copy(data, o.gposts);
    });
  };

  // o.upvote = function(gpost) {
  //   return $http.put('/api/gposts/' + post._id + '/upvote', null, {
  //     headers: {Authorization: 'Bearer '+auth.getToken()}
  //   }).success(function(data){
  //     gpost.upvotes += 1;
  //   });
  // };
  // o.get = function(id) {
  //   return $http.get('/api/gposts/' + id).then(function(res){
  //     return res.data;
  //   });
  // };
  // o.addGroupComment = function(id, gcomment) {
  //   return $http.post('/api/gposts/' + id + '/gcomments', gcomment, {
  //     headers: {Authorization: 'Bearer '+auth.getToken()}
  //   });
  // };
  return o;
}]);


app.factory('gcomments', ['$http', 'auth', function($http, auth){
  var o = {
    gcomments: []
  };  
  o.getAll = function() {
    return $http.get('/api/gcomments').success(function(data){
      angular.copy(data, o.gcomments);
    });
  };
  return o;
}]); 

app.service('popupService', function($window) {
  this.showPopup = function(message) {
    return $window.confirm(message);
  };
});

/*  ----------------------  *
    CONTROLLER - MESSENGER
 *  ----------------------  */

/* $scope.conversation at the level of the controller is focused convo
/* --> user initializes new blank conversation
/* --> when a conversation is focused from list, defaults to [0]th one
/* ---------------------------- */
app.controller('MessengerCtrl', function ($scope, settings, users, messenger, messageSocket, Conversation, Message) {

  $scope.debug = true;
  // $scope.debug = false;

  // ---- INIT SCOPE ----  //

  // for selecting users to talk to
  $scope.users = users.getAllButSelf();
  // get all of user's metadata and extend scope user object
  angular.extend($scope.user, users.user);
  // set up metadata on the newmessage object
  $scope.newmessage = new Message($scope.user);

  // get all conversations
  $scope.conversations = messenger.conversations || [];
  $scope.map = messenger.map || {};

  if ($scope.conversations.length > 0) {
    setFocus($scope.conversations[0]);
  } 

  // ------ METHODS FOR CONVERSATIONS ------ //

  // Set the focus on a particular conversation
  // establishes the conversation._id in the newmessage
  // marks read timestamps for messages
  $scope.focusConversation = setFocus;

  function setFocus(convo) {
    if (convo._id) {
      $scope.newmessage.conversation = convo._id;
      getMessages(convo);
      messenger.readMessages(convo);
      $scope.mainConversation = convo;
    }
  }

$scope.print = function(string) {
  console.log(string);
};
  // Starting a new conversation
  $scope.initConversation = function() {
    // only init a new convo if not already in that mode
    if (!$scope.mainConversation || !$scope.mainConversation.new) {
      $scope.addUserModal = true;
      $scope.copyOfUsers = angular.copy($scope.users, $scope.copyOfUsers);
      $scope.conversations.unshift(new Conversation());
      setFocus($scope.conversations[0]);
      $scope.mainConversation.users.push($scope.user);
    } 
  };

  // Cancelling a new conversation
  $scope.cancelNewConversation = function() {
    $scope.conversations.splice(0, 1);
    setFocus($scope.conversations[0]);
  };

  // ----- ADDRESSING USERS in a new conversation ----- //
  // Looking for Users to add to conversation
  $scope.searchUsers = function() {
    users.search($scope.conversation.userQuery).success(function(data) {
      $scope.conversation.userResult = data;
    });
  };

  // Adding a user to a conversation
  $scope.addToConversation = function(user) {
    $scope.mainConversation.users.push(user);
    angular.forEach($scope.copyOfUsers, function(u, i) {
      if (u._id === user._id) { $scope.copyOfUsers.splice(i, 1); }
    });
  };

  // ----- SENDING MESSAGES in the focused main conversation ---- //
  $scope.sendMessage = function() {
    if ($scope.mainConversation.users.length < 2) {
      console.log('need a user to message with besides yourself!');
      return;
    }
    if (!$scope.mainConversation._id) {
      messenger.createConversation($scope.mainConversation).success(function(data) {
        $scope.mainConversation._id = data._id;
        $scope.addUserModal = false;
        postMessage();
      });
    } else {
      postMessage();
    }
  };
  
  function postMessage () {
    messenger.postMessage($scope.mainConversation, $scope.newmessage).success(function() {
      $scope.newmessage.body = null;
    });
  }

  // ----- RECEIVING MESSAGES in realtime via socket.io ----- //
  $scope.$on('socket:newmessage', function (event, data) {
    console.log('got a new message', event.name, data);
    if (!data.payload) return;
    $scope.$apply(function() { update(data.payload); });
  });

  $scope.$on('socket:newconversation', function(event, data) {
    console.log('get a new convo', event.name, data.payload);
    $scope.$apply(function() { 
      messenger.getAll().success(function(convos) {
        $scope.conversations = convos;
        if (data.payload.initiator === $scope.user._id) {
          setFocus(data.payload.convo);
        }
      });
    });
  });

  $scope.$on('socket:readmessages', function(event, data) {
    console.log('new read timestamps on convo', data);
    $scope.$apply(function() {
      if (data.payload._id === $scope.mainConversation._id) {
        getMessages($scope.mainConversation);
      }
    });
  });

  function update (latest) {
    console.log('a new message for conversation ' + latest.convo_id);
    // have to find the place in convo list to update
    for (var i=0; i<$scope.conversations.length; i++) {
      if ($scope.conversations[i]._id === latest.convo_id) {
        $scope.conversations[i].latest = latest;

        if ($scope.mainConversation._id === $scope.conversations[i]._id) {
          getMessages($scope.mainConversation);
        }
        break;
      }
    }
  }



  // ----- HELPER FUNTIONS ----- //
  function getMessages (convo) { 
    messenger.get(convo._id).success(function(data) {
      convo.messages = data;
    });
  }

  $scope.isSelf = function(user_id) { return user_id === $scope.user._id; };

  $scope.otherPeople = function(conversation) {
    var others = angular.copy(conversation.users, others);
    angular.forEach(others, function(user, i) {
      if ($scope.isSelf(user._id)) {
        others.splice(i, 1);
      }
    });
    angular.forEach(others, function(user, i) {
      others[i] = user.f_name + ' ' + user.l_name;
    });
    return others.join(', ');
  };


});


app.directive('conversationAddUsers', function() {
  return {
    restrict: 'E',
    controller: 'MessengerCtrl',
    scope: false,
    template: '<div class="col-sm-12">' +
                // '<form name="userSearchForm" class="form-horizontal" ng-submit="findUsers()" novalidate/>' +
                  // '<div class="form-group">' + 
                    // '<input type="text" class="form-control" placeholder="Search" ng-model="conversation.userQuery" ng-blur="searchUsers()">' +
                  // '</div>' +
                // '</form>' +
                '<div ng-repeat="user in users | orderBy:\'username\'" ng-click="addToConversation(user)">' +
                  '<i class="fa fa-plus"></i> {{user.handle || user.username}} {{user.f_name + \' \' + user.l_name}}' +
                '</div>' +
                '<div class="col-sm-12" ng-repeat="user in conversation.userResult">' +
                  '<div class="col-sm-1">Pic</div>' +
                  '<div class="col-sm-10">{{user.handle}} | {{user.f_name}} {{user.l_name}}</div>' +
                  '<div class="col-sm-1"> </div>' +
                '</div>' +
              '</div>',
    link: function(scope, element, attrs) {}

  };
});



app.directive('messageBox', function() {
  return {
    restrict: 'EA',
    // template: '<textarea style="width: 100%; height: 200px" ng-disable="true" ng-model="messageLog"></textarea>',
    controller: function($scope, $element) {
      $scope.$watch('messageLog', function() {
        var textArea = $element[0].children[0];
        textArea.scrollTop = textArea.scrollHeight;
      });
    }
  };
});




app.directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  };
});

app.factory('messenger', function ($http, auth) {

  var o = {
    conversations: [],
    map: {}
  };

  o.getAll = function() {
    return $http.get('/api/conversations', {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      angular.copy(data, o.conversations);
      angular.forEach(data, function(convo) {
        o.map[convo._id] = convo;
      });
      return data;
    });
  };

  o.get = function(id) {
    return $http.get('/api/conversation/' + id).success(function(data) {
      return data;
    });
  };

  o.createConversation = function(convo) {
    return $http.post('/api/conversation', convo, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      console.log('create convo data', data);
      return data;
    });
  };

  o.postMessage = function(convo, message) {
    return $http.post('/api/conversation/' + convo._id + '/messages', message, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data) {
      return data;
    });
  };

  o.readMessages = function(convo) {
    return $http.put('/api/conversation/' + convo._id + '/read', { user_id: auth.getUser()._id }, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  return o;

});

app.factory('Conversation', function() {

  var Conversation = function () {
    var self = this;
    self.users = [];
    self.messages = [];
    self.new = true;
  };

  return Conversation;

});

app.factory('Message', function() {
  var Message = function(user) {
    var self = this;
    self.user = user._id || null;
    self.f_name = user.f_name || null;
    self.l_name = user.l_name || null;
    self.handle = user.handle || null;
  };

  return Message;

});


app.factory('messageSocket', function(socketFactory) {
  var socket = socketFactory();
  socket.forward('tokenrequest');
  socket.forward('broadcast');
  socket.forward('conversations');
  socket.forward('newmessage');
  socket.forward('newconversation');
  socket.forward('readmessages');
  
  return socket;
});
app.factory('Item', function() {

  var ItemConstructor = function ItemConstructor () {
    this.name         = null;
    this.creator      = { username: null, _id: null };

    this.price        = null;
    this.upvotes      = null;

    this.type         = null;
  };

  return ItemConstructor;

});

/*  ----------------------  *
    CONTROLLER - DIETPLAN
 *  ----------------------  */
/* 
/* ---------------------------- */
app.controller('DietCtrl', function ($scope, $attrs, items, dietplans, Meal, Diet, Day, Recipe, CookingStep, Ingredient) {
  var self = this;
  $scope.debug = true;

  // ---- INIT SCOPE ----  //
  this.init = function(element) {
    self.$element = element;

    if ($scope.item.days.length === 0) {
      $scope.item.days.push(new Day());
    } 
    angular.forEach($scope.item.days, function(day) {
      day.mealOrder = 1;
    });
    $scope.dayOrder = 1;
  };

  $scope.decrementDay = function() {
    if ($scope.dayOrder > 1) $scope.dayOrder--;
  };
  $scope.incrementDay = function() {
    // a diet day index goes from 1 to duration
    if ($scope.dayOrder < $scope.item.duration) {
      $scope.dayOrder++; 
    } else {
      alert('going over days, increase duration confirmation?');
    }
  };

  $scope.decrementMeal = function(day) {
    if (day.mealOrder > 1) day.mealOrder--;
  };
  $scope.incrementMeal = function(day) {
    if (day.mealOrder < day.meals.length)
     day.mealOrder++;
  };

  //$scope.item   = item comes from directive
  $scope.meal         = null;
  $scope.recipe       = null;
  $scope.step         = null;
  $scope.ingredient   = null;

  $scope.initMeal     = function() {
    $scope.meal = new Meal();
    $scope.item.day[$scope.dayOrder-1].meals.push($scope.meal);
  };
  $scope.initRecipe   = function() {
    $scope.recipe = new Recipe();
    var day = $scope.item.days[$scope.dayOrder-1];
    day.meals[day.mealOrder-1].recipes.push($scope.recipe);
    $scope.addWidgetOptions.recipe.item = $scope.recipe;
  };
  $scope.initStep     = function() {
    $scope.step = new CookingStep();
    $scope.step.order = $scope.recipe.steps.length+1;
    $scope.addWidgetOptions.cookingstep.item = $scope.step;
  };
  $scope.initIngredient = function() {
    $scope.ingredient = new Ingredient();
    $scope.addWidgetOptions.ingredient.item = $scope.step;
  };

  $scope.cancelMeal   = function() {
    $scope.meal = null;
  };
  $scope.cancelRecipe = function() {
    $scope.recipe = null;
  };
  $scope.cancelStep   = function() {
    $scope.step = null;
  };
  $scope.cancelIngredient = function() {
    $scope.ingredient = null;
  };

  $scope.saveDiet     = function() {
    if ($scope.item._id) {
      items.update($scope.item);
    } else {
      items.create($scope.item).success(function(data) {
        $scope.item = data;
        $scope.initMeal();
        $scope.meal.day = 1;
      });
    }
  };

  $scope.saveMeal     = function() {
    items.updateDietplan($scope.item, $scope.item.days[$scope.dayOrder-1]).success(function(data) {
      console.log(data);
      $scope.item.days_set = data.days_set;
      $scope.item.days     = data.days;
    });
  };
  $scope.saveRecipe   = function() {
    dietplans.createRecipe($scope.recipe);
    $scope.meal.recipes.push($scope.recipe);
    $scope.recipe = null;
  };
  $scope.saveStep     = function() {
    $scope.recipe.steps.push($scope.step);
    $scope.step = null;
  };
  $scope.saveIngredient = function() {
    $scope.recipe.ingredients.push($scope.ingredient);
    $scope.ingredient = null;
  };


  $scope.addWidgetOptions = {
    ingredient: {
      name: 'Ingredient',
      type: 'ingredient',
      searchable: true,
      fields: [ {field: 'amount', class: 'col-sm-6'},
                {field: 'preparation', class: 'col-sm-6'}, 
                {field: 'note', class: 'col-sm-12'}],
      item: $scope.ingredient
    },

    recipe    : {
      name: 'Recipe',
      type: 'recipe',
      searchable: false,
      save: $scope.saveMeal,
      init: $scope.initRecipe,
      //transclude: + create new recipe
      fields  : [ {field: 'recipe', class: 'col-sm-6'},
                  {field: 'servings', class: 'col-sm-6'} ],
      item: null,
    },

    step      : {
      show_name: false,
      type: 'cookingstep',
      searchable: false,
      //transclude: Step #
      fields: [ {field: 'description', class: 'col-sm-12'} ],
      item: $scope.step
    }
  };


});

app.directive('dietPlan', function () {
  
  return {
    restrict: 'E', 
    scope: { item: '=item' },
    controller: 'DietCtrl',
    templateUrl: 'dietplan.tpl.html',
    link: function(scope, element, attrs, DietCtrl) {
      DietCtrl.init( element );
    }
  };

});

app.directive('mealItinerary', function () {
  
  return {
    restrict: 'E', 
    controller: 'DietCtrl',
    templateUrl: 'mealitinerary.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});

app.directive('recipeCreator', function () {
  
  return {
    restrict: 'E', 
    controller: 'DietCtrl',
    templateUrl: 'recipecreator.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});



app.factory('Diet', function() {

  var DietConstructor = function DietConstructor () {
    this.category     = null;
    this.hashtag      = null;
    this.description  = null;

    this.duration     = 1;
    this.gender       = null;
    this.age          = null;
    this.meals        = [];
  };

  return DietConstructor;
});

app.factory('Day', function() {

  var DayConstructor = function DayConstructor (order) {
    this._id       = null;
    this.order     = order || 1;
    this.title     = null; // for dietplans, like 'carb load'
    this.meals     = [];
    this.exercises = [];

    this.mealOrder = 1;
  };

  return DayConstructor;

});

app.factory('Meal', function() {

  var MealConstructor = function MealConstructor () {
    this.name         = null;
    this.type         = null;
    this.description  = null;

    this.cost         = null;
    this.cooktime     = null;
    this.preptime     = null;
    this.recipes      = [];
  };

  return MealConstructor;

});


app.factory('Recipe', function() {

  var RecipeConstructor = function RecipeConstructor () {
    this.name        = null;
    this.type        = null;
    this.description = null;

    this.video       = null;
    this.coverphoto  = null;
    this.photos      = [];

    this.yield       = null;
    this.cost        = null;
    this.preptime    = null;
    this.cooktime    = null;
    this.equipment   = null;
    this.steps       = [];
    this.ingredients = [];

    this.calories    = null;
    this.fats        = null;
    this.carbs       = null;
    this.proteins    = null;
  };

  return RecipeConstructor;
});


app.factory('CookingStep', function () {

  var CookingStepConstructor = function CookingStepConstructor () {
    this.order       = null;
    this.description = null;
    this.photo       = null;
  };

  return CookingStepConstructor;

});


app.factory('Ingredient', function() {

  var IngredientConstructor = function IngredientConstructor () {
    this.name        = null;
    this.category    = null;
    this.description = null;
    this.photo       = null;

    this.value       = null;
    this.unit        = null;
    this.preparation = null;
  };

  return IngredientConstructor;
});



app.factory('dietplans', function ($http, auth) {
  var o = {};

  o.get = function(diet_id) {
    return $http.get('/api/item/dietplan/' + diet_id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  o.update = function(diet) {
    // diet._id
    return $http.put('/api/item/dietplan/' + diet.dietplan, diet, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.createRecipe = function(recipe) {
    return $http.post('/api/item/dietplan/recipes', recipe, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.createIngredient = function(ingredient) {
    return $http.post('/api/item/dietplan/ingredients', ingredient, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  return o;
});


app.directive('digitalMedia', function () {

  return {
    restrict: 'E', 
    scope: false,
    templateUrl: 'digitalmedia.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});




app.directive('workoutPlan', function () {

  return {
    restrict: 'E', 
    scope: false,
    templateUrl: 'workoutplan.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});


/*

ROW WIDGET FOR ADDING UNITS TO SUBARRAYS OF ITEMS & EVENTS
- subobject                   -> OBJECT
--------------------------------------------------
- meals, recipes, ingredients -> DIETPLANS
- packages                    -> BOOTCAMPS
- items                       -> ONLINE CHALLENGES
- exercises                   -> WORKOUTPLANS ?
<!-- <add-widget class="colasyoulike" parent="recipe" children="ingredients"> -->
<!-- recipe.ingredients = [ ingredient ] -->
<add-widget parent="recipe" child="'ingredient'" children="recipe.ingredients"></add-widget>
*/





// ------------ CONTAINER
app.directive('addWidget', function () {
  return {
    restrict: 'E',
    scope: {
      set: '=',
      options: '=', // array with fields and styling options objects
      // save: '&',
      // init: '&'
    },
    transclude: true,
    controller: 'addWidgetCtrl',
    template: '<div class="col-sm-12"><div>{{options}}</div></div>',
    link: function(scope, elem, attr, ctrl, transclude) {
      transclude(scope, function(clone) {
        console.log(clone);
        element.append(clone);
      });
    }
  };
});




// ------------ ITEM REPEATS
app.directive('addWidgetItems', function () {

  var tpl = '<div ng-repeat="item in set">'+
              '<div class="add-widget-photo">'+
                '<i class="fa fa-3x fa-photo"></i>'+
              '</div>'+ 
            // '<div class="add-widget-photo"><img src="item.photo"/></div>'+
              '<div class="add-widget-title">{{item.name}}</div>'+
              '<div class="add-widget-body" ng-transclude></div>'+
              '</div>';

  return {
    restrict: 'E', 
    require: '^addWidget',
    transclude: true,
    template: tpl
  };

});

// ------------ FORM FOR NEW ITEM
app.directive('addWidgetForm', function () {

  var tpl = '<div style="border: 1px solid #999" title="New {{item_type}}">'+
                '<div class="col-sm-2"><i class="fa fa-2x fa-photo"></i></div>'+
                '<div class="col-sm-10">'+
                  '<span ng-transclude></span>'+
                  '<input class="col-sm-{{options.searchable? \'8\' : \'12\'}}" type="text" placeholder="options.name" ng-model="item.name" ng-show="!!options.name">'+
                  '<button class="btn-sm col-sm-4" ng-click="search()" ng-if="options.search">'+
                    '<i class="fa fa-search"></i>'+
                  '</button>'+
                  '<input ng-class="field.class" type="text" ng-repeat="field in options.fields" placeholder="{{field.field}}" ng-model="item[field.field]">'+
                  '<button class="form-control btn-xs" ng-click="save()"><i class="fa fa-floppy-o"></i></button>'+
                '</div>'+
             '</div>';

  return {
    restrict: 'E', 
    require: '^addWidget',
    transclude: true,
    replace: true,
    template: tpl,
    link: function(scope, element, attrs, ctrl) {
      // scope.$watch(scope.$parent.options, function(newVal) {
        // console.log(newVal);
        // scope.options = newVal;
      // });
    }
  };
});





// ------------ PLUS BUTTON
app.directive('addWidgetPlus', function () {
  var tpl = '<div class="text-center" style="height: 50px; border: 1px solid #999" title="Add {{item_type}}">'+
            '<i class="fa fa-2x fa-plus"></i> {{item_type}}'+
            '</div>';

  return {
    restrict: 'E', 
    require: '^addWidget',
    template: tpl,
    replace: true,
    link: function(scope, element, attrs, ctrl) {
      element.bind('click', function() {
        scope.$apply(scope.$parent.options.init());
        console.log('clicked');
      });
    }
  };
});


app.controller('addWidgetCtrl', function($scope) {
    $scope.initChild = function() {
        console.log('init child');

    };
});
/*

SLIDES WIDGET TO VIEW CONTENT THAT CAN BE VIEWED LIKE CAROUSEL
can tick through a single array
data = 
scope.item.days = [
  { order: 1, meals: [ {}, {}, {} ] },
  { order: 2, meals: [ {}, {}, {} ] },
  { order: 3, meals: [ {}, {}, {} ] },
]

<slide-display data=item.days></slide-display>

*/


// ------------ CONTAINER
app.directive('slideDisplay', function () {

  var slideCtrl = function($scope) {
    var self = this,
        currentIndex = -1,
        currentSlide;
    var slides = [];

    $scope.$watch($scope.viewingDay.meals, function(newval) {
      meals = $scope.viewingDay.meals;
    });

    $scope.next = function() {
      var newIndex = (self.getCurrentIndex() + 1) % meals.length;
    };

    $scope.prev = function() {
      var newIndex = self.getCurrentIndex() -1 < 0? meals.length -1 : self.getCurrentIndex - 1;
    };

    $scope.isActive = function(meal) {
      return self.currentMeal === meal;
    };

  };
  return {
    restrict: 'E',
    scope: {
      data: '=',
      options: '=', 
    },
    transclude: true,
    controller: 'slideCtrl',
    template: '<div class="col-sm-12" ng-transclude></div>'
  };

});

// app.directive('meal', function() {
//   var template = '<div ng-class="{\'active\': active }" class="item text-center" ng-transclude></div>';
//   return {
//     require: '^mealDisplay',
//     restrict: 'E',
//     transclude: true,
//     replace: true,
//     scope: {
//       active: '=?',
//       index: '=?'
//     },
//     link: function (scope, element, attrs, dietCtrl) {
//       dietCtrl.addSlide(scope, element);
//       //when the scope is destroyed then remove the slide from the current slides array
//       scope.$on('$destroy', function() {
//         dietCtrl.removeMeal(scope);
//       });

//       scope.$watch('active', function(active) {
//         if (active) {
//           dietCtrl.select(scope);
//         }
//       });
//     }
//   };
// });

app.directive('fileUpload', function() {
  return {
  	restrict: 'EA',
  	link: function(scope, elem, attr) {
  		console.log('directive fileUpload scope\n', scope);
  		console.log('directive fileUpload elem\n', elem);
  		elem.bind('change', function(event) {
          scope.user.avatar = event.target.files[0];
          console.log(scope.user, event);
  		});
  	}

  };

});