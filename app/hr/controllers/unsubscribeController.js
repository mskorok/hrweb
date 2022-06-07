angular.module('Unsubscribe', [], function () {
    // console.log('module Unsubscribe init');
}).controller(
    'unsubscribeController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$location',
        function ($scope, $state, $cookies, $http, $location) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.job_content = 'hr/templates/partial/job-content.html';
            $scope.job_content_mobile = 'hr/templates/partial/job-content-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.success = false;

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user_name();
            $scope.user_avatar = hr_user_avatar();

            const email = $location.search().email;
            let category = $location.search().category;
            category = category ? category : '';
            const data = {
                email: email,
                category: category
            };

            if ($state.current.controller === "unsubscribeController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            const url = rest_api_host + 'unsubscribe/mail' + '?random='  + get_random_number();
                            $http.post(url, data).then(function (data) {
                                    if (data.data.result === 'OK') {
                                        $scope.success = true;
                                    } else if (data.data.result === 'error') {
                                        $scope.error = data.data.message;
                                        console.log('error', data.data.message);
                                    } else {
                                        console.log('error response', data);
                                    }
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