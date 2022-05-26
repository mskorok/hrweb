var $ = jQuery.noConflict();


var app = angular.module(
    'site',
    [
        'ui.router',
        'ngResource',
        'uiRouterStyles',
        'ngCookies',
        'ngSanitize',
        'notFound',
        'Article',
        'Articles',
        'Books',
        'Certification',
        'Company',
        'CompanyCreate',
        'CompanyEdit',
        'CompanyList',
        'Confirm User',
        'Contact',
        'Education',
        'EducationCreate',
        'EducationEdit',
        'EducationList',
        'Educations',
        'Experience',
        'ExperienceCreate',
        'ExperienceEdit',
        'ExperienceList',
        'Events',
        'Hardware',
        'Home',
        'Job',
        'Migration',
        'Link',
        'Links',
        'Login',
        'Login Recovery',
        'New Password',
        'Profile',
        'ProfileCreate',
        'ProfileEdit',
        'Resume',
        'ResumeCreate',
        'ResumeEdit',
        'ResumeList',
        'ResumeUserList',
        'ResumeFavoriteList',
        'ResumeInvitedList',
        'SearchResume',
        'SearchArticle',
        'SearchVacancy',
        'Software',
        'Subcategory',
        'SubcategoryArticles',
        'Subscribe',
        'Tests',
        'Unsubscribe',
        'Vacancy',
        'VacancyCreate',
        'VacancyEdit',
        'VacancyList',
        'VacancyUserList',
        'VacancyFavoriteList',
        'VacancyAppliedList',
    ]
);
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix(''); // by default '!'
    $locationProvider.html5Mode(true);
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$cookiesProvider', function ($stateProvider, $urlRouterProvider, $cookiesProvider) {


    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeController',
            templateUrl: 'hr/templates/home.html',
            data: {
                title: 'Home',
                css: 'assets/css/home.css'
            }
        })
        // .state('job', {
        //     url: '/job',
        //     controller: 'jobController',
        //     templateUrl: 'hr/templates/job.html',
        //     data: {
        //         title: 'Job',
        //         css: 'assets/css/job.css'
        //     }
        // })
        .state('jobs', {
            url: '/jobs',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Job',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('events', {
        //     url: '/events',
        //     controller: 'eventsController',
        //     templateUrl: 'hr/templates/events.html',
        //     data: {
        //         title: 'Events',
        //         css: 'assets/css/events.css'
        //     }
        // })
        .state('events', {
            url: '/events',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Events',
                css: 'assets/css/subcategory.css'
            }
        })
        .state('educations', {
            url: '/educations',
            controller: 'educationsController',
            templateUrl: 'hr/templates/educations.html',
            data: {
                title: 'Educations',
                css: 'assets/css/educations.css'
            }
        })
        // .state('educations', {
        //     url: '/educations',
        //     controller: 'subcategoryController',
        //     templateUrl: 'hr/templates/subcategory.html',
        //     data: {
        //         title: 'Educations',
        //         css: 'assets/css/subcategory.css'
        //     }
        // })
        // .state('books', {
        //     url: '/books',
        //     controller: 'booksController',
        //     templateUrl: 'hr/templates/books.html',
        //     data: {
        //         title: 'Books',
        //         css: 'assets/css/books.css'
        //     }
        // })
        .state('books', {
            url: '/books',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Books',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('tests', {
        //     url: '/tests',
        //     controller: 'testsController',
        //     templateUrl: 'hr/templates/tests.html',
        //     data: {
        //         title: 'Tests',
        //         css: 'assets/css/tests.css'
        //     }
        // })
        .state('tests', {
            url: '/tests',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Tests',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('migration', {
        //     url: '/migration',
        //     controller: 'migrationController',
        //     templateUrl: 'hr/templates/migration.html',
        //     data: {
        //         title: 'Migration',
        //         css: 'assets/css/migration.css'
        //     }
        // })
        .state('migration', {
            url: '/migration',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Migration',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('certification', {
        //     url: '/certification',
        //     controller: 'certificationController',
        //     templateUrl: 'hr/templates/certification.html',
        //     data: {
        //         title: 'Certification',
        //         css: 'assets/css/certification.css'
        //     }
        // })
        .state('certification', {
            url: '/certification',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Certification',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('software', {
        //     url: '/software',
        //     controller: 'softwareController',
        //     templateUrl: 'hr/templates/software.html',
        //     data: {
        //         title: 'Software',
        //         css: 'assets/css/software.css'
        //     }
        // })
        .state('software', {
            url: '/software',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Software',
                css: 'assets/css/subcategory.css'
            }
        })
        // .state('hardware', {
        //     url: '/hardware',
        //     controller: 'hardwareController',
        //     templateUrl: 'hr/templates/hardware.html',
        //     data: {
        //         title: 'Hardware',
        //         css: 'assets/css/hardware.css'
        //     }
        // })
        .state('hardware', {
            url: '/hardware',
            controller: 'subcategoryController',
            templateUrl: 'hr/templates/subcategory.html',
            data: {
                title: 'Hardware',
                css: 'assets/css/subcategory.css'
            }
        })
        .state('search-resume', {
            url: '/search-resume',
            controller: 'searchResumeController',
            templateUrl: 'hr/templates/search-resume.html',
            data: {
                title: 'Search',
                css: 'assets/css/search-resume.css'
            }
        })
        .state('search-article', {
            url: '/search-article',
            controller: 'searchArticleController',
            templateUrl: 'hr/templates/search-article.html',
            data: {
                title: 'Search',
                css: 'assets/css/search-article.css'
            }
        })
        .state('search-vacancy', {
            url: '/search-vacancy',
            controller: 'searchVacancyController',
            templateUrl: 'hr/templates/search-vacancy.html',
            data: {
                title: 'Search',
                css: 'assets/css/search-vacancy.css'
            }
        })
        .state('article', {
            url: '/article/:id',
            controller: 'articleController',
            templateUrl: 'hr/templates/article.html',
            data: {
                title: 'Article',
                css: 'assets/css/article.css'
            }
        })
        .state('articles', {
            url: '/articles',
            controller: 'articlesController',
            templateUrl: 'hr/templates/articles.html',
            data: {
                title: 'Articles',
                css: 'assets/css/articles.css'
            }
        })
        .state('subcategory-articles', {
            url: '/subcategory/articles/:id',
            controller: 'subcategoryArticlesController',
            templateUrl: 'hr/templates/articles.html',
            data: {
                title: 'Articles',
                css: 'assets/css/articles.css'
            }
        })
        // .state('links', {
        //     url: '/links',
        //     controller: 'linksController',
        //     templateUrl: 'hr/templates/links.html',
        //     data: {
        //         title: 'Article',
        //         css: 'assets/css/links.css'
        //     }
        // })

        // .state('link', {
        //     url: '/link/:id',
        //     controller: 'linkController',
        //     templateUrl: 'hr/templates/link.html',
        //     data: {
        //         title: 'Article',
        //         css: 'assets/css/link.css'
        //     }
        // })

        .state('profile-edit', {
            url: '/profile/edit',
            controller: 'profileEditController',
            templateUrl: 'hr/templates/profile-edit.html',
            data: {
                title: 'Edit Profile ',
                css: 'assets/css/profile-edit.css'
            }
        })

        .state('profile-create', {
            url: '/profile/create',
            controller: 'profileCreateController',
            templateUrl: 'hr/templates/profile-create.html',
            data: {
                title: 'Create Profile ',
                css: 'assets/css/profile-create.css'
            }
        })

        .state('profile', {
            url: '/profile',
            controller: 'profileController',
            templateUrl: 'hr/templates/profile.html',
            data: {
                title: 'Profile',
                css: 'assets/css/profile.css'
            }
        })

        .state('resume-edit', {
            url: '/resume/edit/:id',
            controller: 'resumeEditController',
            templateUrl: 'hr/templates/resume-edit.html',
            data: {
                title: 'Edit Resume ',
                css: 'assets/css/resume-edit.css'
            }
        })

        .state('resume-create', {
            url: '/resume/create',
            controller: 'resumeCreateController',
            templateUrl: 'hr/templates/resume-create.html',
            data: {
                title: 'Create Resume ',
                css: 'assets/css/resume-create.css'
            }
        })


        .state('resume-list', {
            url: '/resume/list',
            controller: 'resumeListController',
            templateUrl: 'hr/templates/resume-list.html',
            data: {
                title: 'List Resume ',
                css: 'assets/css/resume-list.css'
            }
        })

        .state('resume-user-list', {
            url: '/resume/user/list',
            controller: 'resumeUserListController',
            templateUrl: 'hr/templates/resume-user-list.html',
            data: {
                title: 'User Resume List',
                css: 'assets/css/resume-user-list.css'
            }
        })

        .state('resume-favorite-list', {
            url: '/resume/favorite/list',
            controller: 'resumeFavoriteListController',
            templateUrl: 'hr/templates/resume-favorite-list.html',
            data: {
                title: 'Favorite Resume List',
                css: 'assets/css/resume-user-list.css'
            }
        })

        .state('resume-invited-list', {
            url: '/resume/invited/list',
            controller: 'resumeInvitedListController',
            templateUrl: 'hr/templates/resume-invited-list.html',
            data: {
                title: 'Invited Resume List',
                css: 'assets/css/resume-user-list.css'
            }
        })


        .state('resume', {
            url: '/resume/:id',
            controller: 'resumeController',
            templateUrl: 'hr/templates/resume.html',
            data: {
                title: 'Resume',
                css: 'assets/css/resume.css'
            }
        })


        .state('vacancy-edit', {
            url: '/vacancy/edit/:id',
            controller: 'vacancyEditController',
            templateUrl: 'hr/templates/vacancy-edit.html',
            data: {
                title: 'Edit Vacancy ',
                css: 'assets/css/vacancy-edit.css'
            }
        })

        .state('vacancy-create', {
            url: '/vacancy/create',
            controller: 'vacancyCreateController',
            templateUrl: 'hr/templates/vacancy-create.html',
            data: {
                title: 'Create Vacancy ',
                css: 'assets/css/vacancy-create.css'
            }
        })


        .state('vacancy-list', {
            url: '/vacancy/list',
            controller: 'vacancyListController',
            templateUrl: 'hr/templates/vacancy-list.html',
            data: {
                title: 'List Vacancy ',
                css: 'assets/css/vacancy-list.css'
            }
        })

        .state('vacancy-favorite-list', {
            url: '/vacancy/favorite/list',
            controller: 'vacancyFavoriteListController',
            templateUrl: 'hr/templates/vacancy-favorite-list.html',
            data: {
                title: 'Favorite Vacancy List',
                css: 'assets/css/vacancy-favorite-list.css'
            }
        })

        .state('vacancy-applied-list', {
            url: '/vacancy/applied/list',
            controller: 'vacancyAppliedListController',
            templateUrl: 'hr/templates/vacancy-applied-list.html',
            data: {
                title: 'Applied Vacancy List',
                css: 'assets/css/vacancy-favorite-list.css'
            }
        })

        .state('vacancy-user-list', {
            url: '/vacancy/user/list',
            controller: 'vacancyUserListController',
            templateUrl: 'hr/templates/vacancy-user-list.html',
            data: {
                title: 'User Vacancy List',
                css: 'assets/css/vacancy-user-list.css'
            }
        })


        .state('vacancy', {
            url: '/vacancy/:id',
            controller: 'vacancyController',
            templateUrl: 'hr/templates/vacancy.html',
            data: {
                title: 'Vacancy',
                css: 'assets/css/vacancy.css'
            }
        })


        .state('education-edit', {
            url: '/education/edit/:id',
            controller: 'educationEditController',
            templateUrl: 'hr/templates/education-edit.html',
            data: {
                title: 'Edit Education ',
                css: 'assets/css/education-edit.css'
            }
        })

        .state('education-create', {
            url: '/education/create',
            controller: 'educationCreateController',
            templateUrl: 'hr/templates/education-create.html',
            data: {
                title: 'Create Education ',
                css: 'assets/css/education-create.css'
            }
        })


        .state('education-list', {
            url: '/education/list',
            controller: 'educationListController',
            templateUrl: 'hr/templates/education-list.html',
            data: {
                title: 'List Education ',
                css: 'assets/css/education-list.css'
            }
        })


        .state('education', {
            url: '/education/:id',
            controller: 'educationController',
            templateUrl: 'hr/templates/education.html',
            data: {
                title: 'Education',
                css: 'assets/css/education.css'
            }
        })

        .state('experience-edit', {
            url: '/experience/edit/:id',
            controller: 'experienceEditController',
            templateUrl: 'hr/templates/experience-edit.html',
            data: {
                title: 'Edit Experience ',
                css: 'assets/css/experience-edit.css'
            }
        })

        .state('experience-create', {
            url: '/experience/create',
            controller: 'experienceCreateController',
            templateUrl: 'hr/templates/experience-create.html',
            data: {
                title: 'Create Experience ',
                css: 'assets/css/experience-create.css'
            }
        })


        .state('experience-list', {
            url: '/experience/list',
            controller: 'experienceListController',
            templateUrl: 'hr/templates/experience-list.html',
            data: {
                title: 'List Experience ',
                css: 'assets/css/experience-list.css'
            }
        })


        .state('experience', {
            url: '/experience/:id',
            controller: 'experienceController',
            templateUrl: 'hr/templates/experience.html',
            data: {
                title: 'Experience',
                css: 'assets/css/experience.css'
            }
        })
        .state('company-edit', {
            url: '/company/edit/:id',
            controller: 'companyEditController',
            templateUrl: 'hr/templates/company-edit.html',
            data: {
                title: 'Edit Company ',
                css: 'assets/css/company-edit.css'
            }
        })

        .state('company-create', {
            url: '/company/create',
            controller: 'companyCreateController',
            templateUrl: 'hr/templates/company-create.html',
            data: {
                title: 'Create Company ',
                css: 'assets/css/company-create.css'
            }
        })

        .state('company', {
            url: '/company/:id',
            controller: 'companyController',
            templateUrl: 'hr/templates/company.html',
            data: {
                title: 'Company',
                css: 'assets/css/company.css'
            }
        })

        .state('company-list', {
            url: '/company/list',
            controller: 'companyListController',
            templateUrl: 'hr/templates/company-list.html',
            data: {
                title: 'Companies ',
                css: 'assets/css/company-list.css'
            }
        })

        .state('confirm', {
          url: '/confirm',
          controller: 'confirmUserController',
          templateUrl: 'hr/templates/confirm-user.html',
          data: {
            title: '',
            css: 'assets/css/confirm-user.css'
          }
        })

        .state('subscribe', {
            url: '/subscribe',
            controller: 'subscribeController',
            templateUrl: 'hr/templates/subscribe.html',
            data: {
                title: '',
                css: 'assets/css/subscribe.css'
            }
        })

        .state('contact', {
            url: '/contact',
            controller: 'contactController',
            templateUrl: 'hr/templates/contact.html',
            data: {
                title: 'Contacts',
                css: 'assets/css/contact.css'
            }
        })

        .state('not-found', {
            url: '/not-found',
            controller: 'notFoundController',
            templateUrl: 'hr/templates/404.html',
            data: {
                title: '404',
                css: 'assets/css/404.css'
            }
        })

        .state('login', {
            url: '/login',
            controller: 'loginController',
            templateUrl: 'hr/templates/login.html',
            data: {
                title: 'Login',
                css: 'assets/css/login.css'
            }
        })
        .state('logout', {
            url: '/logout',
            controller: 'loginController',
            templateUrl: 'hr/templates/login.html',
            data: {
                title: 'Login',
                css: 'assets/css/login.css'
            }
        })
        .state('login-recovery', {
            url: '/login-recovery',
            controller: 'loginRecoveryController',
            templateUrl: 'hr/templates/login-recovery.html',
            data: {
                title: 'Password Recovery',
                css: 'assets/css/login-recovery.css'
            }
        })
        .state('new-password', {
            url: '/new_password.html',
            controller: 'newPasswordController',
            templateUrl: 'hr/templates/new-password.html',
            data: {
                title: 'New Password',
                css: 'assets/css/new-password.css'
            }
        })
        .state('unsubscribe', {
        url: '/unsubscribe',
        controller: 'unsubscribeController',
        templateUrl: 'hr/templates/unsubscribe.html',
        data: {
            title: 'Unsubscribe',
            css: 'assets/css/unsubscribe.css'
        }
    });

    $urlRouterProvider.otherwise('/not_found');
}]);
