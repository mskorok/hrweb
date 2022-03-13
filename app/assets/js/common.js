window.rest_user_role = 'Unauthorized';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var admin_auth = {
    frontHome: '/',
    frontLogin: '/login',
    frontRegister: '/profile-create',
    notAllowedUrls: [
        // 'signup',
        // 'company-edit',
        // 'profile',
        // 'profile-edit',
        // 'resume-create',
        // 'resume-edit',
        // 'vacancy-create',
        // 'vacancy-edit'
    ],
    check_auth: function () {
        var self = this;
        window.rest_user_id = null;
        var cookies = admin_auth.get_cookies(), current_url = window.location.href;
        if (typeof cookies === 'object' && Object.keys(cookies).length > 0) {
            console.log('logged in');
            window.rest_user_role = cookies['rest_user_role'];
            window.rest_user_full_name = cookies['rest_user_full_name'];
            window.rest_user_id = cookies['rest_user_id'];
            window.rest_user_token = cookies['rest_user_token'];
            window.front_user = cookies['front_user'];
            if (current_url.indexOf(this.frontLogin) !== -1
                && current_url.indexOf(this.frontRegister) !== -1
            ) {
                window.location.href = this.frontHome;
            }
        } else {
            console.log('not logged');
            this.notAllowedUrls.forEach(function (url) {
                if (current_url.indexOf(url) !== -1) {
                    console.log('not logged');
                    // window.location.href = self.frontLogin;
                }
            });
        }
    },
    get_cookies: function () {
        var parsed = {};
        if (this.get_cookie('rest_user_role') !== '') {
            parsed.rest_user_role = this.get_cookie('rest_user_role');
        }
        if (this.get_cookie('rest_user_id') !== '') {
            parsed.rest_user_id = this.get_cookie('rest_user_id');
        }
        if (this.get_cookie('rest_user_token') !== '') {
            parsed.rest_user_token = this.get_cookie('rest_user_token');
        }
        if (this.get_cookie('rest_user_full_name') !== '') {
            parsed.rest_user_full_name = this.get_cookie('rest_user_full_name');
        }
        if (this.get_cookie('front_user') !== '') {
            parsed.front_user = this.get_cookie('front_user');
        }
        return parsed;
    },
    set_cookie: function (name, value, days) {
        if (days) {
            var d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        } else {
            document.cookie = name + "=" + value +  ";expires=0;path=/";
        }

    },
    get_cookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    },
    eraseCookie: function (name) {
        this.set_cookie(name, '', -1);
    },
    login: function (name, password, remember) {
        // var token = 'Bearer ' + this.get_cookie('rest_user_token');
        remember = remember || null;
        var self = this;
        var error_container = document.getElementById('error_container');
        var url = rest_api_host + hr_login_post_url;
        var xhr = new XMLHttpRequest();
        var form_data = new FormData();
        form_data.append('username', name);
        form_data.append('password', password);
        var basic = 'Basic ' + btoa(name + ":" + password);
        form_data.append('Authorization', basic);
        xhr.onload = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        var response = JSON.parse(this.response);
                        // console.log('r', response, remember);
                        self.set_cookies(response, remember);
                        // console.log(444, self.get_token());
                        window.location.href = self.frontHome;
                    } catch (e) {
                        if (error_container) {
                            error_container.textContent = 'Wrong login or password'
                        }
                        console.log('login error', e);
                    }
                } else {
                   if (error_container) {
                       error_container.textContent = 'Wrong login or password'
                   }
                    console.log('login error response', this.response);
                }
            }
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Authorization', basic);
        xhr.send(form_data);

    },
    logout: function () {
        var el = document.getElementById('hr_nav_logout');
        console.log(el);
        if (el) {
            el.addEventListener('click', function (ev) {
                ev.stopPropagation();
                admin_auth.remove_cookies();
                window.location.reload();
            })
        }
    },
    force_logout: function () {
        admin_auth.remove_cookies();
        window.location.reload();
    },
    set_cookies: function (response, remember) {
        var expires = remember ? 7 : null;
        // console.log('expires', expires);
        if (typeof response.data !== 'undefined' && typeof response.data.role !== 'undefined') {
            this.set_cookie('rest_user_role', response.data.role, expires);
        }

        var img;

        if (typeof response.data !== 'undefined'
            && typeof response.data.avatar !== 'undefined'
            && typeof response.data.avatar.path !== 'undefined'
            && typeof response.data.avatar.fileName !== 'undefined'
        ) {
            this.set_cookie('rest_user_avatar_url', response.data.avatar.path + response.data.avatar.fileName, expires);
        } else if (typeof response.data !== 'undefined' && typeof  response.data.user.gender !== 'undefined') {
            if (response.data.user.gender === 'male') {
                img = '/assets/images/new/mans/man13.png';
            } else if (response.data.user.gender === 'female') {
                img = '/assets/images/new/women/woman13.png';
            } else {
                img = '/assets/images/new/mans/boy09.png';
            }
            this.set_cookie('rest_user_avatar_url', img, expires);
        }
        if (typeof response.data !== 'undefined' && typeof  response.data.token !== 'undefined') {
            this.set_cookie('rest_user_token', response.data.token, expires);
        }
        if (typeof response.data !== 'undefined' && typeof  response.data.user.id !== 'undefined') {
            this.set_cookie('rest_user_id', response.data.user.id, expires);
        }
        if (typeof response.data !== 'undefined' && typeof  response.data.user.id !== 'undefined') {
            var name = response.data.user.name + ' ' + response.data.user.surname;
            this.set_cookie('rest_user_full_name', name, expires);
        }
        if (typeof response.data !== 'undefined' && typeof  response.data.user !== 'undefined') {
            var user = JSON.stringify(response.data.user);
            this.set_cookie('front_user', user, expires);
            localStorage.setItem('front_user', user);
        }
    },
    remove_cookies: function () {
        this.eraseCookie('rest_user_role');
        this.eraseCookie('rest_user_id');
        this.eraseCookie('rest_user_token');
        this.eraseCookie('rest_user_full_name');
        this.eraseCookie('front_user');
        localStorage.removeItem('front_user');
    },
    get_token: function () {
        return this.get_cookie('rest_user_token');
    }
};

admin_auth.check_auth();

/**
 *
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 *
 * @param items
 * @param prop
 * @returns {Array}
 */
function hr_rest_distinct(items, prop) {
    var unique = [];
    var distinctItems = [];
    [].forEach.call(items, function (item) {
        if (unique[item[prop]] === undefined) {
            distinctItems.push(item);
        }
        unique[item[prop]] = 0;
    });
    return distinctItems;
}

/**
 *
 * @param field
 * @param key
 * @param url
 * @param selector
 * @param scope
 */
function hr_rest_awesomplete(field, key, url, selector, scope) {
    var ajax = new XMLHttpRequest();
    var token = admin_auth.get_token();
    var list = [];
    ajax.open("GET", url, true);
    ajax.onload = function () {
        // console.log('aws', ajax.responseText);
        try {
            var obj = JSON.parse(ajax.responseText);
            // console.log('obj', obj);
            if (scope) {
                var opt = obj[key];
                opt = hr_rest_distinct(opt, field);
                scope[key + '_' + field] = opt;
            }
            // console.log(scope);
            list = obj[key].map(function (i) {
                return i[field];
            });

            list = list.filter(function (x, i, a) {
                return a.indexOf(x) === i;
            });
            new Awesomplete(document.querySelector(selector), {list: list});
        } catch (e) {
            console.log('hr_rest_awesomplete_error', e);
        }
    };
    ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajax.setRequestHeader('Authorization', token);
    ajax.send();
}

/**
 *
 * @desc selectors = [
 *   {
 *       field: 'field',
 *       selector: '#selector'
 *   }
 * ]
 *
 * @param field
 * @param key
 * @param url
 * @param selectors
 * @param scope
 */
function hr_rest_awesomplete_mass(field, key, url, selectors, scope) {
    var ajax = new XMLHttpRequest();
    var token = admin_auth.get_token();
    var list = [];
    ajax.open("GET", url, true);
    ajax.onload = function () {
        // console.log('aws', ajax.responseText);
        try {
            var obj = JSON.parse(ajax.responseText);
            // console.log('obj', obj, scope, key + '_' + field);
            if (scope) {
                var opt = obj[key];
                opt = hr_rest_distinct(opt, field);
                scope[key + '_' + field] = opt;
            }
            // console.log('aa', selectors, scope['messages_title']);
            selectors.forEach(function (item) {
                list = obj[key].map(function (i) {
                    return i[item.field];
                });

                list = list.filter(function (x, i, a) {
                    return a.indexOf(x) === i;
                });
                new Awesomplete(document.querySelector(item.selector), {list: list});
            })

        } catch (e) {
            console.log('hr_rest_awesomplete_error', e, key + '_' + field);
        }
    };
    ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajax.setRequestHeader('Authorization', token);
    ajax.send();
}

function hr_rest_fill_model(field, key, url, scope) {
    var ajax = new XMLHttpRequest();
    var token = admin_auth.get_token();
    ajax.open("GET", url, true);
    ajax.onload = function () {
        try {
            var obj = JSON.parse(ajax.responseText);
            var opt = obj[key];
            opt = hr_rest_distinct(opt, field);
            scope[key + '_' + field] = opt;
        } catch (e) {
            console.log('fill_model_error', e);
        }
    };
    ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajax.setRequestHeader('Authorization', token);
    ajax.send();
}

function hr_profile_edit_link() {
    window.location.href = hr_profile_edit_url;
}

var hr_rest_booking_offset = 0;
var hr_rest_product_offset = 0;
var hr_rest_user_offset = 0;
var hr_rest_message_offset = 0;
var hr_rest_payment_offset = 0;
var hr_rest_admin_offset = 0;
var hr_rest_limit = 100;

function hr_reduce_admin_offset() {
    if (hr_rest_admin_offset < hr_rest_limit) {
        hr_rest_admin_offset = 0;
    } else {
        hr_rest_admin_offset -= hr_rest_limit;
    }
}

function hr_reduce_booking_offset() {
    if (hr_rest_booking_offset < hr_rest_limit) {
        hr_rest_booking_offset = 0;
    } else {
        hr_rest_booking_offset -= hr_rest_limit;
    }
}

function hr_reduce_product_offset() {
    if (hr_rest_product_offset < hr_rest_limit) {
        hr_rest_product_offset = 0;
    } else {
        hr_rest_product_offset -= hr_rest_limit;
    }
}

function hr_reduce_message_offset() {
    if (hr_rest_message_offset < hr_rest_limit) {
        hr_rest_message_offset = 0;
    } else {
        hr_rest_message_offset -= hr_rest_limit;
    }
}

function hr_reset_message_offset() {
    hr_rest_message_offset = hr_rest_limit;
}

function hr_reduce_user_offset() {
    if (hr_rest_user_offset < hr_rest_limit) {
        hr_rest_user_offset = 0;
    } else {
        hr_rest_user_offset -= hr_rest_limit;
    }
}

function hr_reduce_payment_offset() {
    if (hr_rest_payment_offset < hr_rest_limit) {
        hr_rest_payment_offset = 0;
    } else {
        hr_rest_payment_offset -= hr_rest_limit;
    }
}

function hr_increase_admin_offset() {
    hr_rest_admin_offset += hr_rest_limit;
}

function hr_increase_booking_offset() {
    hr_rest_booking_offset += hr_rest_limit;
}

function hr_increase_product_offset() {
    hr_rest_product_offset += hr_rest_limit;
}

function hr_increase_message_offset() {
    hr_rest_message_offset += hr_rest_limit;
}

function hr_increase_user_offset() {
    hr_rest_user_offset += hr_rest_limit;
}

function hr_increase_payment_offset() {
    hr_rest_payment_offset += hr_rest_limit;
}

var DateDiff = {

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
};

function hr_sanitize_checkbox(form) {
    var inputs = form.querySelectorAll('input[type=checkbox]');
    [].forEach.call(inputs, function (input) {
        if (input.checked) {
            input.value = 1;
            input.setAttribute('checked', 'checked');
        } else {
            input.value = 0;
            input.removeAttribute('checked');
        }
    });
}

function hr_successEdit(form) {
    form = form || null;
    var container = document.querySelector('#hr_success_container');
    if (container) {
        container.textContent = 'Successfully updated';
        setTimeout(function () {
            container.textContent = '';
        }, 3000);
    }

    if (form) {
        var inputs = form.querySelectorAll('input[type=checkbox]');
        [].forEach.call(inputs, function (input) {
            if (input.value && input.value == 1) {
                input.setAttribute('checked', 'checked');
            } else {
                input.value = 0;
                input.removeAttribute('checked');
            }
        });
    }
}


function hr_get_roles() {
    var role = window.rest_user_role;
    if (role === 'Superadmin') {
        role = 'Admin';
    }
    var roles = [
        'Admin',
        'Superadmin',
        'Manager',
        'Employer',
        'Applicant',
        'Partner',
        'Expert',
        'Author',
        'Unauthorized'
    ];
    if (roles.indexOf(role) !== -1) {
        return role;
    } else {
        window.location.href = hr_login_url;
    }
}

function hr_user_avatar() {
    return rest_api_host + admin_auth.get_cookie('rest_user_avatar_url');
}

function hr_user() {
    return admin_auth.get_cookie('rest_user_full_name');
}

function hr_authorized_id() {
    // console.log('authorized_id', admin_auth.get_cookie('rest_user_id'), document.cookie);
    return admin_auth.get_cookie('rest_user_id');
}

function hr_authorized() {
    var id = admin_auth.get_cookie('rest_user_id');
    return id !== '';
}

function hr_admin() {
    var role = window.rest_user_role;
    return role === 'Admin' || role === 'Superadmin';
}

function dataURLtoFile(data_url, filename) {
    var arr = data_url.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    var file = new File([u8arr], filename, {type: mime});
    console.log('file obj ', file);
    return file;
}

console.log('loaded');

document.addEventListener('DOMContentLoaded', function (e) {
    if (admin_auth.get_cookie('close_cookies_block') === '') {
        var el = document.getElementById('wr-cookies-notice');
        if (el) {
            el.classList.remove('hidden');
        }
    }
    admin_auth.logout();
});
