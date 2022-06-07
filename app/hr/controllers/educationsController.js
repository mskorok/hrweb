angular.module('Educations', [], function () {
    // console.log('module Educations init');
}).controller(
    'educationsController',
    [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function ($scope, $state, $cookies, $http, $templateCache, $location) {

            let page = $location.search().page;
            $scope.show_select = true;

            if (!page) {
                page = 1;
            }

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

            $scope.institutions = [];

            $scope.$on('$includeContentLoaded', function (event, templateName) {

                if (templateName.toString() === 'hr/templates/partial/footer.html') {
                    const url = rest_api_host + 'institutions/list' + '?include=Countries,EducationLevel&page=' + page + '?random='  + get_random_number();
                    $http.get(url).then(function (data) {
                        if (data.data.data.institutions) {
                            $scope.institutions = data.data.data.institutions
                        }
                    });
                }

                if (templateName.toString() === 'hr/templates/partial/header-search-keywords.html') {
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


                    const form = document.getElementById('full_text_search_form');

                    form.addEventListener('submit', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        const keywordInput = form.querySelector('#search_keywords');
                        const keyword = keywordInput? keywordInput.value : null;
                        const countryInput = form.querySelector('#banner');
                        const country = countryInput? countryInput.value : null;

                        let qs = '&page=' + page;

                        if (country) {
                            qs += '&country=' + country;
                        }

                        if (keyword) {
                            qs += '&q=' + keyword;
                        }

                        qs += '&random='  + get_random_number();

                        const url = rest_api_host + 'institutions/list' + '?include=Countries,EducationLevel' + qs;
                        $http.get(url).then(function (data) {
                            if (data.data.data.institutions) {
                                $scope.institutions = data.data.data.institutions
                            }
                        });
                    })
                }
            });
        }
    ]
);