angular.module('VacancyCreate', [], function () {
    // console.log('module VacancyCreate init');
}).controller(
    'vacancyCreateController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            var token = 'Bearer ' + $cookies.get('rest_user_token');

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            if (!hr_authorized()) {
                $state.go('login', {
                    url: '/login'
                })
            }

            var url = rest_api_host + 'vacancy/create/';

            $scope.modelEdit = false;
            $scope.modelDelete = false;
            $scope.modelShow = false;


            $scope.$on('$viewContentLoaded', function () {
                $http.get(url
                    ,
                    {
                      headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        if (data.data.result && data.data.result === 'error') {
                            $('#error_container').text('Error occurred');
                            if (data.data.message === 'company not found') {
                                $('#error_container').text('Your company not found,<br> please first create company in your profile');
                            }
                        } else {
                            $('#content_container').html(data.data.html);

                            hr_create.init();
                            hr_create.autocomplete();
                            hr_create.submit();
                        }
                    },
                    function (data) {
                        console.log('error response', data);
                    });
            });

            var hr_create = {
                init: function () {
                    //
                },
                autocomplete: function () {
                    //
                },
                submit: function () {
                    var self = this;
                    var button = document.querySelector('button[type=submit]');
                    var form = button.closest('form');
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
                    var form_data = new FormData(form);

                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    var error_container = document.getElementById('error_container');
                                    error_container.innerHTML = '';
                                    var response = JSON.parse(this.response);

                                    var html = '';
                                    if (response.result === 'error') {
                                        if (error_container) {
                                            if (Array.isArray(response.message)) {
                                                response.message.forEach(function (message) {
                                                    if (typeof message === 'object') {
                                                        for (var key in message) {
                                                            html += '<div>' + key + ' : ' + message[key] + '</div>';
                                                        }
                                                    } else if (typeof message === 'string') {
                                                        html += '<div>' + message + '</div>';
                                                    }
                                                });
                                            } else if (typeof response.message === 'object') {
                                                for (var key in response.message) {
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
                                        $state.go('vacancy-list', {
                                            url: '/vacancy/list'
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

            if ($state.current.controller === "vacancyCreateController") {
                angular.element(document).ready(function () {

                });
            }

        }
    ]
);