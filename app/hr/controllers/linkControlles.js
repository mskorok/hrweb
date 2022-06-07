angular.module('Link', [], function () {
    // console.log('module Link init');
}).controller('linkController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
    '$stateParams',
        function (
            $scope, $state, $cookies, $http, $templateCache, $location, $stateParams
        ) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            // var article_id = window.location.pathname.split("/").pop();

            const article_id = $stateParams.id;

            if ($state.current.controller === "linkController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            const url = rest_api_host + 'articles-linked/' + article_id  + '?random='  + get_random_number();
                            // console.log('url', url);
                            $http.get(url).then(function (data) {
                                    // console.log(data.data.html);
                                    $scope.article = data.data;
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        }
                    });
                });
            }
        }
    ]
);