angular.module('Resume', [], function () {
    // console.log('module Resume init');
}).controller('resumeController', [
        '$scope',
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        '$stateParams',
        function ($scope, $state, $cookies, $http, $templateCache, $location, $stateParams) {

            let token = 'Bearer ' + $cookies.get('rest_user_token');

            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.rest_api_host = rest_api_host;
            $scope.show_apply = false;
            $scope.show_applied = false;
            $scope.show_remove_favorite = false;
            $scope.show_add_favorite = false;
            $scope.company_id = null;

            const user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            const resume_id = $stateParams.id;

            $scope.managed_companies = [];

            let url = rest_api_host + 'resumes/' + resume_id + '?include=Uploaded,Avatar,Experience,Education,Users,Favorites,Invited&random=' + get_random_number();


            if ($state.current.controller === "resumeController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            // console.log('url', url);
                            $http.get(url).then(function (data) {
                                    const birthday = new Date(data.data.resume.Users.birthday).getFullYear();
                                    const now = new Date().getFullYear();
                                    console.info('resume data', data.data.resume);
                                    $scope.resume = data.data.resume;
                                    $scope.resume.age = now - birthday;
                                    $scope.avatar = data.data.resume.Avatar[0];

                                    const invited = data.data.resume.Invited;

                                    const favorites = data.data.resume.Favorites;


                                    if (user_id) {
                                        let url = rest_api_host + 'users/' + user_id + '?include=Companies,CompanyManager&random=' + get_random_number();
                                        $http.get(url
                                            ,
                                            {
                                                headers: {'Authorization': token},
                                                cache: false
                                            }
                                        ).then(function (data) {
                                            const managers = data.data.user.CompanyManager;
                                            const companies = data.data.user.Companies;
                                            if (companies.length > 0 && managers.length > 0) {
                                                [].forEach.call(companies, function (company) {
                                                    [].forEach.call(invited, function (inv) {
                                                        if (company.id !== inv.company_id) {
                                                            $scope.managed_companies.push(company);
                                                        }
                                                    });
                                                });
                                            }

                                            console.warn('ic', invited, $scope.managed_companies);
                                        });
                                    }







                                    if (invited && invited.length > 0) {
                                        [].forEach.call(invited, function (inv) {
                                            if (user_id && parseInt(inv.user_id) === parseInt(user_id)) {
                                                $scope.show_applied = true;
                                            }
                                        });
                                        if (!$scope.show_applied) {
                                            $scope.show_apply = true;
                                        }
                                    } else {
                                        $scope.show_apply = true;
                                    }

                                    if (favorites && favorites.length > 0) {
                                        [].forEach.call(favorites, function (favorite) {
                                            if (user_id && parseInt(favorite.user_id) === parseInt(user_id)) {
                                                $scope.show_remove_favorite = true;
                                            }
                                        });
                                        if (!$scope.show_remove_favorite) {
                                            $scope.show_add_favorite = true;
                                        }
                                    } else {
                                        $scope.show_add_favorite = true;
                                    }
                                },
                                function (data) {
                                    console.log('error response', data);
                                }
                            );
                        }

                        $scope.removeFavorite = function () {
                            if (user_id && $scope.resume && $scope.resume.id) {
                                let url = rest_api_host + 'favorite-resume/remove/' + user_id + '/' + $scope.resume.id;
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
                            if (user_id && $scope.resume && $scope.resume.id) {
                                let url = rest_api_host + 'favorite-resume/add/' + user_id + '/' + $scope.resume.id;
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

                        $scope.inviteResume = function () {
                            if (user_id && $scope.resume.id && user_id) {
                                const invitation_form = document.getElementById('resume_invitation_companies');
                                let inputs = invitation_form.elements['managed'];
                                let ids = [];
                                [].forEach.call(inputs, (input) => {
                                    if (input.checked){
                                        ids.push(input.value)
                                    }
                                })

                                let joined = ids.join(',');

                                let url = rest_api_host + 'resume/invite/' + user_id + '/' + $scope.resume.id + '?companies=' + ids.join(',') + '&random=' + get_random_number();
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
                                            console.log('error response', data);
                                        }
                                    },
                                    function (data) {
                                        console.log('error response', data);
                                    });
                            }

                        };
                    });
                });
            }
        }
    ]
);