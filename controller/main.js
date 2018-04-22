var currentDetail;
var bLoggedIn = false;
var currentUser;

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
            showError("Couldn't initialize app - master page not loaded");
        }
        );
}

var oDetailNav = { //fires after transitionend of detail page
    play: function (data) {
        setup();
    },

    welcome: function (data) {

    },

    register: function (data) {
        // init datepicker control in register form
        $('#dt').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            locale: 'he'
        }).on('changeDate',
            oParameters => {
                $('#dt').focus().valid();
            });

        Model.initFormValidator();
        resetForm('register');
    },

    login: function (data) {
        Model.initLoginForm();
        resetForm('login');
    },

    default: function (data) {
        if (currentDetail !== 'play') {
            exitGame();
        }
    }
}

function loadDetailPage(toPage) {
    $.get('./view/' + toPage + '.html')
        .done(
        (data) => {
            $("#splitApp").append(data);

            //init popovers
            $('.user[data-toggle="popover"]').popover({
                container: '#' + toPage,
                content: '<button class="btn btn-danger" onclick="Model.logout(event)">Log Out</button>',
                html: true
            });

            if (bLoggedIn) {
                var aux1 = $('#' + toPage).find('.user');
                var aux2 = $('#' + toPage).find('.notuser');

                aux1.addClass('notuser').removeClass('user');
                aux2.addClass('user').removeClass('notuser');
                $('#' + toPage).find('.profile').text("Hello, " + currentUser + "!");
            }

            bindDetailEvents(toPage);

            transitionToPage(toPage);
        }).fail(
        (data) => {
            showError("404 - Page not found.");
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

    onBeforeNavigate(oEvent, toPage);

    if (!oEvent || !oEvent.defaultPrevented) {//first initApp() trigger does not pass event param - ignore
        if (toPage === fromPage) return;

        if (!$("#splitApp").find("#" + toPage).get().length) {
            loadDetailPage(toPage);
        } else {
            transitionToPage(toPage);
        }
    }

}

function onBeforeNavigate(oEvent, toPage) {
    switch (toPage) {
        case 'play': {
            if (!bLoggedIn) {
                showError("You must log in before playing!");
                oEvent.stopPropagation();
                oEvent.preventDefault();
            }

            break;
        }
        case 'login': {
            if (bLoggedIn) {
                showError("You are already logged in! Log out before logging back in :)");
                oEvent.stopPropagation();
                oEvent.preventDefault();
            }

            break;
        }
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
        oDetailNav['default']();
    }
}

function resetForm(sId) {
    $('#form_' + sId).get(0).reset();
    Model.validators[sId].resetForm();
    $('.valid').removeClass('valid');
}

function onLoginSuccess() {
    toggleUser();
    $('#nav_welcome').trigger($.Event('onclick'));
    $('.profile').text("Hello, " + currentUser + "!");
}

function toggleUser(bLoggingIn) {

    var toHide = bLoggingIn ? $('.notuser') : $('.user');
    var toShow = bLoggingIn ? $('.user') : $('.notuser');

    toHide.addClass(bLoggingIn ? 'user' : 'notuser').removeClass(bLoggingIn ? 'notuser' : 'user');
    toShow.removeClass(bLoggingIn ? 'user' : 'notuser').addClass(bLoggingIn ? 'notuser' : 'user');

}

function onRegisterError(sUser) {
    showError('There was a problem in your registration.');
}

function onLogout(oEvent) {
    toggleUser();
    $('#nav_welcome').trigger($.Event('onclick'));
    $('.user[data-toggle="popover"]').popover('hide');
}

function showError(sMsg) {
    if (!$('#modal').length) {
        $.get('./view/error.html').done(
            (data) => {
                $('body').append(data);
                $('#modal').find('.modal-body').text(sMsg);
                $('#modal').modal('show');
            }
        );
    } else {
        $('#modal').find('.modal-body').text(sMsg);
        $('#modal').modal('show');
    }
}

function showAbout() {
    if (!$('#aboutmodal').length) {
        $.get('./view/about.html').done(
            (data) => {
                $('body').append(data);
                $('#aboutmodal').modal('show');
            }
        );
    } else {
        $('#aboutmodal').modal('show');
    }
}

function toggleSound(oEvent) {
    $('#volume .btn').toggle();
    $('#volume .btn').each(
        (idx, element) => {
            if (element.style.display == 'none') {
                audio.muted = $(element).data('sound');
            }
        }
    );
}

function onPressOpenSettings() {
    if (!$('#settingsmodal').length) {
        $.get('./view/settings.html').done(
            (data) => {
                $('body').append(data);

                //validate form
                Model.initSettingsForm();

                onAfterOpenSettings();
            }
        );
    } else {
        
        onAfterOpenSettings();
    }

    
}

function onAfterOpenSettings(){
    resetForm('settings');
    $('#form_settings [name="ballnum"]').val(numOfBalls);
    $('#form_settings [name="time"]').val(sumOfTime/1000);
    $('#form_settings [name="gridRadios"]').each(
        (idx, input) => {
            if (idx+1==numOfMonsters){
                $(input).prop('checked',true);
            }
        }
    );
    $('#settingsmodal').modal('show');
}

function onHideAppFooter(){
    $('.footer').hide('slow');
    $('#showFooter').show('slow');
}

function onShowAppFooter(){
    $('.footer').show('slow');
    $('#showFooter').hide('slow');
}