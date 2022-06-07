angular.module('ResumeEdit', [], function () {
    // console.log('module ResumeEdit init');
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

            let token = 'Bearer ' + $cookies.get('rest_user_token');

            let user_id = hr_authorized_id();

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            // let resume_id = window.location.pathname.split("/").pop();

            let resume_id = $stateParams.id;

            let url = rest_api_host + '/resume/update/' + resume_id + '?random='  + get_random_number();

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
                        $('#content_container').html(data.data.html);

                        let form = document.getElementById('resume_form');
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

            let hr_edit = {
                appendCheckbox: function (form, form_data) {
                },
                hr_user_edit: function (form) {
                    hr_sanitize_checkbox(form);
                    let form_data = new FormData(form);
                    this.appendCheckbox(form, form_data);


                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    // console.info('response', this.response);
                                    let response = JSON.parse(this.response);
                                    let error_container = document.getElementById('error_container');
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
                                                    let errors = JSON.parse(response);
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