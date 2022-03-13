angular.module('Educations', [], function () {
    console.log('module Educations init');
}).controller(
    'educationsController',
    [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {

            var page = $location.search().page;

            if (!page) {
                page = 1;
            }

            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user();
            $scope.user_avatar = hr_user_avatar();

            $scope.institutions = [];

            $scope.$on('$includeContentLoaded', function (event, templateName) {

                if (templateName.toString() === 'hr/templates/partial/footer.html') {
                    var url = rest_api_host + 'institutions/list' + '?page=' + page;
                    console.warn(url);
                    $http.get(url).then(function (data) {
                        console.log('data institutions', data.data.data.institutions);
                        if (data.data.data.institutions) {
                            $scope.institutions = data.data.data.institutions
                        }
                    });
                }
            });
        }
    ]
);