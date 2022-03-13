angular.module('Login', [], function () {
    console.log('module Login init');
}).controller(
    'loginController',
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

            var user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            if (user_id) {
                    $state.go('home', {
                        url: '/'
                    })
            }

            $scope.$on('$viewContentLoaded', function () {
                var url = rest_api_host + hr_login_get_url;
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            try {
                                var response = JSON.parse(this.response);
                                // console.log(response.html);
                                $('#login_container').html(response.html);
                                $('#ajax_loader').hide();
                                var form = document.getElementById('login_form');
                                if (form) {
                                    form.addEventListener('submit', function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        hr_ajax_login.login(form);
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

            var hr_ajax_login = {
                login: function (form) {
                    var name, password, remember;
                    if (typeof form.username.value != 'undefined') {
                        name = form.username.value;
                    } else {
                        alert('Username not defined');
                        return false;
                    }
                    if (typeof form.password.value != 'undefined') {
                        password = form.password.value;
                    } else {
                        alert('password not defined');
                        return false;
                    }
                    if (typeof form.remember.checked !== 'undefined' && form.remember.checked) {
                        remember = form.remember.checked
                    } else {
                        remember = null;
                    }
                    admin_auth.login(name, password, remember);
                }
            };

        }
    ]
);

console.log('start', new Date().getTime());