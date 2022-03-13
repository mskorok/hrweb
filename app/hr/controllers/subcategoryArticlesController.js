angular.module('SubcategoryArticles', [], function () {
    console.log('module SubcategoryArticles init');
}).controller(
    'subcategoryArticlesController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        '$stateParams',
        function ($scope, $state, $cookies, $http, $templateCache, $location, $stateParams) {
            $scope.hr_rest_limit = 100;
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';


            var page = $location.search().page;
            // var id = window.location.pathname.split("/").pop();

            var id = $stateParams.id;

            console.log(9, id, isNaN(id));

            if (isNaN(id)) {
                history.back();
            }

            $scope.active_menu = 'home';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            $scope.subcategories = [];

            $scope.data = '';

            if (typeof page == 'undefined') {
                page = 1;
            }


            $scope.$on('$viewContentLoaded', function () {
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    // console.log('tpl', templateName);
                    if (templateName.toString() === 'hr/templates/partial/footer.html') {
                        var url = rest_api_host + 'subcategory/articles/' + id + '?page=' + page;
                        $http.get(url).then(function (data) {
                            console.log(8, url, data);

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
                            $scope.subName = data.data.data.subName;
                            $scope.firstInRange = $scope.pagesRange.length > 0 ? $scope.pagesRange[0] : 0;
                            $scope.lastInRange = $scope.pagesRange.length > 0 ? $scope.pagesRange.slice(-1)[0] : 0;
                            $scope.pageUrl = window.location.origin + window.location.pathname;
                            // console.log('scope', $scope)
                        });
                    }
                });
            });
        }
    ]
);