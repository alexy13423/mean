angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("index.html","<!DOCTYPE html>\n<!--[if lt IE 7]>      <html class=\"no-js lt-ie9 lt-ie8 lt-ie7\"> <![endif]-->\n<!--[if IE 7]>         <html class=\"no-js lt-ie9 lt-ie8\"> <![endif]-->\n<!--[if IE 8]>         <html class=\"no-js lt-ie9\"> <![endif]-->\n<!--[if gt IE 8]><!--> <html data-ng-app=\"mainApp\"> <!--<![endif]-->\n<head>\n\n    <!-- //// TITLE \\\\\\\\ -->\n    <title>Mean Starter // Application</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Mean Web Application\">\n    <meta name=\"author\" content=\"Leo Schultz\">\n    <meta name=\"keyword\" content=\"Mean, Starter\">\n\n    <!-- //// FAVICON \\\\\\\\ -->\n    <link rel=\"SHORTCUT ICON\" href=\"images/favicon.ico\" />\n\n    <!-- //// BOOTSTRAP \\\\\\\\ -->\n    <link rel=\"stylesheet\" href=\"//ajax.aspnetcdn.com/ajax/bootstrap/3.3.2/css/bootstrap.min.css\" />\n    <link rel=\"stylesheet\" href=\"//netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.css\" />\n    <!-- //// CSS \\\\\\\\ -->\n<!--\n    <link href=\'css/fonts.css\' rel=\"stylesheet\"/>\n    <link href=\"css/style.css\" rel=\"stylesheet\">\n-->\n\n    <link href=\'dist/all.min.css\' rel=\"stylesheet\"/>\n\n    <!-- //// IE \\\\\\\\ -->\n    <script>\n      var ie9 = false,\n          ie8 = false,\n          ie = false,\n          absurl = \'/\';\n    </script> \n    \n    <!--[if lte IE 9 ]>\n      <script> var ie9 = true; </script>\n    <![endif]--> \n\n    <!--[if lt IE 9 ]>\n      <script> var ie8 = true; </script>\n      <script src=\"https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js\"></script>\n      <script src=\"https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js\"></script>\n    <![endif]-->\n\n    <!--[if IE]>\n      <script> var ie = true; </script>\n    <![endif]-->\n    \n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js\"></script>\n    <!-- start Mixpanel --><script type=\"text/javascript\">(function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(\".\");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;\"undefined\"!==typeof d?c=b[d]=[]:d=\"mixpanel\";c.people=c.people||[];c.toString=function(b){var a=\"mixpanel\";\"mixpanel\"!==d&&(a+=\".\"+d);b||(a+=\" (stub)\");return a};c.people.toString=function(){return c.toString(1)+\".people (stub)\"};i=\"disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user\".split(\" \");\nfor(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement(\"script\");a.type=\"text/javascript\";a.async=!0;a.src=\"undefined\"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:\"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js\";e=f.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);\nmixpanel.init(\"08314cf925efc4376a17217e8922cd22\");</script><!-- end Mixpanel -->\n</head>\n<body data-ng-controller=\"MainCtrl\">\n\n\n  <div class=\"row\">\n    <div class=\"col-md-6 col-md-offset-3\">\n      <ui-view></ui-view>\n    </div>\n  </div>\n\n\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular.min.js\"></script>\n  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js\"></script>\n\n<!--\n  <script src=\"app.js\"></script>\n  <script src=\"/js/controllers.js\"></script>\n  <script src=\"/js/models.js\"></script>\n-->\n  <script src=\"dist/all.min.js\"></script>\n  <script src=\"dist/templates.js\"></script>\n</body>\n</html>");
$templateCache.put("emailVerify.html","<div class=\"row\">\n  <div class=\"col-md-6 col-md-offset-3\">\n      <div class=\"page-header\">\n        <h1>You have confirmed your email.</h1>\n        <h3><a>Login</a></h3>\n      </div>\n    </div>\n</div>");
$templateCache.put("resetPassword.html","  <div class=\"page-header\">\n    <h1>Mean Starter</h1>\n  </div>\n\n  <div data-ng-show=\"error\" class=\"alert alert-danger row\">\n    <span>{{ error.message }}</span>\n  </div>\n\n  <form data-ng-submit=\"submitPassword()\"\n    style=\"margin-top:30px;\">\n    <h3>Reset Password</h3>\n    <div class=\"form-group\">\n      <input type=\"password\"\n      class=\"form-control\"\n      placeholder=\"New Password\"\n      data-ng-model=\"user.password\"></input>\n    </div>\n    <div class=\"form-group\">\n      <input type=\"password\"\n      class=\"form-control\"\n      placeholder=\"Repeat Password\"\n      data-ng-model=\"user.repeat_password\"></input>\n    </div>\n    <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n  </form>");
$templateCache.put("search.html","<h3>Search for a User</h3>\n<form data-ng-submit=\"submitSearch()\">\n	<div class=\"form-group\">\n	  <input type=\"text\"\n	    class=\"form-control\"\n	    placeholder=\"Search\"\n	    data-ng-model=\"search.query\"></input>\n	</div>\n	<button class=\"btn btn-primary\" style=\"width:100%;\">Search</button>\n</form>\n<h3>Results:</h3>\n<div data-ng-repeat=\"user in users\">\n	<table class=\"table\">\n	  <tr>\n	  	<td>First Name</td>\n	  	<td>Last Name</td>\n	  	<td>Handle</td> \n	  	<td>View Profile</td>\n	  </tr>\n	  <tr>\n	    <td>{{user.f_name}}</td> \n	    <td>{{user.l_name}}</td> \n	    <td>{{user.handle}}</td>\n	    <td><a href=\"#/user/{{user.handle}}\">View Profile</a></td>  \n	  </tr>\n	</table>\n</div>");
$templateCache.put("userProfile.html","<h3>Profile for {{user.f_name}} {{user.l_name}}</h3>\n<table class=\"table\">\n  <tr>\n  	<td>ID</td>\n  	<td>{{user._id}}</td>\n  </tr>\n  <tr>\n    <td>First Name</td>\n    <td>{{user.f_name}}</td> \n  </tr>\n  <tr>\n    <td>Last Name</td> \n    <td>{{user.l_name}}</td>\n  </tr>\n  <tr>\n  	<td>Address</td> \n    <td>{{user.address}}</td>\n  </tr>\n  <tr>\n  	<td>Date of Birth</td> \n    <td>{{user.dob}}</td>\n  </tr>\n  <tr>\n  	<td>Handle</td> \n    <td>{{user.handle}}</td>\n  </tr>\n</table>\n");}]);