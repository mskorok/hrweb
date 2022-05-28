angular.module('Subscriptions', [], function () {
    // console.log('module Subscriptions init');
}).controller('subscriptionsController', [
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
            console.warn('token', token);

            let user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();
            $scope.superadmin = false;

            $scope.subscriptions = 0

            $scope.totalVacancies = 0;
            $scope.favoriteVacancies = 0;
            $scope.appliedVacancies = 0

            $scope.totalResumes = 0;
            $scope.myResumes = 0;
            $scope.invitations = 0
            $scope.favoriteResumes = 0

            $scope.superadmin = true;
            $scope.company = true;


            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            $http.get(rest_api_host + 'home').then(function (data) {
                // console.log('data home', data);
                if (typeof data.data.vacancies != "undefined")
                    $scope.totalVacancies = data.data.vacancies;
                if (typeof data.data.resumes != "undefined")
                    $scope.totalResumes = data.data.resumes;
            });

            if ($state.current.controller === "subscriptionsController") {
                let url = rest_api_host + 'users/subscriptions/' + user_id;
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        console.warn('data', data);

                        // $scope.user = data.data.user;
                        //
                        // let role = $scope.user.role;
                        // $scope.user.role = $scope.user.role.capitalize();
                        //
                        // $scope.company = role === 'admin' || role === 'superadmin' || role === 'partner' || role === 'manager';
                        // $scope.admin = role === 'admin' || role === 'superadmin';
                        // $scope.companyAdmin = role === 'admin' || role === 'superadmin' || role === 'companyAdmin';
                        // $scope.superadmin = role === 'superadmin';
                        //
                        // $scope.subscriptions = $scope.user.Subscriptions.length;
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );
            }
        }
    ]
);