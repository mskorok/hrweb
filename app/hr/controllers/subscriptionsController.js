angular.module('Subscriptions', [], function () {
    // console.log('module Subscriptions init');
}).controller('subscriptionsController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        '$cacheFactory',
        function (
            $scope, $state, $cookies, $http, $templateCache, $location, $cacheFactory
        ) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.rest_api_host = rest_api_host;

            let token = 'Bearer ' + $cookies.get('rest_user_token');
            $templateCache.removeAll();

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

            $scope.subscriptions = []
            $scope.company = true;

            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            $scope.subscribeUser = (subscription_id) => {
                let url = rest_api_host + 'users/subscribe/user/' + subscription_id + '?prevent=' +  + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token},
                        cache: false
                    }
                ).then(function (data) {
                        $templateCache.remove('hr/templates/subscriptions.html');
                        localStorage.clear()
                        window.location.reload();
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );
            }

            $scope.unsubscribeUser = (subscription_id) => {
                let url = rest_api_host + 'users/unsubscribe/user/' + subscription_id + '?prevent=' +  + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token},
                        cache: false
                    }
                ).then(function (data) {
                        $templateCache.remove('hr/templates/subscriptions.html');
                        localStorage.clear()
                        window.location.reload();
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );
            }

            $scope.subscribeCompany = (company_id, subscription_id) => {
                let url = rest_api_host + 'users/subscribe/company/' + company_id + '/' + subscription_id + '?prevent=' +  + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token},
                        cache: false
                    }
                ).then(function (data) {
                        $templateCache.remove('hr/templates/subscriptions.html');
                        window.location.reload();
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );
            }
            $scope.unsubscribeCompany = (company_id, subscription_id) => {
                let url = rest_api_host + 'users/unsubscribe/company/' + company_id + '/' + subscription_id + '?prevent=' +  + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token},
                        cache: false
                    }
                ).then(function (data) {
                        $templateCache.remove('hr/templates/subscriptions.html');
                        window.location.reload();
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );

            }


            if ($state.current.controller === "subscriptionsController") {
                let url = rest_api_host + 'users/subscriptions?random=' + get_random_number();

                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token},
                        cache: false
                    }
                ).then(function (data) {

                        $scope.subscriptions = data.data.data;
                    },
                    function (data) {
                        console.error('error response', data);
                    }
                );
            }

            $scope.$on('$viewContentLoaded', function () {
            });
        }
    ]
);