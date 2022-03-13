angular.module('SearchVacancy', [], function () {
    console.log('module SearchVacancy init');
}).controller('searchVacancyController', [
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
            $scope.header_search_page = 'hr/templates/partial/header-search-resume.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.pagination = 'hr/templates/partial/pagination.html';
            $scope.footer = 'hr/templates/partial/footer.html';


            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            var where = $location.search().where;
            var what = $location.search().what;
            var salary = $location.search().salary;
            var type = $location.search().type;
            var order = $location.search().order;
            var page = $location.search().page;

            if (typeof page == 'undefined') {
                page = 1;
            }

            if ($state.current.controller === "searchVacancyController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            $('#filter_button').on('click', function () {
                                $('#mobile_filter').toggle();
                            });
                            $("#full_text_search_form").validate({
                                rules: {
                                    field: {
                                        required: true,
                                        email: true
                                    }
                                }
                            });
                            $("#mobile_full_text_search_form").validate({
                                rules: {
                                    field: {
                                        required: true,
                                        email: true
                                    }
                                }
                            });
                            var qs = '';
                            if (what || where || page || salary || type || order) {
                                qs = '?';

                                if (typeof what != "undefined") {
                                    qs += 'what=' + what + '&'
                                }

                                if (typeof where != "undefined") {
                                    qs += 'where=' + where + '&'
                                }

                                if (typeof page != "undefined") {
                                    qs += 'page=' + page + '&'
                                }

                                if (typeof salary != "undefined") {
                                    qs += 'salary=' + salary + '&'
                                }

                                if (typeof type != "undefined") {
                                    qs += 'type=' + type + '&'
                                }

                                if (typeof order != "undefined") {
                                    qs += 'order=' + order + '&'
                                }

                                qs = qs.slice(0, -1);

                                var url = rest_api_host + 'vacancy/search' + qs;
                                // console.log('url', url);
                                $http.get(url).then(function (data) {
                                        console.log(data.data);
                                        if (data.data.result && data.data.result === 'error') {
                                            console.log('error', data.data.message);
                                            return false;
                                        }
                                        $scope.vacancies = data.data.data.vacancies;
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