var currentDetail;

$(() => {
    initApp();
});

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
    $(".detailPage:not(#" + toPage + ")").addClass('hidden');
    setTimeout(
        () => {
            $('#' + toPage).removeClass('slidingRight').addClass('slidingCenter');
        }
        , 400);

    currentDetail = toPage;
}

function onTransitionEndDetail(oEvent) {
    if ($(oEvent.target).hasClass('detailPage') > 0) {
        oDetailNav[oEvent.target.id]();
    }
}

var oDetailNav = {
    play: function (data) {
        window.context = canvas.getContext('2d');
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
                $('#dt').focus();
            });
        initFormValidator();
    }
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
        }
    });
}

function initApp() {
    $.get('./view/master.html').done(
        (data) => {
            $("#splitApp").append(data);
            //set welcome page as default - trigger click event on welcome navbutton
            $('#nav_welcome').trigger($.Event('onclick'));
        }
    ).fail(
        (err) => {
            console.error(err);
            alert("Couldn't initialize app - master page not loaded");
        }
    );
}