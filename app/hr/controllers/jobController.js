angular.module('Job', [], function () {
    // console.log('module Job init');
}).controller(
    'jobController',
    [
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
                let url = rest_api_host + 'home';
                $http.get(url).then(function (data) {
                    // console.info(data);
                    if (typeof data.data.vacancies != "undefined")
                        $scope.totalVacancies = data.data.vacancies;
                    if (typeof data.data.resumes != "undefined")
                        $scope.totalResumes = data.data.resumes;
                    if (typeof data.data.countries != "undefined")
                        $scope.totalCountries = data.data.countries;
                    $scope.hasVacancies = $scope.totalVacancies > 0;
                    $scope.hasResumes = $scope.totalResumes > 0;
                    $scope.hasCountries = $scope.totalCountries > 1;
                }, function (error) {
                    console.error(error);
                });
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    // console.info('tpl', templateName);
                    if (templateName.toString() === 'hr/templates/partial/job-content.html') {
                        $("#job_search_form").validate({
                            rules: {
                                profession: {
                                    require_from_group: [1, ".desktop-group"]
                                },
                                location: {
                                    require_from_group: [1, ".desktop-group"]
                                },
                            },
                            messages: {
                                profession: "Please enter profession",
                                location: "Please enter location",
                            },
                            submitHandler: (form) => {
                                let id;
                                let el = document.querySelector('input[name="search_type"]:checked');
                                if (el) {
                                    id = el.id;
                                }
                                if (form){
                                    let profession = form.elements.profession.value;
                                    let location = form.elements.location.value;
                                    let qs = '';
                                    if (location && profession) {
                                        qs = '?what=' + encodeURIComponent(profession) + '&where=' + encodeURIComponent(location);
                                    } else if (profession) {
                                        qs = '?what=' + encodeURIComponent(profession);
                                    } else if (location) {
                                        qs = '?where=' + encodeURIComponent(location);
                                    }
                                    let urlResume = window.location.origin + '/search-resume' + qs;
                                    let urlVacancy = window.location.origin + '/search-vacancy' + qs;
                                    if (id === 'vacancy_search_type') {
                                        window.location.href = urlVacancy;
                                    }
                                    if (id ==='resume_search_type') {
                                        window.location.href = urlResume;
                                    }
                                }
                            }
                        });
                    }
                    if (templateName.toString() === 'hr/templates/partial/job-content-mobile.html') {
                        $("#mobile_job_search").validate({
                            rules: {
                                profession: {
                                    require_from_group: [1, ".mobile-group"],
                                },
                                location: {
                                    require_from_group: [1, ".mobile-group"],
                                },
                            },
                            messages: {
                                profession: "Please enter profession",
                                location: "Please enter location",
                            },
                            submitHandler: (form) => {
                                let id;
                                let elem = document.querySelector('input[name="mobile_search_type"]:checked');
                                if (elem) {
                                    id = elem.id;
                                }
                                if (form){
                                    let profession = form.elements.profession.value;
                                    let location = form.elements.location.value;
                                    let qs = '';
                                    if (location && profession) {
                                        qs = '?what=' + encodeURIComponent(profession) + '&where=' + encodeURIComponent(location);
                                    } else if (profession) {
                                        qs = '?what=' + encodeURIComponent(profession);
                                    } else if (location) {
                                        qs = '?where=' + encodeURIComponent(location);
                                    }
                                    let urlResume = window.location.origin + '/search-resume' + qs;
                                    let urlVacancy = window.location.origin + '/search-vacancy' + qs;
                                    if (id === 'mobile_vacancy_search_type') {
                                        window.location.href = urlVacancy;
                                    }
                                    if (id ==='mobile_resume_search_type') {
                                        window.location.href = urlResume;
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }
    ]
);