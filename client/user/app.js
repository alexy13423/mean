var app = angular.module('mainApp', ['ui.router','templates', 'ngImgCrop', 'flow']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/:post',
      templateUrl: 'posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    })
    .state('shop', {
      url: '/shop',
      templateUrl: 'shop.html',
      controller: 'ShopCtrl',
      resolve: {
        itemPromise: ['items', function(items){
          return items.getAll();
        }]
      }
    })
    .state('items', {
      url: '/items/:item',
      templateUrl: 'items.html',
      controller: 'ItemsCtrl',
      resolve: {
        item: ['$stateParams', 'items', function($stateParams, items) {
          return items.get($stateParams.id);
        }]
      }
    })
    .state('transactions', {
      url: '/transactions',
      templateUrl: 'transactions.html',
      controller: 'TransCtrl',
      resolve: {
        item: ['$stateParams', 'items', function($stateParams, items) {
          return items.get($stateParams.id);
        }]
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
        groupPromise: ['groups', function(groups){
          return groups.getAll();
        }]
      }
    })
    .state('/group_home', {
      url: '/group_home/:group',
      templateUrl: 'group_home.html',
      controller: 'GHomeCtrl',
      resolve: {
        gpostPromise: ['gposts', function(gposts){
          return gposts.getAll();
        }]
      }
    })
    .state('/gposts', {
      url: '/gposts/:gpost',
      templateUrl: 'gposts.html',
      controller: 'GpostCtrl',
      resolve: {
        gcommentPromise: ['gcomments', function(gcomments){
          return gcomments.getAll();
        }]
      }
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'settings.html',
      controller: 'SettingsCtrl',
    });
  // $urlRouterProvider.otherwise('home');
}]);