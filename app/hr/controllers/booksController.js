angular.module('Books', [], function () {
    // console.log('module Books init');
}).controller(
    'booksController',
    [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.header_search = 'hr/templates/partial/header-search-keywords.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.user_id = hr_authorized_id();
            $scope.user_name = hr_user_name();
            $scope.user_avatar = hr_user_avatar();

            let page = $location.search().page;

            if (!page) page = 1;

            $scope.active_menu = 'books';

            $scope.subcategories = [];

            $scope.data = '';

            $scope.host = rest_api_host;

            $scope.$on('$includeContentLoaded', function (event, templateName) {
                // console.log(templateName);
                if (templateName.toString() === 'hr/templates/partial/footer.html') {
                    const url = rest_api_host + 'categories/sub/books' + '?page=' + page+ '&random='  + get_random_number();
                    $http.get(url).then(function (data) {
                        // console.log('data events', data);
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

                    const select = jQuery("#banner");
                    let options = [];
                    if (select[0]) {
                        options = select[0].querySelectorAll('option');
                    }


                    $scope.show_select = true;
                    select.chosen({width: "100px",});
                    select.chosen().change(function () {
                        $scope.lang = parseInt($(this).val());
                        [].forEach.call(options, function (option) {
                            option.removeAttribute('selected');
                        });
                        [].forEach.call(options, function (option) {
                            const val = parseInt(option.getAttribute('value'));
                            if (val === $scope.lang) {
                                option.setAttribute('selected', 'selected');
                            }
                        });
                    });


                }

                if (templateName.toString() === 'hr/templates/partial/header-search-keywords.html') {
                    const form = document.getElementById('full_text_search_form');

                    form.addEventListener('submit', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        const keywordInput = form.querySelector('#search_keywords');
                        const keyword = keywordInput? keywordInput.value : null;
                        const countryInput = form.querySelector('#banner');
                        const country = countryInput? countryInput.value : null;

                        let qs = '?page=' + page;

                        if (country) {
                            qs += '&country=' + country;
                        }

                        if (keyword) {
                            qs += '&q=' + keyword;
                        }

                        qs += '&random='  + get_random_number();

                        const url = rest_api_host + 'categories/sub/books' + qs;
                        $http.get(url).then(function (data) {
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
                    });
                }
            });
        }
    ]
);