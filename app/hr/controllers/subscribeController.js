angular.module('Subscribe', [], function () {
    console.log('module Subscribe init');
}).controller('subscribeController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-search-background.html';
            $scope.subscribe = 'hr/templates/partial/subscribe.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.hide_subscribe_link = true;

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user();
            $scope.user_avatar = hr_user_avatar();


            if ($state.current.controller === "subscribeController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {

                            $("#mail_subscription").validate({
                                rules: {
                                    field: {
                                        required: true,
                                        email: true
                                    }
                                }
                            });

                            $("#mail_subscription_mobile").validate({
                                rules: {
                                    field: {
                                        required: true,
                                        email: true
                                    }
                                }
                            });

                            var mail_form_mobile = document.getElementById('mail_subscription_mobile');

                            if (mail_form_mobile) {
                                mail_form_mobile.addEventListener('submit', function (ev) {
                                    var url = rest_api_host + hr_mail_subscription_url;
                                    var xhr = new XMLHttpRequest();
                                    var form_data = new FormData(mail_form_mobile);
                                    xhr.onload = function () {
                                        // console.log('r', this.response);
                                        if (this.readyState === 4) {
                                            if (this.status === 200) {
                                                mail_form_mobile.style.display = 'none';
                                                $('#mail_subscription_title').hide();
                                                $('#mail_subscription_success').show();
                                                setTimeout(function () {
                                                    $state.go('home', {
                                                        url: '/'
                                                    })
                                                }, 3000);
                                                // setTimeout(function () {
                                                //     mail_form_mobile.style.display = 'block';
                                                // }, 10000);
                                            } else {
                                                console.log('error response', this.response);
                                            }
                                        }
                                    };
                                    xhr.open('POST', url, true);
                                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                                    xhr.send(form_data);
                                });
                            }

                            var mail_form = document.getElementById('mail_subscription');

                            if (mail_form) {
                                mail_form.addEventListener('submit', function (ev) {
                                    var url = rest_api_host + hr_mail_subscription_url;
                                    var xhr = new XMLHttpRequest();
                                    var form_data = new FormData(mail_form);
                                    xhr.onload = function () {
                                        console.log('r', this.response);
                                        if (this.readyState === 4) {
                                            if (this.status === 200) {
                                                $('#mail_subscription_wrapper').hide();
                                                $('#mail_subscription_title').hide();
                                                $('#mail_subscription_success').show();
                                                mail_form.style.display = 'none';
                                                setTimeout(function () {
                                                    $state.go('home', {
                                                        url: '/'
                                                    })
                                                }, 3000);
                                                // setTimeout(function () {
                                                //     mail_form.style.display = 'block';
                                                //     $('#mail_subscription_wrapper').show();
                                                //     $('#mail_subscription_title').show();
                                                // }, 10000);
                                            } else {
                                                console.log('error response', this.response);
                                            }
                                        }
                                    };
                                    xhr.open('POST', url, true);
                                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                                    xhr.send(form_data);
                                });
                            }
                        }
                    });
                    $templateCache.remove('hr/templates/partial/pagination.html');
                });
                angular.element(document).ready(function () {

                });
            }
        }
    ]
);