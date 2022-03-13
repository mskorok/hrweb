angular.module('ResumeEdit', [], function () {
    console.log('module ResumeEdit init');
}).controller(
    'resumeEditController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        '$stateParams',
        function ($scope, $state, $cookies, $http, $templateCache, $location, $stateParams) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            var token = 'Bearer ' + $cookies.get('rest_user_token');

            var user_id = hr_authorized_id();

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            // var resume_id = window.location.pathname.split("/").pop();

            var resume_id = $stateParams.id;

            var url = rest_api_host + '/resume/update/' + resume_id;

            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }


            $scope.$on('$viewContentLoaded', function () {
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        console.log('loaded', new Date().getTime());
                        // console.log('form', data.data.html);

                        $('#content_container').html(data.data.html);

                        var form = document.getElementById('resume_form');
                        if (form) {
                            form.addEventListener('submit', function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                hr_edit.hr_user_edit(form);
                                return false;
                            })
                        }
                    },
                    function (data) {
                        console.log('error response', data);
                    });
            });

            var hr_edit = {
                appendCheckbox: function (form, form_data) {
                },
                hr_user_edit: function (form) {
                    hr_sanitize_checkbox(form);
                    var form_data = new FormData(form);
                    this.appendCheckbox(form, form_data);


                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    // console.log('æ', this.response);
                                    var response = JSON.parse(this.response);
                                    var error_container = document.getElementById('error_container');
                                    var html;
                                    if (response.result === 'error') {
                                        if (error_container) {
                                            html = '';
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
                                    } else if (response.error) {
                                        if (error_container) {
                                            html = '';
                                            if (Array.isArray(response.error.message)) {
                                                response.error.message.forEach(function (message) {
                                                    if (typeof message === 'object') {
                                                        for (var key in message) {
                                                            html += '<div>' + key + ' : ' + message[key] + '</div>';
                                                        }
                                                    } else if (typeof message === 'string') {
                                                        html += '<div>' + message + '</div>';
                                                    }
                                                })
                                            } else if (typeof response.error.message === 'string') {
                                                try {
                                                    var errors = JSON.parse(response);
                                                    errors.forEach(function (message) {
                                                        html += '<div>' + message + '</div>';
                                                    })

                                                } catch (e) {
                                                    console.log(e.message);
                                                    html = response.error.message;
                                                }
                                            }
                                            error_container.textContent = html;
                                            window.location.hash = 'top';
                                        }
                                        console.log('error', error_container, response.error.message);
                                    } else {
                                        console.log('success', response);
                                        window.location.reload();
                                    }
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
                },

            };

            if ($state.current.controller === "resumeEditController") {
                angular.element(document).ready(function () {

                });
            }
        }
    ]
);