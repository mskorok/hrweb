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
            $scope.show_select = true;

            if (!page) {
                page = 1;
            }

            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.header_search = 'hr/templates/partial/header-search-educations.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user();
            $scope.user_avatar = hr_user_avatar();

            $scope.institutions = [];

            $scope.$on('$includeContentLoaded', function (event, templateName) {

                if (templateName.toString() === 'hr/templates/partial/footer.html') {
                    var url = rest_api_host + 'institutions/list' + '?include=Countries,EducationLevel&page=' + page;
                    $http.get(url).then(function (data) {
                        if (data.data.data.institutions) {
                            $scope.institutions = data.data.data.institutions
                        }
                    });

                    var select = jQuery("#banner");
                    var options = [];
                    if (select[0]) {
                        options = select[0].querySelectorAll('option');
                    }


                    $scope.show_select = true;
                    select.chosen({width: "100px",});
                    select.chosen().change(function () {
                        $scope.lang = parseInt($(this).val());
                        console.warn(2, $scope.lang);
                        [].forEach.call(options, function (option) {
                            option.removeAttribute('selected');
                        });
                        [].forEach.call(options, function (option) {
                            var val = parseInt(option.getAttribute('value'));
                            if (val === $scope.lang) {
                                option.setAttribute('selected', 'selected');
                            }
                        });
                    });
                }
            });
        }
    ]
);