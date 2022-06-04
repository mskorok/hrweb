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

            $scope.notifications = [];

            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                })
            }

            if ($state.current.controller === 'notificationsController') {
                $scope.$on('$viewContentLoaded', function () {
                    const form = document.getElementById('notification_create_form');
                    if (form) {
                        form.addEventListener('submit', () => {
                            $('#notificationModal').modal('hide');
                            let ids = [];
                            let chb_inputs = form.elements['role'];
                            if (chb_inputs) {
                                if (chb_inputs.constructor.name === 'HTMLInputElement') {
                                    chb_inputs = [chb_inputs];
                                }

                                [].forEach.call(chb_inputs, (input) => {
                                    if (input.checked) {
                                        ids.push(input.value)
                                    }
                                })
                            }


                            let title = form.elements['title'];
                            title = title ? title.value : '';

                            let desc = form.elements['description'];
                            desc = desc ? desc.value : '';
                            const data = {
                                description: desc,
                                title: title,
                                category: ids.join(',')
                            };

                            $("#notification_create_form").trigger('reset');

                            let url = rest_api_host + 'notifications/create?random='  + get_random_number();
                            console.warn('data', data, url);
                            $http({
                                method: 'POST',
                                url: url,
                                headers: {'Authorization': token},
                                data: {
                                    description: desc,
                                    title: title,
                                    category: ids.join(',')
                                }
                            }).then(function (data) {
                                    console.info(data);
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        });
                    }
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            let url = rest_api_host + 'notifications/collection?random='  + get_random_number();
                            $http.get(url
                                ,
                                {
                                  headers: {'Authorization': token}
                                }
                            ).then(function (data) {
                                    $scope.notifications = data.data.data;
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