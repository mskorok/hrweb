angular.module('SearchArticle', [], function () {
    // console.log('module SearchArticle init');
}).controller('searchArticleController', [
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
            $scope.header_search_page = 'hr/templates/partial/header-search-article.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.pagination = 'hr/templates/partial/pagination.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();
            $scope.categories = [];



            let q = $location.search().keywords;
            let page = $location.search().page;
            let category = $location.search().category;
            let tag = $location.search().tag;

            if (!q || q.length < 5) q = '';

            if (category === '0') {
                category = null;
            }

            if (!page) {
                page = 1;
            }

            $scope.keyword = q;
            $scope.selected = category;
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

            if ($state.current.controller === "searchArticleController") {
                $http.get(rest_api_host + 'categories/all').then((data) => {
                    $scope.categories = data.data.categories;
                    $scope.categories = [{id: '0', name: 'ALL'}].concat($scope.categories);
                });
                $scope.$on('$viewContentLoaded', () => {
                    $("#articles_full_text_search_form").validate({
                        rules: {
                            keywords: {
                                require_from_group: [1, ".desktop-group"],
                            },
                            category: {
                                require_from_group: [1, ".desktop-group"],
                            },
                        },
                        messages: {
                            keywords: "Please enter article keyword",
                        },
                        submitHandler: (form) => {
                            form.submit();
                        }
                    });

                    $("#mobile_articles_full_text_search_form").validate({
                        rules: {
                            keywords: {
                                required: true,
                            },
                            category: {
                                required: true,
                            },
                        },
                        messages: {
                            keywords: "Please enter article keyword",
                        },
                        submitHandler: (form) => {
                            form.submit();
                        }
                    });



                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.info('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            $('#filter_button').on('click', () => {
                                $('#mobile_articles_filter').toggle();
                            });

                            let qs = '';
                            if (q || tag || page || category) {
                                qs = '?';

                                if (q) {
                                    qs += 'q=' + q + '&'
                                }

                                if (page) {
                                    qs += 'page=' + page + '&'
                                }

                                if (tag) {
                                    qs += 'tag=' + tag + '&'
                                }

                                if (category) {
                                    qs += 'category=' + category + '&'
                                }

                                qs = qs.slice(0, -1);
                            }


                            let url = rest_api_host + 'search/articles' + qs;
                            $http.get(url).then((data) => {
                                    // console.info(data.data);
                                    if (data.data.result && data.data.result === 'error') {
                                        console.log('error', data.data.message);
                                        return false;
                                    }
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

                                    let qs1 = '';
                                    if (q || tag || page || category) {
                                        qs1 = '?';

                                        if (q) {
                                            qs1 += 'q=' + q + '&'
                                        }


                                        if (tag) {
                                            qs1 += 'tag=' + tag + '&'
                                        }

                                        if (category) {
                                            qs1 += 'category=' + category + '&'
                                        }

                                        qs1 = qs1.slice(0, -1);
                                    }

                                    $scope.pageUrl +=  qs1;
                                    $scope.qs1 = qs1;
                                },
                                (data) => {
                                    console.log('error response', data);
                                });
                        }
                    });

                    $templateCache.remove('hr/templates/partial/pagination.html');
                });
                angular.element(document).ready(() => {

                });
            }
        }
    ]
);