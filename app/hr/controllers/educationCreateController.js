angular.module('EducationCreate', [], function () {
    // console.log('module EducationCreate init');
}).controller(
    'educationCreateController',
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
            $scope.footer = 'hr/templates/partial/footer.html';

            const token = 'Bearer ' + $cookies.get('rest_user_token');

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            if (!hr_authorized()) {
                $state.go('login', {
                    url: '/login'
                })
            }

            const url = rest_api_host + 'education/create' + '?random='  + get_random_number();

            $scope.$on('$viewContentLoaded', function () {
                $http.get(url
                    ,
                    {
                      headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        $('#content_container').html(data.data.html);

                        hr_create.init();
                        hr_create.autocomplete();
                        hr_create.submit();
                    },
                    function (data) {
                        console.log('error response', data);
                    });
            });

            const hr_create = {
                init: function () {
                    //
                },
                autocomplete: function () {
                    //
                },
                submit: function () {
                    const self = this;
                    const button = document.querySelector('button[type=submit]');
                    const form = button.closest('form');
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
                    const form_data = new FormData(form);

                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    const error_container = document.getElementById('error_container');
                                    error_container.innerHTML = '';
                                    const response = JSON.parse(this.response);

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
                                        alert('ok');
                                        $state.go('profile', {
                                            url: '/profile'
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