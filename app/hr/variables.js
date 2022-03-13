//global variables

window.hr_offset = 0;
window.hr_user_offset = 0;


// var rest_api_host = 'http://api.hr.me/';
var rest_api_host = 'http://hr.me/';
var the_host = 'http://ir.me';

var redirectUrl = '/login';



var hr_login_get_url = '/login';
var hr_login_post_url = 'users/authenticate';
var hr_login_recovery_get_url = 'password/recovery';
var hr_login_recovery_post_url = 'users/recovery';
var hr_new_password_get_url = 'password/new';
var hr_new_password_post_url = 'users/password';


var hr_form_create = '/api/form/create';
var hr_form_create_main = '/api/form/create/main';
var hr_form_create_image = '/api/form/create/image';
var hr_form_create_related = 'api/form/create/related';
var hr_form_create_related_image = '/api/form/create/related/image';
var hr_form_delete_related = '/api/form/delete/related';

var hr_mail_subscription_url = '/subscribe/mail';







var hr_user_list_url = 'user-list';
var hr_user_item_url = 'user-item';
var hr_user_edit_url = 'user-edit';
var hr_user_create_url = 'user-create';
var hr_user_search_url = 'user-search';
var hr_profile_url = 'user-profile';
var hr_profile_edit_url = 'profile-edit';
var hr_profile_create_url = 'profile-create';
var hr_profile_autoresponder_url = 'profile-autoresponder';
var hr_home_url = '/';
var hr_login_url = 'login';
var hr_signup_url = 'signup';


var hr_edit_user_key = 'edit-user';
var hr_profile_key = 'user';
var rest_admin_confirm_user = 'confirm-user';

var avatar_url = '/avatar/create'; // TODO



var navbar = {
    admin: 'templates/admin-navbar.html',
    nav: 'templates/navbar.html'
};

var crop_opts = {
    viewport: {
        width: 300,
        height: 300,
        type: 'circle'
    },
    step: 0.05,
    boundary: {
        width: 300,
        height: 300
    },
    showZoomer: false
};

var scripts = [
    'js/vendor/js/jquery/jquery.js',
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular.min.js',
    'js/components/awesomplete.js',
    'http://underscorejs.org/underscore-min.js',
    'js/components/jquery.dataTables.min.js',
    'css/components/jquery.dataTables.min.css',
    'css/components/jquery.dataTables.reset.css',
    'css/components/awesomplete.css'
];
// var templates = {
//     'home': {
//         'title': 'Jourday REST API WP UI',
//         'content': 'templates/home.html',
//         'url': '/'
//     },
//     'login': {
//         'title': 'REST login',
//         'content': 'templates/login.html',
//         'url': 'login'
//     },
//     'signup': {
//         'title': 'REST signup',
//         'content': 'templates/signup.html',
//         'url': 'signup'
//     },
//
//     'user-item': {
//         'title': 'User',
//         'content': 'templates/user.html',
//         'url': 'user-item'
//     },
//     'user-list': {
//         'title': 'User List',
//         'content': 'templates/user-list.html',
//         'url': 'user-list'
//     },
//     'user-edit': {
//         'title': 'User Edit',
//         'content': 'templates/user-edit.html',
//         'url': 'user-edit'
//     },
//     'user-create': {
//         'title': 'User Create',
//         'content': 'templates/user-create.html',
//         'url': 'user-create'
//     },
//     'user-search': {
//         'title': 'User Search',
//         'content': 'templates/user-search.html',
//         'url': 'user-search'
//     },
//
//     'user-profile': {
//         'title': 'Profile',
//         'content': 'templates/profile.html',
//         'url': 'user-profile'
//     },
//     'profile-edit': {
//         'title': 'Profile Edit',
//         'content': 'templates/profile-edit.html',
//         'url': 'profile-edit'
//     },
//     'profile-create': {
//         'title': 'Profile Create',
//         'content': 'templates/profile-create.html',
//         'url': 'profile-create'
//     },
// };