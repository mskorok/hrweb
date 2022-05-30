angular.module('Company', [], function () {
    // console.log('module Company init');
}).controller('companyController', [
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

            var token = 'Bearer ' + $cookies.get('rest_user_token');

            var user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();


            // var company_id = window.location.pathname.split("/").pop();

            var company_id = $stateParams.id;

            $scope.company_id = company_id;

            var delete_url = rest_api_host + 'company/delete/' + company_id;

            $scope.deleteCompany = function () {
                if (!user_id) {
                    return false;
                }
                if (confirm("Are you sure?") === false) {
                    return false;
                }
                $http.get(delete_url
                    ,
                    {
                        headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        if (data.result === 'OK') {

                        }
                        if (data.data.result === 'OK') {
                            $state.go('company-list', {
                                url: '/company/list'
                            })
                        } else if (data.data.result === 'error') {
                            $scope.error = data.data.message;
                            console.log('error', data.data.message);
                        } else {
                            $scope.error = 'Something went wrong';
                            console.log('error response', data);
                        }
                    },
                    function (data) {
                        $scope.error = 'Something went wrong';
                        console.log('error response', data);
                    });
            };


            if ($state.current.controller === "companyController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            var url = rest_api_host + 'companies/' + company_id + '?include=Countries,Images';
                            $http.get(url).then(function (data) {
                                    $scope.company = data.data.company;
                                    $scope.avatar = rest_api_host + $scope.company.Images.path + $scope.company.Images.fileName;
                                    // $('#content_container').html(data.data.html);
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        }
                    });
                });
                angular.element(document).ready(function () {

                });
            }
        }
    ]
);