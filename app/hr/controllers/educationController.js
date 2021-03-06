angular.module('Education', [], function () {
    // console.log('module Education init');
}).controller('educationController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function (
            $scope, $state, $cookies, $http, $templateCache, $location
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
            const edu_id = window.location.pathname.split("/").pop();

            if ($state.current.controller === "educationController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            const url = rest_api_host + 'education' + edu_id + '?random='  + get_random_number();
                            $http.get(url).then(function (data) {
                                    $scope.education = data.data;
                                    $('#content_container').html(data.data.html);
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