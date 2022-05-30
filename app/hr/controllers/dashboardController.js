angular.module('Dashboard', [], function () {
    // console.log('module Dashboard init');
}).controller('dashboardController', [
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
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
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
            $scope.admin = $scope.role === 'admin' || $scope.role === 'superadmin';
            $scope.superadmin = $scope.role === 'superadmin';


            $scope.subscriptions = 0

            $scope.totalVacancies = 0;
            $scope.favoriteVacancies = 0;
            $scope.appliedVacancies = 0

            $scope.totalResumes = 0;
            $scope.myResumes = 0;
            $scope.invitations = 0
            $scope.favoriteResumes = 0

            $scope.companyRequests = 0;


            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            $http.get(rest_api_host + 'home').then(function (data) {
                if (typeof data.data.vacancies != "undefined")
                    $scope.totalVacancies = data.data.vacancies;
                if (typeof data.data.resumes != "undefined")
                    $scope.totalResumes = data.data.resumes;
            });

            if ($state.current.controller === "dashboardController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            let url = rest_api_host + 'users/' + user_id + '?include=ProfessionalExperiences,Education,Images,Countries,Companies,Subscriptions,Invitations,AppliedVacancies,Vacancies,Resumes,Resumes,Senders,FavoriteResumes,FavoriteVacancies&random=' + get_random_number();
                            $http.get(url
                                ,
                                {
                                    headers: {'Authorization': token},
                                    cache: false
                                }
                            ).then(function (data) {
                                    $scope.user = data.data.user;
                                    let role = $scope.user.role;
                                    $scope.user.role = $scope.user.role.capitalize();
                                    $scope.company = role === 'admin' || role === 'superadmin' || role === 'partner' || role === 'manager';
                                    $scope.admin = role === 'admin' || role === 'superadmin';
                                    $scope.companyAdmin = role === 'admin' || role === 'superadmin' || role === 'companyAdmin';
                                    $scope.superadmin = role === 'superadmin';

                                    $scope.companies = $scope.user.Companies.length;
                                    $scope.favoriteVacancies = $scope.user.FavoriteVacancies.length;
                                    $scope.appliedVacancies = $scope.user.AppliedVacancies.length;
                                    $scope.myResumes = $scope.user.Resumes.length;
                                    $scope.invitations = $scope.user.Invitations.length;
                                    $scope.favoriteResumes = $scope.user.FavoriteResumes.length;
                                    $scope.subscriptions = $scope.user.Subscriptions.length;


                                    let _url = rest_api_host + 'users/company/subscriptions?random='+ get_random_number();
                                    $http.get(_url
                                        ,
                                        {
                                            headers: {'Authorization': token},
                                            cache: false
                                        }
                                    ).then(function (data) {
                                            if (data.data.data) {
                                                $scope.subscriptions = data.data.data.user.length + data.data.data.companies.length;
                                            }

                                        },
                                        function (data) {
                                            console.log('error response', data);
                                        });
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