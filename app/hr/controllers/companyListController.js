angular.module('CompanyList', [], function () {
    // console.log('module CompanyList init');
}).controller('companyListController', [
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
            $scope.top_menu = 'hr/templates/partial/top-menu.html';
            $scope.top_menu_mobile = 'hr/templates/partial/top-menu-mobile.html';
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.pagination = 'hr/templates/partial/pagination.html';
            $scope.footer = 'hr/templates/partial/footer.html';

            const token = 'Bearer ' + $cookies.get('rest_user_token');


            const user_id = hr_authorized_id();

            $scope.user_id = user_id;

            $scope.user_name = hr_user_name();

            $scope.user_avatar = hr_user_avatar();

            $scope.not_empty = false;

            $scope.userCompanies = [];

            let page = $location.search().page;

            if (typeof page == 'undefined') {
                page = 1;
            }

            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                })
            }

            $scope.goLink = function (page) {
                window.location = $scope.pageUrl + '?page=' + page;
            };

            $scope.disconnect = (id) => {

                const url = rest_api_host + '/companies/disconnect/' + id + '?random=' + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token}
                    }
                ).then(function (data) {
                    // console.info(data);
                    if (data.data.result === 'OK') {
                        window.location.reload();
                    }
                });
            }


            if ($state.current.controller === "companyListController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            const url = rest_api_host + '/company/list/' + page + '?random=' + get_random_number();
                            // console.log('url', url);
                            $http.get(url
                                ,
                                {
                                    headers: {'Authorization': token}
                                }
                            ).then(function (data) {
                                    // console.info('data', data);
                                    const error_container = document.getElementById('error_container');
                                    if (data.data.result === 'error') {
                                        if (error_container) {
                                            error_container.textContent = data.data.message
                                        }
                                        console.log('login error', data.data.message);
                                        return;
                                    }

                                    let error = 'Something went wrong';

                                    if (data.data.data.companies
                                        && data.data.data.companies.length === 0
                                    ) {
                                        error = 'You have no companies';
                                    }


                                    if (data.data.data.companies
                                        && data.data.data.companies.length > 0
                                    ) {


                                        $scope.companies = data.data.data.companies;
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
                                        $scope.userCompanies = data.data.data.userCompanies;
                                        $scope.lastInRange = $scope.pagesRange.length > 0 ? $scope.pagesRange.slice(-1)[0] : 0;
                                        $scope.pageUrl = window.location.origin + window.location.pathname;

                                        $scope.companies.forEach((item) => {
                                            item['my'] = $scope.userCompanies.includes(parseInt(item.id));
                                        })


                                        if ($scope.totalPages > 1) {
                                            $scope.not_empty = true;
                                        }
                                    } else {
                                        if (error_container) {
                                            error_container.textContent = error;
                                        }
                                        console.log('login error', data.data.message);
                                    }


                                    // console.log('scope', $scope)
                                },
                                function (data) {
                                    console.log('error response', data);
                                });
                        }
                    });
                    $templateCache.remove('hr/templates/partial/pagination.html');
                });
            }
        }
    ]
);