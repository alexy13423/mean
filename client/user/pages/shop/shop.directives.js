app.directive('dietPlan', function () {
  
  return {
    restrict: 'E', 
    scope: { item: '=item' },
    controller: 'DietCtrl',
    templateUrl: 'shop.dietplan.tpl.html',
    link: function(scope, element, attrs, DietCtrl) {
      DietCtrl.init( element );
    }
  };

});

app.directive('mealRecipes', function() {
  return {
    restrict: 'E',
    // scope: {
    //   recipes: '='
    // },
    template: ['<div ng-repeat="recipe in recipes">',
                '<div class="col-sm-3><i class="fa fa-2x fa-photo"></i></div>',
                '<div class="col-sm-9>{{recipe.title}} <br/>',
                '{{recipe.yield}} Servings</div>',
                '</div>'].join(),
    link: function() {}

  };
});

app.directive('mealRecipeAdder', function() {
  return {
    restrict: 'E',
    template: ['<div>', 
                 '<div ng-show="recipe"><small>upload</small> <i class="fa fa-lg fa-photo"></i>',
                   '<input type="text" placeholder="Recipe" ng-model="recipe.title" ng-blur="searchRecipes()">',
                   '<input type="text" placeholder="Servings" ng-model="recipe.yield">',
                   '<br/><a ng-click="initRecipe()">+ new recipe</a>',
                 '</div>',
                 '<div style="border: 1px solid #999" ng-click="initMeal()" ><i class="fa fa-2x fa-plus"></i></div>',
               '</div>'].join(),
//     link: function() {}
  };
});

app.directive('recipeCreator', function () {
  
  return {
    restrict: 'E', 
    controller: 'DietCtrl',
    templateUrl: 'shop.recipe.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});

app.directive('workoutPlan', function () {

  return {
    restrict: 'E', 
    scope: false,
    templateUrl: 'shop.workoutplan.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});




app.directive('digitalMedia', function () {

  return {
    restrict: 'E', 
    scope: false,
    templateUrl: 'shop.digitalmedia.tpl.html',
    link: function(scope, element, attrs) {
    }
  };

});



