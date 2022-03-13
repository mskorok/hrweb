angular.module('Confirm User', [], function () {
    console.log('module New Password init');
}).controller('confirmUserController', ["$scope", "$state", "$cookies", '$location', function ($scope, $state, $cookies, $location) {
    $scope.hr_rest_limit = 100;
    $scope.header_content = 'hr/templates/partial/header-content.html';
    $scope.header_background = 'hr/templates/partial/header-background.html';
    $scope.top_menu = 'hr/templates/partial/top-menu.html';
    $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
    $scope.footer = 'hr/templates/partial/footer.html';

    $scope.user_id = hr_authorized_id();

    $scope.user_name = hr_user();

    $scope.user_avatar = hr_user_avatar();

    var email = $location.search().email;

    var confirm_token = $location.search().confirm_token;


    var confirmUrl = '/users/confirm/email';

    $scope.$on('$viewContentLoaded', function () {
        rest_confirm.init();
    });

    var rest_confirm = {
        init: function () {
            var url = rest_api_host + confirmUrl + '?email=' + email + '&confirm_token=' + confirm_token;

            // console.log('url', url);

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        try {
                            $('#ajax_loader').hide();
                            $('#confirm_container').html('<div class="recovery-response"><span class="olive-color email-confirmed">' + 'Email Confirmed!' + '</span></div>');

                            setTimeout(function () {
                                $state.go('login', {
                                    url: '/login'
                                })
                            }, 3000)
                        } catch (e) {
                            console.log('error', e);
                        }
                    } else {
                        console.log('error login  response', this.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send();
        }
    };

    if ($state.current.controller === "confirmUserController") {
        angular.element(document).ready(function () {
        });
    }
}]);