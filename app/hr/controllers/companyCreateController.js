angular.module('CompanyCreate', [], function () {
    // console.log('module CompanyCreate init');
}).controller(
    'companyCreateController',
    [
        '$scope',
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
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            let token = 'Bearer ' + $cookies.get('rest_user_token');

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            if (!hr_authorized()) {
                $state.go('login', {
                    url: '/login'
                })
            }

            let url = rest_api_host + 'company/create' + '?random='  + get_random_number();

            $scope.$on('$viewContentLoaded', function () {
                // console.log('url', url);
                $http.get(url
                    ,
                    {
                      headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        // console.log('loaded', new Date().getTime());
                        // console.log('form', data.data.html);

                        $('#content_container').html(data.data.html);

                        hr_create.init();
                        hr_create.autocomplete();
                        hr_create.submit();
                    },
                    function (data) {
                        console.log('error response', data);
                    });
            });

            let hr_create = {
                init: function () {
                    //
                },
                autocomplete: function () {
                    //
                },
                submit: function () {
                    let self = this;
                    let button = document.querySelector('button[type=submit]');
                    let form = button.closest('form');
                    if (form) {
                        form.addEventListener('submit', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            self.send(form);
                            return false;
                        })
                    }
                },
                send: function (form) {
                    hr_sanitize_checkbox(form);
                    let form_data = new FormData(form);

                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    let error_container = document.getElementById('error_container');
                                    error_container.innerHTML = '';
                                    let response = JSON.parse(this.response);

                                    let html = '';
                                    if (response.result === 'error') {
                                        if (error_container) {
                                            if (Array.isArray(response.message)) {
                                                response.message.forEach(function (message) {
                                                    if (typeof message === 'object') {
                                                        for (let key in message) {
                                                            html += '<div>' + key + ' : ' + message[key] + '</div>';
                                                        }
                                                    } else if (typeof message === 'string') {
                                                        html += '<div>' + message + '</div>';
                                                    }
                                                });
                                            } else if (typeof response.message === 'object') {
                                                for (let key in response.message) {
                                                    html += '<div>' + key + ' : ' + response.message[key] + '</div>';
                                                }
                                            } else {
                                                html = '<div>' + response.message + '</div>';
                                            }
                                            error_container.innerHTML = html;
                                            window.location.hash = 'top';
                                        }
                                        console.log('error', response.message, html);
                                    } else if (response.result === 'OK') {
                                        console.log('OK');
                                        // alert('ok');
                                        $state.go('company-list', {
                                            url: '/company/list'
                                        })
                                    } else if (response.html) {
                                        $('#content_container').html(response.html);
                                    }

                                    console.log('error2');

                                } catch (e) {
                                    console.log('error', e);
                                }
                            } else {
                                console.log('error response', this.response);
                            }
                        }
                    };
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.setRequestHeader('Authorization', token);
                    xhr.send(form_data);
                }

            };
        }
    ]
);