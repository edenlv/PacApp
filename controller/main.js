var currentDetail;
var bLoggedIn = false;
var users = {
    a: 'a'
};

var oDetailNav = {
    play: function(data) {
        if (!window.context) window.context = canvas.getContext('2d');
    },

    welcome: function(data) {

    },
    register: function(data) {
        // init datepicker control in register form
        $('#dt').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            locale: 'he'
        }).on('changeDate',
            oParameters => {
                $('#dt').focus().valid();
        });

        if (!window.oValidator) initFormValidator();

        resetForm();
    },
    login: function(data){
        
    }
}

$(() => {
    initApp();
});

function initApp() {
    $.get('./view/master.html').done(
        (data) => {
            $("#splitApp").append(data);
            //set welcome page as default - trigger click event on welcome navbutton
            $('#nav_welcome').trigger($.Event('onclick'));
        }
    ).fail(
        (err) => {
            showError(err);
            alert("Couldn't initialize app - master page not loaded");
        }
    );
}

function toggleMaster(oEvent) {
    var oMaster = $('#masterPage');
    if (oMaster.hasClass('masterHidden')) {
        oMaster.removeClass('masterHidden').addClass('masterVisible');
    } else {
        oMaster.removeClass('masterVisible').addClass('masterHidden');
    }
}

function onMasterNavigate(oEvent, aParams) {
    var toPage = oEvent ? $(oEvent.currentTarget).data('target') : 'welcome';
    var fromPage = currentDetail;

    if (toPage === fromPage) return;

    if (!$("#splitApp").find("#" + toPage).get().length) {
        $.get('./view/' + toPage + '.html')
            .done(
            (data) => {
                $("#splitApp").append(data);

                //init popovers
                $('.user[data-toggle="popover"]').popover({
                    container: 'body',
                    content: '<button class="btn btn-danger" onclick="logout(event)">Log Out</button>',
                    html: true
                });

                if (bLoggedIn){
                    $('#'+toPage).find('.user').addClass('notuser').removeClass('user');
                    $('#'+toPage).find('.notuser').addClass('user').removeClass('notuser');
                }

                bindDetailEvents(toPage);

                transitionToPage(toPage);
            }).fail(
            (data) => {
                alert("404 - Page not found.");
            }
            );
    } else {
        transitionToPage(toPage);
    }
}

function bindDetailEvents(toPage) {
    $('#' + toPage).bind("transitionend", //only fires for display !== none
        onTransitionEndDetail);
    //click outside of master page will trigger close
    $('#' + toPage).bind('mouseup',
        oEvent => {
            if ($('.masterPage').hasClass('masterVisible'))
                window.toggleMaster(oEvent);
        }
    );
}

function transitionToPage(toPage) {
    var fromPage = currentDetail;
    if (fromPage) { //for when initializing app
        $('#' + fromPage).removeClass('slidingCenter').addClass('slidingLeft');
        setTimeout(
            () => {
                $('#' + fromPage).addClass('hidden');
                $('#' + fromPage).removeClass('slidingLeft');
                $('#' + fromPage).addClass('slidingRight');
            }
            , 400);
    }

    $('#' + toPage).removeClass('hidden');
    
    setTimeout(
        () => {
            $('#' + toPage).removeClass('slidingRight').addClass('slidingCenter');
            $(".detailPage:not(#" + toPage + ")").addClass('hidden');
        }
        , 400);

    currentDetail = toPage;
}

function onTransitionEndDetail(oEvent) {
    if ($(oEvent.target).hasClass('detailPage') > 0) {
        oDetailNav[oEvent.target.id]();
    }
}

function resetForm(){
    $('#form_register').get(0).reset();
    window.oValidator.resetForm();
    $('.valid').removeClass('valid');
}

function initFormValidator() {
    $.validator.addMethod("lettersonly", (value, element) => {
        return /^[a-zA-Z]+$/i.test(value);
    }, "Name must contain alphabetical letters only.");

    $.validator.addMethod("alphanumeric", (value, element) => {
        return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
    }, "Password must contain letters AND numbers.");


    window.oValidator = $('#form_register').validate({
        rules: {
            username: {
                minlength: 2,
                required: true
            },
            password: {
                required: true,
                minlength: 8,
                alphanumeric: true
            },
            email: {
                required: true,
                email: true
            },
            firstname: {
                required: true,
                lettersonly: true
            },
            lastname: {
                required: true,
                lettersonly: true
            },
            birthday: {
                required: true
            }

        },
        highlight: function (element) {
            console.log("highlighting");
            $(element).parent().addClass('err').removeClass('valid');
        },
        success: function (element) {
            element.parent().addClass('valid');
            element.parent().removeClass('err');
        },
        submitHandler: function(form){
            console.log("Form submitted");

            if (register(form.username.value, form.password.value)){
                login(form.username.value, form.password.value);
            } else {
                onRegisterError();
            }

            return false;
        }
    });
}

function login(id, pw){
    if (bLoggedIn) {
        alert("Must log out before log-in");
        return false;
    }
    bLoggedIn = users[id]===pw;
    toggleUser();
    $('#nav_welcome').trigger($.Event('onclick'));
    $('.profile').text("Hello, " + id+"!");
    
    return bLoggedIn;
}

function register(id, pw){
    if (users[id]){
        return false;
    } else {
        users[id] = pw;
        return true;
    }
}

function toggleUser(bLoggingIn){

    var toHide = bLoggingIn ? $('.notuser') :$('.user');
    var toShow = bLoggingIn ? $('.user') : $('.notuser');

    toHide.addClass(bLoggingIn ? 'user' : 'notuser').removeClass(bLoggingIn ? 'notuser' : 'user');
    toShow.removeClass(bLoggingIn ? 'user' : 'notuser').addClass(bLoggingIn ? 'notuser' : 'user');

}

function onRegisterError(sUser){
    
}

function logout(oEvent){
    $('.user[data-toggle="popover"]').popover('hide');
    toggleUser();
    bLoggedIn = false;
    $('#nav_welcome').trigger($.Event('onclick'));
}

function showError(sMsg){
    $.get('./view/error.html').done(
        (data)=>{
            $('body').append(data);
            $('#modal').find('.modal-body').text(sMsg);
            $('#modal').modal('show');
        }
    );
}