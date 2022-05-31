angular.module('Notifications', [], function () {
    // console.log('module Notifications init');
}).controller('notificationsController', [
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
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.rest_api_host = rest_api_host;


            let token = 'Bearer ' + $cookies.get('rest_user_token');

            let user_id = hr_authorized_id();

            $scope.user_id = user_id;
            $scope.user = hr_user();
            $scope.user_name = hr_user_name();
            $scope.user_avatar = hr_user_avatar();
            $scope.role = hr_get_roles();

            $scope.company = $scope.role === 'admin' || $scope.role === 'superadmin' || $scope.role === 'partner' || $scope.role === 'manager';
            $scope.companyAdmin = $scope.role === 'admin' || $scope.role === 'superadmin' || $scope.role === 'companyAdmin';
            $scope.admin =$scope.role === 'admin' || $scope.role === 'superadmin';
            $scope.superadmin = $scope.role === 'superadmin';


            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            if ($state.current.controller === "adminController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            let url = rest_api_host + 'users/' + user_id + '?include=ProfessionalExperiences,Education,Images,Countries,Subscriptions,Invitations,AppliedVacancies,Vacancies,Resumes,Resumes,Senders,FavoriteResumes,FavoriteVacancies&random='  + get_random_number();
                            $http.get(url
                                ,
                                {
                                  headers: {'Authorization': token}
                                }
                            ).then(function (data) {
                                    $scope.user = data.data.user;
                                    let role = $scope.user.role;
                                    $scope.user.role = $scope.user.role.capitalize();

                                    $scope.company = role === 'admin' || role === 'superadmin' || role === 'partner' || role === 'manager';
                                    // $scope.company = true;
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