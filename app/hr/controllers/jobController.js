angular.module('Job', [], function () {
    console.log('module Job init');
}).controller(
    'jobController',
    [
        "$scope",
        '$http',
        function ($scope, $http) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.job_content = 'hr/templates/partial/job-content.html';
            $scope.job_content_mobile = 'hr/templates/partial/job-content-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            $scope.totalVacancies = 0;
            $scope.totalResumes = 0;
            $scope.totalCountries = 1;

            $scope.active_menu = 'job';

            $scope.user_id = hr_authorized_id();

            $scope.user_name = hr_user();

            $scope.user_avatar = hr_user_avatar();

            $scope.$on('$viewContentLoaded', function () {
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    console.log('tpl', templateName);
                    if (templateName.toString() === 'hr/templates/partial/footer.html') {
                        var url = rest_api_host + 'home';
                        $http.get(url).then(function (data) {
                            console.log('data job', data);
                            if (typeof data.data.vacancies != "undefined")
                                $scope.totalVacancies = data.data.vacancies;
                            if (typeof data.data.resumes != "undefined")
                                $scope.totalResumes = data.data.resumes;
                            if (typeof data.data.countries != "undefined")
                                $scope.totalCountries = data.data.countries;
                            $scope.hasVacancies = $scope.totalVacancies > 0;
                            $scope.hasResumes = $scope.totalResumes > 0;
                            $scope.hasCountries = $scope.totalCountries > 1;
                        });
                        $("#job_search_form").validate({
                            rules: {
                                field: {
                                    required: true,
                                    email: true
                                }
                            }
                        });
                        $("#mobile_job_search").validate({
                            rules: {
                                field: {
                                    required: true,
                                    email: true
                                }
                            }
                        });
                    }
                });
            });
        }
    ]
);