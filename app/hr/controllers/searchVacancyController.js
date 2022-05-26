angular.module('SearchVacancy', [], function () {
    // console.log('module SearchVacancy init');
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

            let where = $location.search().where;
            let what = $location.search().what;

            let salary = $location.search().salary;
            let type = $location.search().type;
            let currency = $location.search().currencies;
            let order = $location.search().order;
            let page = $location.search().page;

            where = where ? where : '';
            what = what ? what : '';

            where = decodeURIComponent(where);
            what = decodeURIComponent(what);

            $scope.curencies = currency;
            $scope.where = where;
            $scope.what = what;
            $scope.salary = salary;
            $scope.type = type;
            $scope.order = order;

            $templateCache.remove('hr/templates/partial/header-search-resume.html');

            if (typeof page == 'undefined') {
                page = 1;
            }

            $scope.qs1 = '';

            $scope.goLink = (p) => {
                if ('' + page === '' + p) {
                    return false;
                }
                let url = $scope.pageUrl;
                if ($scope.qs1.length > 0) {
                    url +=  '&page=' + p;
                } else {
                    url +=  '?page=' + p;
                }
                window.location = url;
            };

            if ($state.current.controller === "searchVacancyController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.info('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/header-search-resume.html') {
                            $('#filter_button').on('click', function () {
                                $('#mobile_filter').toggle();
                            });
                            $("#full_text_search_form").validate({
                                rules: {
                                    what: {
                                        require_from_group: [1, ".desktop-group"],
                                    },
                                    where: {
                                        require_from_group: [1, ".desktop-group"],
                                    },
                                    salary: {
                                        require_from_group: [1, ".desktop-group"],
                                    }
                                },
                                messages: {
                                    what: "Please enter keywords",
                                    where: "Please enter location",
                                    salary: "Please enter salary",
                                },
                                submitHandler: (form) => {
                                    form.submit();
                                }
                            });
                            $("#mobile_full_text_search_form").validate({
                                rules: {
                                    what: {
                                        require_from_group: [1, ".mobile-group"],
                                    },
                                    where: {
                                        require_from_group: [1, ".mobile-group"],
                                    },
                                    salary: {
                                        require_from_group: [1, ".mobile-group"],
                                    }
                                },
                                messages: {
                                    what: "Please enter keywords",
                                    where: "Please enter location",
                                    salary: "Please enter salary",
                                },
                                submitHandler: (form) => {
                                    form.submit();
                                }
                            });
                        }
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {

                            let qs = '';
                            if (what || where || page || salary || type || currency || order) {
                                qs = '?';

                                if (what && what.length > 1) {
                                    qs += 'what=' + encodeURIComponent(what) + '&'
                                }

                                if (where && where.length > 1) {
                                    qs += 'where=' + where + '&'
                                }

                                if (page) {
                                    qs += 'page=' + page + '&'
                                }

                                if (salary) {
                                    qs += 'salary=' + salary + '&'
                                }

                                if (currency) {
                                    qs += 'currency=' + currency + '&'
                                }

                                if (type) {
                                    qs += 'type=' + type + '&'
                                }

                                if (order) {
                                    qs += 'order=' + order + '&'
                                }

                                qs = qs.slice(0, -1);

                                let url = rest_api_host + 'vacancy/search' + qs;
                                $http.get(url).then(function (data) {
                                        // console.info('data', data);
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
                                        let qs1 = '';
                                        if (what || where || salary || type || currency || order) {
                                            qs1 = '?';

                                            if (what && what.length > 1) {
                                                qs1 += 'what=' + what + '&'
                                            }

                                            if (where && where.length > 1) {
                                                qs1 += 'where=' + where + '&'
                                            }

                                            if (salary) {
                                                qs1 += 'salary=' + salary + '&'
                                            }

                                            if (currency) {
                                                qs1 += 'currency=' + currency + '&'
                                            }

                                            if (type) {
                                                qs1 += 'type=' + type + '&'
                                            }

                                            if (order) {
                                                qs1 += 'order=' + order + '&'
                                            }

                                            qs1 = qs1.slice(0, -1);
                                        }

                                        $scope.pageUrl +=  qs1;
                                        $scope.qs1 = qs1;

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