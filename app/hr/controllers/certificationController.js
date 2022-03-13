angular.module('Certification', [], function () {
    console.log('module Certification init');
}).controller(
    'certificationController',
    [
        "$scope",
        '$http',
        function ($scope, $http) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user();
            $scope.user_avatar = hr_user_avatar();

            $scope.$on('$includeContentLoaded', function (event, templateName) {
                console.log(templateName);
                // if (templateName.indexOf('header') !== -1) {
                //   //
                // }
            });
        }
    ]
);