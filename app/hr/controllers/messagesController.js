angular.module('Messages', [], function () {
    // console.log('module Profile init');
}).controller('messagesController', [
        "$scope",
        '$state',
        '$cookies',
        '$http',
        '$templateCache',
        '$location',
        function (
            $scope, $state, $cookies, $http, $templateCache, $location
        ) {
            $scope.hr_rest_limit = 100;
            $scope.header_content = 'hr/templates/partial/header-content.html';
            $scope.header_background = 'hr/templates/partial/header-background.html';
            $scope.admin_menu = 'hr/templates/partial/admin-menu.html';
            $scope.footer = 'hr/templates/partial/footer.html';
            $scope.rest_api_host = rest_api_host;


            let token = 'Bearer ' + $cookies.get('rest_user_token');

            let user_id = hr_authorized_id();

            $scope.user_id = user_id;
            $scope.user = hr_user();
            $scope.user_name = hr_user_name();
            $scope.user_avatar = hr_user_avatar();
            $scope.role = hr_get_roles();

            $scope.company = $scope.role === 'admin' || $scope.role === 'superadmin' || $scope.role === 'partner' || $scope.role === 'manager';
            $scope.companyAdmin = $scope.role === 'admin' || $scope.role === 'superadmin' || $scope.role === 'companyAdmin' || $scope.role === 'partner' || $scope.role === 'manager';
            $scope.admin = $scope.role === 'admin' || $scope.role === 'superadmin';
            $scope.applicant = $scope.role === 'admin' || $scope.role === 'superadmin' || $scope.role === 'applicant' || $scope.role === 'manager';
            $scope.superadmin = $scope.role === 'superadmin';

            $scope.applied = [];
            $scope.invitations = [];


            if (!user_id) {
                console.log('id not found');
                $state.go('login', {
                    url: '/login'
                    // url: '/search/:keyword'
                })
            }

            $scope.showComments = (event) => {
                const parent = event.target.parentNode;

                if (parent) {
                    const show = parent.querySelectorAll('.hide-comments');
                    if (show) {
                        [].forEach.call(show, (i) => {
                            i.classList.remove('hidden');
                        });
                    }

                    const hide = parent.querySelectorAll('.show-comments');
                    if (hide) {
                        [].forEach.call(hide, (i) => {
                            i.classList.add('hidden');
                        });
                    }
                }
            }

            $scope.hideComments = (event) => {
                const parent = event.target.parentNode;

                if (parent) {
                    const show = parent.querySelectorAll('.show-comments');
                    if (show) {
                        [].forEach.call(show, (i) => {
                            i.classList.remove('hidden');
                        });
                    }

                    const hide = parent.querySelectorAll('.hide-comments');
                    if (hide) {
                        [].forEach.call(hide, (i) => {
                            i.classList.add('hidden');
                        });
                    }
                }
            }

            $scope.submitForm = (event) => {
                const btn = event.target;
                if (btn) {
                    const form = btn.closest('form');

                    if (form.checkValidity()) {
                        // const id = form.id.replace('message_create_form_', '');
                        const id = form.elements['message_id'].value;

                        let _message;

                        [].forEach.call($scope.applied, (message) => {
                            if ('' + message.message.id === '' + id) {
                                _message = message.message;
                            }
                        });

                        [].forEach.call($scope.invitations, (message) => {
                            if ('' + message.message.id === '' + id) {
                                _message = message.message;
                            }
                        });

                        const title = form.elements['title'].value;
                        const content = form.elements['content'].value;

                        const recipient = '' + _message.sender === '' + user_id ? _message.recipient : _message.sender

                        const data = {
                            content: content,
                            title: title,
                            recipient: recipient,
                            categories: _message.categories,
                            parent: _message.id
                        };

                        let url = rest_api_host + '/messages/send/' + recipient + '?random='  + get_random_number();
                        $http({
                            method: 'POST',
                            url: url,
                            headers: {'Authorization': token},
                            data: data
                        }).then(function (data) {
                                console.info('data comment', data.data, data.data.result);
                                if (data.data.result && data.data.result === 'OK') {
                                    $scope.rerenderComments(id);
                                } else {
                                    $scope.wentWrong(id);
                                }
                            },
                            function (data) {
                                console.log('error response', data);
                            });



                    }
                }
            }

            $scope.rerenderComments = (id) => {
                let url = rest_api_host + 'messages/get/parent?random=' + get_random_number();
                $http.get(url
                    ,
                    {
                        headers: {'Authorization': token}
                    }
                ).then(function (data) {
                        $scope.applied = data.data.data.applied;
                        $scope.invitations = data.data.data.invitations;

                        setTimeout(() => {
                            $scope.openCommentBlock(id);
                        }, 50);



                        $scope.getForms();

                    },
                    function (data) {
                        console.log('error response', data);
                    });
            }

            $scope.openCommentBlock = (id) => {
                const block = document.getElementById('message_block_' + id);

                if (block) {
                    const show = block.querySelectorAll('.hide-comments');

                    if (show) {
                        [].forEach.call(show, (i) => {
                            i.classList.remove('hidden');
                        });
                    }

                    const hide = block.querySelectorAll('.show-comments');

                    if (hide) {
                        [].forEach.call(hide, (i) => {
                            i.classList.add('hidden');
                        });
                    }

                    const sent = document.getElementById('sent_info_' + id);
                    const form = document.getElementById('message_create_form_' + id);

                    if (sent) {
                        sent.classList.remove('hidden');

                        setTimeout(() => {
                            sent.classList.add('hidden');
                        }, 2000);
                    }


                    if (form) {
                        form.classList.add('hidden');

                        setTimeout(() => {
                            form.classList.remove('hidden');
                        }, 2000);
                    }
                } else {
                    setTimeout(() => {
                        $scope.openCommentBlock(id);
                    }, 50);
                }
            }

            $scope.wentWrong = (id) => {
                const error = document.getElementById('sent_error_' + id);

                if (error) {
                    error.classList.remove('hidden');

                    setTimeout(() => {
                        error.classList.add('hidden');
                    }, 2000);
                }
            }

            $scope.getForms = () => {
                const forms = document.querySelectorAll('form');

                if (forms.length === 0) {
                    setTimeout(() => {
                        $scope.getForms();
                    }, 500);
                } else {
                    [].forEach.call(forms, (form) => {
                        form.addEventListener('submit', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        })
                    })
                }
            }

            if ($state.current.controller === "messagesController") {
                $scope.$on('$viewContentLoaded', function () {
                    $scope.$on('$includeContentLoaded', function (event, templateName) {
                        // console.log('tpl', templateName);
                        if (templateName.toString() === 'hr/templates/partial/footer.html') {
                            let url = rest_api_host + 'messages/get/parent?random=' + get_random_number();
                            $http.get(url
                                ,
                                {
                                    headers: {'Authorization': token}
                                }
                            ).then(function (data) {
                                    $scope.applied = data.data.data.applied;
                                    $scope.invitations = data.data.data.invitations;

                                    $scope.getForms();

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