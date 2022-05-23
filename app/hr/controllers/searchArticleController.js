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

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();
            $scope.categories = [];


            var q = $location.search().keywords;
            var page = $location.search().page;
            var category = $location.search().category;
            console.warn(2, category);
            if (category === '0') {
                category = null;
            }
            var tag = $location.search().tag;

            if (!page) {
                page = 1;
            }

            if ($state.current.controller === "searchArticleController") {
                $http.get(rest_api_host + 'categories/all').then(function (data) {
                    $scope.categories = data.data.categories;
                    $scope.categories.push({id: '0', name: 'ALL'});
                    $scope.categories = [{id: '0', name: 'ALL'}].concat($scope.categories);
                });
                $scope.$on('$viewContentLoaded', function () {
                    $("#articles_full_text_search_form").validate({
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
                        submitHandler: function(form) {
                            form.submit();
                        }
                    });



                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        console.info('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            $('#filter_button').on('click', function () {
                                $('#mobile_articles_filter').toggle();
                            });
                            $("#mobile_articles_full_text_search_form").validate({
                                rules: {
                                    field: {
                                        required: true,
                                        email: true
                                    }
                                }
                            });
                            var qs = '';
                            if (q || tag || page || category || keyword) {
                                qs = '?';


                                if (!q || q.length < 3) {
                                    return false;
                                }

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


                            var url = rest_api_host + 'search/articles' + qs;
                            $http.get(url).then(function (data) {
                                    // console.log(data.data);
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