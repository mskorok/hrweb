angular.module('Login Recovery', [], function () {
    // console.log('module Login Recovery init');
}).controller('loginRecoveryController',
    [
        "$scope",
        "$state",
        "$cookies",
        "$http",
        function (
            $scope, $state, $cookies, $http
        ) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();


            $scope.$on('$viewContentLoaded', function () {
                const url = rest_api_host + hr_login_recovery_get_url  + '?random='  + get_random_number();

                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            try {
                                const response = JSON.parse(this.response);
                                $('#login_recovery_container').html(response.html);
                                $('#ajax_loader').hide();
                                const form = document.getElementById('login_recovery_form');
                                if (form) {
                                    form.addEventListener('submit', function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        hr_ajax_login_recovery.login_recovery(form);
                                        return false;
                                    })
                                }
                            } catch (e) {
                                console.log('error', e);
                            }
                        } else {
                            console.log('error login  response', this.response);
                        }
                    }
                };
                xhr.open('GET', url, true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send();
            });

            const hr_ajax_login_recovery = {
                login_recovery: function (form) {
                    const form_data = new FormData(form);
                    const url = rest_api_host + hr_login_recovery_post_url;
                    // console.log('u', url);
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                try {
                                    // console.log('resp', this.response);
                                    const response = JSON.parse(this.response);
                                    const message = response.result;
                                    $('#login_recovery_container').html('<div class="recovery-response">' + message + '</div>');
                                } catch (e) {
                                    console.log('error', e);
                                }
                            } else {
                                console.log('error login recovery response', this.response);
                            }
                        }
                    };
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.send(form_data);
                }
            };

        }
    ]
);