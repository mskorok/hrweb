angular.module('ResumeList', [], function () {
    // console.log('module ResumeList init');
}).controller('resumeListController', [
        "$scope",
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
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.pagination = 'hr/templates/partial/pagination.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            const path = window.location.pathname;
            $scope.dashboard = path.includes('dashboard');


            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            let page = $location.search().page;

            if ($scope.dashboard && !$scope.user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                })
            }


            if (typeof page == 'undefined') {
                page = 1;
            }

            $scope.goLink = function (page) {
                window.location = $scope.pageUrl + '?page=' + page;
            };

            if ($state.current.controller === "resumeListController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            const url = rest_api_host + 'resume/list/' + page + '?random='  + get_random_number();
                            $http.get(url).then((data) => {
                                    $scope.resumes = data.data.data.resumes;
                                    $scope.totalItems = data.data.data.totalItems;
                                    $scope.totalPages = data.data.data.totalPages;
                                    $scope.limit = data.data.data.limit;
                                    $scope.current = data.data.data.current;
                                    $scope.before = data.data.data.before;
                                    $scope.next = data.data.data.next;
                                    $scope.last = data.data.data.last;
                                    $scope.first = data.data.data.first;
                                    $scope.pagesRange = data.data.data.pagesRange;
                                    $scope.bottomInRange = data.data.data.bottomInRange;
                                    $scope.topInRange = data.data.data.topInRange;
                                    $scope.firstInRange = $scope.pagesRange.length > 0 ? $scope.pagesRange[0] : 0;
                                    $scope.lastInRange = $scope.pagesRange.length > 0 ? $scope.pagesRange.slice(-1)[0] : 0;
                                    $scope.pageUrl = window.location.origin + window.location.pathname;
                                    // console.log('scope', $scope)
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        }
                    });

                    $templateCache.remove('hr/templates/partial/pagination.html');
                });
            }
        }
    ]
);