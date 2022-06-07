angular.module('VacancyEdit', [], function () {
    // console.log('module VacancyEdit init');
}).controller(
    'vacancyEditController',
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

            const token = 'Bearer ' + $cookies.get('rest_user_token');

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            if (!hr_authorized()) {
                $state.go('login', {
                    url: '/login'
                })
            }

            // var vacancy_id = window.location.pathname.split("/").pop();

            const vacancy_id = $stateParams.id;


            $scope.$on('$viewContentLoaded', function () {

                const url = rest_api_host + '/vacancy/update/' + vacancy_id  + '?random='  + get_random_number();

                $http.get(url
                    ,
                    {
                      headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        console.log('loaded', new Date().getTime());
                        // console.log('form', data.data.html);

                        $('#content_container').html(data.data.html);
                        $('input[name=username]').attr('disabled', 'disabled');
                        const form = document.getElementById('vacancy_form');
                        if (form) {
                            form.addEventListener('submit', function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                hr_edit.hr_vacancy_edit(form);
                                return false;
                            })
                        }
                    },
                    function (data) {
                        console.log('error response', data);
                    });
            });

            const hr_edit = {
                appendCheckbox: function (form, form_data) {
                },
                hr_vacancy_edit: function (form) {
                    hr_sanitize_checkbox(form);
                    const form_data = new FormData(form);
                    this.appendCheckbox(form, form_data);

                    const url = rest_api_host + '/vacancy/update/' + vacancy_id  + '?random='  + get_random_number();


                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    const response = JSON.parse(this.response);
                                    const error_container = document.getElementById('error_container');
                                    let html;
                                    if (response.result === 'error') {
                                        if (error_container) {
                                            html = '';
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
                                    } else if (response.error) {
                                        if (error_container) {
                                            html = '';
                                            if (Array.isArray(response.error.message)) {
                                                response.error.message.forEach(function (message) {
                                                    if (typeof message === 'object') {
                                                        for (let key in message) {
                                                            html += '<div>' + key + ' : ' + message[key] + '</div>';
                                                        }
                                                    } else if (typeof message === 'string') {
                                                        html += '<div>' + message + '</div>';
                                                    }
                                                })
                                            } else if (typeof response.error.message === 'string') {
                                                try {
                                                    const errors = JSON.parse(response);
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
        }
    ]
);