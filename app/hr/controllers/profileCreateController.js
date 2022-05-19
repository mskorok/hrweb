angular.module('ProfileCreate', [], function () {
    // console.log('module ProfileCreate init');
}).controller(
    'profileCreateController',
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
            $scope.croppie = 'hr/templates/partial/croppie-modal.html';

            var redirectUrl = '/login';

            var user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            $scope.error = '';

            if (user_id) {
                $state.go('home', {
                    url: '/'
                })
            }

            var url = rest_api_host + 'profile/create/';

            $scope.$on('$viewContentLoaded', function () {
                // console.log('url', url);
                $http.get(url).then(function (data) {
                        // console.log('loaded', new Date().getTime());
                        // console.log('form', data.data.html);

                        $('#content_container').html(data.data.html);

                        $('#add_new_photo').removeClass('hidden');
                        $('#avatar_model_Users_counter_').closest('div').parent().addClass('hidden');
                        $('#avatar_model_Users_counter_').remove();


                        hr_create.init();
                        hr_create.autocomplete();
                        hr_create.submit();
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
                    var file_input = document.getElementById('base64');
                    if (file_input && file_input.value) {
                        var file = dataURLtoFile(file_input.value, 'avatar.png');

                        if (file) {
                            form_data.append('fileName', file);
                        }
                    }


                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                // console.log(this.response);
                                try {
                                    var error_container = document.getElementById('error_container');
                                    error_container.innerHTML = '';
                                    var response = JSON.parse(this.response);
                                    // console.log('resp', response);
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
                                        window.location.href = redirectUrl;
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
                    xhr.send(form_data);
                }

            };

            if ($state.current.controller === "profileCreateController") {
                angular.element(document).ready(function () {

                });
            }

        }
    ]
);