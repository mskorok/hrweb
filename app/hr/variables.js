//global variables

window.hr_offset = 0;
window.hr_user_offset = 0;


// const  rest_api_host = 'http://api.hr.me/';
const  rest_api_host = 'http://hr.me/';
const  the_host = 'http://ir.me';

const  redirectUrl = '/login';



const  hr_login_get_url = '/login';
const  hr_login_post_url = 'users/authenticate';
const  hr_login_recovery_get_url = 'password/recovery';
const  hr_login_recovery_post_url = 'users/recovery';
const  hr_new_password_get_url = 'password/new';
const  hr_new_password_post_url = 'users/password';


const  hr_form_create = '/api/form/create';
const  hr_form_create_main = '/api/form/create/main';
const  hr_form_create_image = '/api/form/create/image';
const  hr_form_create_related = 'api/form/create/related';
const  hr_form_create_related_image = '/api/form/create/related/image';
const  hr_form_delete_related = '/api/form/delete/related';

const  hr_mail_subscription_url = '/subscribe/mail';







const  hr_user_list_url = 'user-list';
const  hr_user_item_url = 'user-item';
const  hr_user_edit_url = 'user-edit';
const  hr_user_create_url = 'user-create';
const  hr_user_search_url = 'user-search';
const  hr_profile_url = 'user-profile';
const  hr_profile_edit_url = 'profile-edit';
const  hr_profile_create_url = 'profile-create';
const  hr_profile_autoresponder_url = 'profile-autoresponder';
const  hr_home_url = '/';
const  hr_login_url = 'login';
const  hr_signup_url = 'signup';


const  hr_edit_user_key = 'edit-user';
const  hr_profile_key = 'user';
const  rest_admin_confirm_user = 'confirm-user';

const  avatar_url = '/avatar/create'; // TODO



const  navbar = {
    admin: 'templates/admin-navbar.html',
    nav: 'templates/navbar.html'
};

const  crop_opts = {
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

const  scripts = [
    'js/vendor/js/jquery/jquery.js',
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular.min.js',
    'js/components/awesomplete.js',
    'http://underscorejs.org/underscore-min.js',
    'js/components/jquery.dataTables.min.js',
    'css/components/jquery.dataTables.min.css',
    'css/components/jquery.dataTables.reset.css',
    'css/components/awesomplete.css'
];
