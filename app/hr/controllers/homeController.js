angular.module('Home', [], function () {
    // console.log('module Home init');
}).controller(
    'homeController',
    [
        "$scope",
        '$http',
        function ($scope, $http) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.home_content = 'hr/templates/partial/home-content.html';
            $scope.home_content_mobile = 'hr/templates/partial/home-content-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.active_menu = 'home';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();
            $scope.route_home = true;

            $scope.totalVacancies = 0;
            $scope.totalResumes = 0;
            $scope.totalArticles = 0;




            $scope.$on('$viewContentLoaded', function () {
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    // console.log('tpl', templateName);
                    var url = rest_api_host + 'home';
                    $http.get(url).then(function (data) {
                        // console.log('data home', data);
                        if (typeof data.data.vacancies != "undefined")
                            $scope.totalVacancies = data.data.vacancies;
                        if (typeof data.data.resumes != "undefined")
                            $scope.totalResumes = data.data.resumes;
                        if (typeof data.data.articles != "undefined")
                            $scope.totalArticles = data.data.articles;
                        $scope.hasVacancies = $scope.totalVacancies > 0;
                        $scope.hasResumes = $scope.totalResumes > 0;
                        $scope.hasArticles = $scope.totalArticles > 0;
                    });
                    if (templateName.toString() === 'hr/templates/partial/home-content.html') {
                        // $("#main_search_form").validate({
                        //     rules: {
                        //         articles: {
                        //             required: true,
                        //             // email: true
                        //         }
                        //     },
                        //     messages: {
                        //         articles: "Please enter article keyword",
                        //         // lastname: "Please enter your lastname",
                        //         // password: {
                        //         //     required: "Please provide a password",
                        //         //     minlength: "Your password must be at least 5 characters long"
                        //         // },
                        //         // email: "Please enter a valid email address"
                        //     },
                        //     submitHandler: function(form) {
                        //         form.submit();
                        //     }
                        // });
                    }
                    if (templateName.toString() === 'hr/templates/partial/home-content-mobile.html') {
                        $("#mobile_main_search").validate({
                            rules: {
                                field: {
                                    required: true,
                                    // email: true
                                }
                            }
                        });
                    }
                });
            });
        }
    ]
);