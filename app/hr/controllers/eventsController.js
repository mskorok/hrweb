angular.module('Events', [], function () {
    console.log('module Events init');
}).controller(
    'eventsController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {
            $scope.hr_rest_limit = 100;
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.header_search = 'hr/templates/partial/header-search-keywords.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';


            var page = $location.search().page;

            $scope.active_menu = 'home';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            $scope.subcategories = [];

            $scope.data = '';




            $scope.$on('$viewContentLoaded', function () {
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    // console.log('tpl', templateName);
                    if (templateName.toString() === 'hr/templates/partial/footer.html') {
                        var url = rest_api_host + 'categories/sub/events' + '?page=' + page;
                        $http.get(url).then(function (data) {
                            console.log('data events', data);
                            $scope.subcategories = data.data.data.subcategory;
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
                        });

                        var select = jQuery("#banner");
                        var options = [];
                        if (select[0]) {
                            options = select[0].querySelectorAll('option');
                        }


                        $scope.show_select = true;
                        select.chosen({width: "100px",});
                        select.chosen().change(function () {
                            $scope.lang = parseInt($(this).val());
                            console.warn(2, $scope.lang);
                            [].forEach.call(options, function (option) {
                                option.removeAttribute('selected');
                            });
                            [].forEach.call(options, function (option) {
                                var val = parseInt(option.getAttribute('value'));
                                if (val === $scope.lang) {
                                    option.setAttribute('selected', 'selected');
                                }
                            });
                        });
                    }
                });
            });
        }
    ]
);