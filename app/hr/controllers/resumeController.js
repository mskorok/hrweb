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
            $scope.show_remove_favorite = false;
            $scope.show_add_favorite = false;
            $scope.company_id = null;

            const user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();
            $scope.companyAdmin = false;

            const resume_id = $stateParams.id;

            $scope.managed_companies = [];
            $scope.invited_companies = [];
            $scope.invited = [];

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
                                    // console.info('resume data', data.data.resume);
                                    $scope.resume = data.data.resume;
                                    $scope.resume.age = now - birthday;
                                    $scope.avatar = data.data.resume.Avatar[0];
                                    const invited = data.data.resume.Invited;
                                    const favorites = data.data.resume.Favorites;

                                    [].forEach.call(invited, (inv) => {
                                        if (parseInt(inv.user_id) === $scope.user_id) {
                                            $scope.invited.push(inv);
                                        }
                                    });


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
                                            $scope.user = data.data.user;
                                            let role = $scope.user.role;
                                            $scope.companyAdmin = role === 'admin' || role === 'superadmin' || $scope.user.Companies.length > 0;
                                            if (companies.length > 0 && managers.length > 0) {
                                                [].forEach.call(companies, function (company) {
                                                    let flag = true;
                                                    [].forEach.call($scope.invited, function (inv) {
                                                        if (parseInt(company.id) === parseInt(inv.company_id)) {
                                                            flag = false;
                                                        }
                                                    });
                                                    if (flag) {
                                                        $scope.managed_companies.push(company);
                                                    } else {
                                                        $scope.invited_companies.push(company);
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    if (favorites && favorites.length > 0) {
                                        [].forEach.call(favorites, function (favorite) {
                                            if (user_id && parseInt(favorite.user_id) === user_id) {
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
                                let url = rest_api_host + 'favorite-resume/remove/' + $scope.resume.id + '?random=' + get_random_number();
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
                                let url = rest_api_host + 'favorite-resume/add/' + $scope.resume.id + '?random=' + get_random_number();
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

                        $scope.inviteResume = () => {
                            if (user_id && $scope.resume.id && user_id) {
                                const invitation_form = document.getElementById('resume_invitation_companies');
                                let inputs = invitation_form.elements['managed'];

                                if (inputs.constructor.name === 'HTMLInputElement') {
                                    inputs = [inputs];
                                }
                                let ids = [];
                                [].forEach.call(inputs, (input) => {
                                    if (input.checked) {
                                        ids.push(input.value)
                                    }
                                })

                                let url = rest_api_host + 'resume/invite/' + $scope.resume.id + '?companies=' + ids.join(',') + '&random=' + get_random_number();

                                $http.get(url
                                    ,
                                    {
                                        headers: {'Authorization': token}
                                    }
                                ).then(function (data) {
                                        if (data.data.result === 'OK') {
                                            window.location.reload();
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
                        $scope.removeInvitation = () => {
                            if (user_id && $scope.resume.id && user_id) {
                                const invitation_form = document.getElementById('resume_remove_invitation');
                                let inputs = invitation_form.elements['removed'];

                                if (inputs.constructor.name === 'HTMLInputElement') {
                                    inputs = [inputs];
                                }

                                let ids = [];
                                [].forEach.call(inputs, (input) => {
                                    if (input.checked){
                                        ids.push(input.value);
                                    }
                                })

                                let url = rest_api_host + 'resume/remove/invited/' + $scope.resume.id + '?companies=' + ids.join(',') + '&random=' + get_random_number();
                                $http.get(url
                                    ,
                                    {
                                        headers: {'Authorization': token}
                                    }
                                ).then(function (data) {
                                        if (data.data.result === 'OK') {
                                            window.location.reload();
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