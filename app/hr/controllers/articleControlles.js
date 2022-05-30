angular.module('Article', [], function () {
    // console.log('module Article init');
}).controller('articleController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        '$stateParams',
        function (
            $scope, $state, $cookies, $http, $templateCache, $location, $stateParams
        ) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.lang = 1;
            $scope.show_select = false;

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            // var article_id = window.location.pathname.split("/").pop();

            var article_id = $stateParams.id;

            if ($state.current.controller === "articleController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            var url = rest_api_host + 'articles/' + article_id;

                            // console.log('url', url);
                            $http.get(url).then(function (data) {
                                    // console.log('data article', data.data.article);
                                    $scope.article = data.data.article;
                                    $scope.lang = $scope.article.language_id;


                                    var select = jQuery("#banner");
                                    var options = [];
                                    if (select[0]) {
                                        options = select[0].querySelectorAll('option');
                                    }
                                    [].forEach.call(options, function (option) {
                                        option.removeAttribute('selected');
                                    });
                                    [].forEach.call(options, function (option) {
                                        var val = parseInt(option.getAttribute('value'));
                                        if (val === $scope.lang) {
                                            option.setAttribute('selected', 'selected');
                                        }
                                    });

                                    $scope.show_select = true;
                                    select.chosen({width: "100px",});
                                    select.chosen().change(function () {
                                        $scope.lang = parseInt($(this).val());
                                        var url_translated = rest_api_host + 'article-translated/' + $scope.article.id + '/' + $scope.lang;
                                        $http.get(url_translated).then(function (data) {
                                            $scope.article.title = data.data.title;
                                            $scope.article.text = data.data.text;
                                        });
                                    });
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        }
                    });
                });
                angular.element(document).ready(function () {

                });
            }
        }
    ]
);