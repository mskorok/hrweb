angular.module('ProfileEdit', [], function () {
    // console.log('module ProfileEdit init');
}).controller(
    'profileEditController',
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
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            let token = 'Bearer ' + $cookies.get('rest_user_token');

            let user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();


            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            let url = rest_api_host + 'users/' + user_id  + '?random='  + get_random_number();
            $http.get(url
                ,
                {
                    headers: {'Authorization': token}
                }
            ).then(function (data) {
                    $scope.user = data.data.user;
                    let role = $scope.user.role;
                    $scope.user.role = $scope.user.role.capitalize();

                    $scope.company = role === 'admin' || role === 'superadmin' || role === 'partner' || role === 'manager';
                    $scope.admin = role === 'admin' || role === 'superadmin';
                    $scope.companyAdmin = role === 'admin' || role === 'superadmin' || $scope.user.Companies.length > 0;
                    $scope.superadmin = role === 'superadmin';
                },
                function (data) {
                    console.log('error response', data);
                });


            $scope.$on('$viewContentLoaded', function () {
                let url = rest_api_host + '/profile/update/' + user_id  + '?random='  + get_random_number();
                $http.get(url
                    ,
                    {
                      headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        $('#content_container').html(data.data.html);

                        $('#add_new_photo').removeClass('hidden');
                        $('#avatar_model_Users_counter_').closest('div').parent().addClass('hidden');
                        $('#avatar_model_Users_counter_').remove();

                        $('input[name=username]').attr('disabled', 'disabled');
                        let role_select = document.querySelector('select[name=role]');
                        if (role_select) {
                            let role_id_input = document.getElementById('role_id');
                            role_select.removeAttribute('disabled');
                            if (role_id_input) {
                                let role_id = role_id_input.value;
                                let options = [];
                                if (role_select) {
                                    options = role_select.querySelectorAll('option');
                                }

                                if (role_id.length < 1 || role_id === 'null' || role_id === null) {
                                    [].forEach.call(options, function (option) {
                                        if (parseInt(option.value) === 9) {
                                            option.setAttribute('selected', 'selected');
                                        }
                                    });
                                }
                                [].forEach.call(options, function (option) {
                                    if (parseInt(option.value) === parseInt(role_id)) {
                                        option.setAttribute('selected', 'selected');
                                    }
                                });
                                // role_select.setAttribute('disabled', 'disabled');
                            }
                        }
                        let form = document.getElementById('user_form');
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
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    if (templateName.toString() === 'hr/templates/partial/croppie-modal.html') {
                        $('.btn-add-new-photo').off();
                        $('.btn-add-new-photo').on('click', function() {
                            $('.modal-add-photo').modal('show');
                        });

                        $('.avatar-grid .row .col-sm-3 img').off();
                        $('.avatar-grid .row .col-sm-3 img').on('click', function () {
                            $('.avatar-grid .row .col-sm-3 img.active').removeClass('active');
                            $(this).addClass('active');
                        });
                        $('.first-image').click();
                    }
                });
            });

            const hr_edit = {
                appendCheckbox: function (form, form_data) {
                },
                hr_user_edit: function (form) {
                    hr_sanitize_checkbox(form);
                    let form_data = new FormData(form);
                    this.appendCheckbox(form, form_data);

                    let file_input = document.getElementById('base64');
                    if (file_input && file_input.value) {
                        let file = dataURLtoFile(file_input.value, 'avatar.png');

                        if (file) {
                            form_data.append('fileName', file);
                        }
                    }


                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    let response = JSON.parse(this.response);
                                    let error_container = document.getElementById('jd_error_container');
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
                                                    console.log('error', e.message);
                                                    html = response.error.message;
                                                }
                                            }
                                            error_container.textContent = html;
                                            window.location.hash = 'top';
                                        }
                                        console.log('error', error_container, response.error.message);
                                    } else {
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