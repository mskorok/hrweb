angular.module('Articles', [], function () {
    // console.log('module Articles init');
}).controller('articlesController', [
        "$scope",
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

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            var page = $location.search().page;
            var category = $location.search().category;
            var tag = $location.search().tag;

            if (typeof page == 'undefined') {
                page = 1;
            }

            if ($state.current.controller === "articlesController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            var qs = '';
                            if (category || tag || page) {
                                qs = '?';

                                if (typeof category != "undefined") {
                                    qs += 'category=' + category + '&'
                                }

                                if (typeof tag != "undefined") {
                                    qs += 'tag=' + tag + '&'
                                }

                                if (typeof page != "undefined") {
                                    qs += 'page=' + page + '&'
                                }

                                qs = qs.slice(0, -1);

                            }

                            // var debug = qs === '' ? '?XDEBUG_SESSION_START=16583' : '&XDEBUG_SESSION_START=16583';
                            var url = rest_api_host + 'articles-list' + qs;
                            // console.log('url', url);
                            $http.get(url).then(function (data) {
                                    // console.log(data);

                                    $scope.articles = data.data.data.articles;
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
                angular.element(document).ready(function () {

                });
            }
        }
    ]
);