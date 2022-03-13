angular.module('Vacancy', [], function () {
    console.log('module Vacancy init');
}).controller('vacancyController', [
    "$scope",
    '$state',
    '$cookies',
    '$http',
    '$templateCache',
    '$location',
    '$stateParams',
    function ($scope, $state, $cookies, $http, $templateCache, $location, $stateParams) {
        $scope.hr_rest_limit = 100;
        $scope.header_content = 'hr/templates/partial/header-content.html';
        $scope.top_menu = 'hr/templates/partial/top-menu.html';
        $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
        $scope.footer = 'hr/templates/partial/footer.html';
        $scope.show_apply = false;
        $scope.show_applied = false;
        $scope.show_remove_favorite = false;
        $scope.show_add_favorite = false;

        var token = 'Bearer ' + $cookies.get('rest_user_token');

        // var vacancy_id = window.location.pathname.split("/").pop();

        var vacancy_id = $stateParams.id;


        var user_id = hr_authorized_id();

        $scope.user_id = user_id;

        $scope.user_name = hr_user();

        $scope.user_avatar = hr_user_avatar();

        if ($state.current.controller === "vacancyController") {
            $scope.$on('$viewContentLoaded', function () {
                $scope.$on('$includeContentLoaded', function (event, templateName) {
                    console.log('tpl', templateName);
                    if (templateName.toString() === 'hr/templates/partial/footer.html') {

                        var url = rest_api_host + 'vacancies/' + vacancy_id + '/?include=Companies,CompanyAvatar,JobTypes,Country,Favorites,Applied';
                        console.log('url', url);
                        $http.get(url).then(function (data) {
                                if (data.data.vacancy) {
                                    var vacancy = data.data.vacancy;
                                    console.log('v', vacancy);
                                    vacancy.job_type = vacancy.JobTypes.length > 0 ? vacancy.JobTypes[0].name : null;
                                    vacancy.company_url = vacancy.Companies.site;
                                    vacancy.company_name = vacancy.Companies.name;
                                    vacancy.image = vacancy.CompanyAvatar[0].path + vacancy.CompanyAvatar[0].fileName;

                                    vacancy.country = vacancy.Country.name;

                                    $scope.vacancy = vacancy;

                                    var applied = vacancy.Applied;

                                    var favorites = vacancy.Favorites;

                                    // console.log('applied', applied);
                                    //
                                    console.log('fav', favorites);

                                    if (user_id && applied && applied.length > 0) {
                                        [].forEach.call(applied, function (apl) {
                                            if (parseInt(apl.user_id) === user_id) {
                                                $scope.show_applied = true;
                                            }
                                        });
                                        if (!$scope.show_applied) {
                                            $scope.show_apply = true;
                                        }
                                    } else {
                                        $scope.show_apply = true;
                                    }

                                    if (user_id && favorites && favorites.length > 0) {
                                        [].forEach.call(favorites, function (favorite) {
                                            if (parseInt(favorite.user_id) === user_id) {
                                                $scope.show_remove_favorite = true;
                                            }
                                        });
                                        if (!$scope.show_remove_favorite) {
                                            $scope.show_add_favorite = true;
                                        }
                                    } else {
                                        $scope.show_add_favorite = true;
                                    }

                                    console.log(3, $scope.show_add_favorite, $scope.show_remove_favorite);

                                }
                            },
                            function (data) {
                                console.log('error response', data);
                            });
                    }
                });

                $scope.removeFavorite = function () {
                    if (user_id && $scope.vacancy && $scope.vacancy.id) {
                        var url = rest_api_host + 'favorite/remove/' + user_id + '/' + $scope.vacancy.id;

                        $http.get(url
                            ,
                            {
                              headers: {'Authorization': token}
                            }
                        ).then(function (data) {
                                if (data.data.result === 'OK') {
                                    $scope.show_remove_favorite = false;
                                    $scope.show_add_favorite = true;
                                } else if (data.data.result === 'error') {
                                    console.log('error', data.data.message);
                                } else {
                                    console.log('error response', data);
                                }
                            },
                            function (data) {
                                console.log('error response', data);
                            });
                    }
                };

                $scope.addFavorite = function () {
                    if (user_id && $scope.vacancy && $scope.vacancy.id) {
                        var url = rest_api_host + 'favorite/add/' + user_id + '/' + $scope.vacancy.id;
                        $http.get(url
                            ,
                            {
                              headers: {'Authorization': token}
                            }
                        ).then(function (data) {
                                if (data.data.result === 'OK') {
                                    $scope.show_remove_favorite = true;
                                    $scope.show_add_favorite = false;
                                } else if (data.data.result === 'error') {
                                    console.log('error', data.data.message);
                                } else {
                                    console.log('error response', data);
                                }
                            },
                            function (data) {
                                console.log('error response', data);
                            });
                    }
                };

                $scope.applyVacancy = function () {
                    if (user_id && $scope.vacancy.id && user_id) {
                        var url = rest_api_host + 'vacancy/apply/' + user_id + '/' + $scope.vacancy.id ;
                        console.log('url', url);
                        $http.get(url
                            ,
                            {
                              headers: {'Authorization': token}
                            }
                        ).then(function (data) {
                                if (data.data.result === 'OK') {
                                    $scope.show_apply = false;
                                    $scope.show_applied = true;
                                } else if (data.data.result === 'error') {
                                    console.log('error', data.data.message);
                                } else {
                                    console.log('error response 1', data.data.data);
                                }
                            },
                            function (data) {
                                console.log('error response', data);
                            });
                    }
                };
            });
            angular.element(document).ready(function () {

            });
        }
    }]);