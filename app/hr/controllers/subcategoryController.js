angular.module('Tests', [], function () {
    // console.log('module Tests init');
}).controller(
    'testsController',
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
            $scope.user_name = hr_user();
            $scope.user_avatar = hr_user_avatar();

            let page = $location.search().page;
            let keyword =  $location.search().keywords;
            let country =  $location.search().countries

            if (!page) page = 1;

            $scope.active_menu = 'tests';

            $scope.subcategories = [];

            $scope.data = '';

            $scope.host = rest_api_host;

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

            $scope.$on('$includeContentLoaded', function (event, templateName) {
                // console.log(templateName);
                if (templateName.toString() === 'hr/templates/partial/footer.html') {
                    let url = rest_api_host + 'categories/sub/tests' + '?page=' + page;
                    $http.get(url).then((data) => {
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
                }

                if (templateName.toString() === 'hr/templates/partial/header-search-keywords.html') {
                    let select = jQuery("#banner");
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
                            let val = parseInt(option.getAttribute('value'));
                            if (val === $scope.lang) {
                                option.setAttribute('selected', 'selected');
                            }
                        });
                    });

                    let form = document.getElementById('full_text_search_form');

                    form.addEventListener('submit', (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        let keywordInput = form.querySelector('#search_keywords');
                        keyword = keywordInput? keywordInput.value : null;
                        let countryInput = form.querySelector('#banner');
                        country = countryInput? countryInput.value : null;

                        let qs = '?page=' + page;

                        if (country) {
                            qs += '&country=' + country;
                        }

                        if (keyword) {
                            qs += '&q=' + encodeURIComponent(keyword);
                        }

                        let url = rest_api_host + 'categories/sub/tests' + qs;
                        $http.get(url).then((data) => {
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
                            let qs1 = '';
                            if (keyword || country) {
                                qs1 = '?';


                                if (country) {
                                    qs1 += 'country=' + country + '&'
                                }

                                if (keyword) {
                                    qs1 += 'keyword=' + encodeURIComponent(keyword) + '&'
                                }

                                qs1 = qs1.slice(0, -1);
                            }

                            $scope.pageUrl +=  qs1;
                            $scope.qs1 = qs1;
                        });
                    })
                }
            });
        }
    ]
);