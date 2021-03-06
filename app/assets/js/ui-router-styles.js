
(function() {
  'use strict';
  angular
      .module('uiRouterStyles', ['ui.router'])
      .directive('uiRouterStyles', uiRouterStylesDirective);

  uiRouterStylesDirective.$inject = ['$rootScope', '$compile', '$state', '$interpolate', '$document', '$transitions'];
  function uiRouterStylesDirective($rootScope, $compile, $state, $interpolate, $document, $transitions) {

    return {
      restrict: 'EA',
      link: uiRouterStylesLink
    };

    function uiRouterStylesLink(scope) {
      var start = $interpolate.startSymbol(), end = $interpolate.endSymbol();
      var html = '<link rel="stylesheet" ng-repeat="(k, css) in routeStyles track by k" data-ng-href="' + start + 'css' + end + '" >';

      scope.routeStyles = [];

      activate();

      ////

      function activate() {
        $transitions.onSuccess({}, stateChangeSuccessCallback);
        angular.element($document[0].head).append($compile(html)(scope));
      }

      // Get the parent state
      function $$parentState(state) {
        // Check if state has explicit parent OR we try guess parent from its name
        var name = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
        // If we were able to figure out parent name then get this state
        return name && $state.get(name);
      }

      function stateChangeSuccessCallback(evt) {
        var toState = evt.to();
        // From current state to the root
        var stylesObject = {};
        scope.routeStyles = [];

        for (var state = toState; state && state.name !== ''; state=$$parentState(state)) {
          if (state && state.data && state.data.css) {
            if (!Array.isArray(state.data.css)) {
              state.data.css = [state.data.css];
            }

            angular.forEach(state.data.css, function(css) {
              // css = {name: 'layout', href: '/layout.css'}
              if (typeof css === 'object' && css.name && css.href && !stylesObject[css.name]) {
                stylesObject[css.name] = css.href;
              } else if(typeof css === 'string') {
                stylesObject[css] = css;
              }
            });

            angular.forEach(stylesObject, function(style) {
              if(scope.routeStyles.indexOf(style) === -1) scope.routeStyles.push(style);
            });
          }
        }
        scope.routeStyles.reverse();
      }
    }
  }
})();
