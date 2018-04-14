var currentDetail;

$(() => {

    $('.detailPage').bind("transitionend", //only works for display !== none
        onTransitionEndDetail);

    //set welcome page as default - trigger click event on welcome navbutton
    $('#nav_welcome').trigger($.Event('onclick'));

    //click outside of master page will trigger close
    $('.detailPage').bind('mouseup',
        (oEvent)=>{
            if ( $('.masterPage').hasClass('masterVisible') )
                window.toggleMaster(oEvent);
        }
    );

    //init datepicker control in register form
    $('#dt').datepicker({
        format: 'dd/mm/yyyy',
         autoclose: true,
         locale: 'he'
    });

    //register form validator
    initFormValidator();
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

    if (fromPage){ //for when initializing app
        $('#'+fromPage).removeClass('slidingCenter').addClass('slidingLeft');
        setTimeout(
            ()=>{
                $('#'+fromPage).addClass('hidden');
                $('#'+fromPage).removeClass('slidingLeft');
                $('#'+fromPage).addClass('slidingRight');
            }
        ,200);
    }

    $('#'+toPage).removeClass('hidden');
    setTimeout(
        ()=>{
            $('#'+toPage).removeClass('slidingRight').addClass('slidingCenter');
        }
    ,200);

    currentDetail = toPage;
}

function onTransitionEndDetail(oEvent) {
    if ( $(oEvent.target).hasClass('detailPage') > 0 ){
        console.log("transition of detail page ended");
    }
}

function initFormValidator(){
    $('#form_register').validate({
        rules: {
            username: {
                minlength: 2,
                required: true
            },
            password: {
                required: true,
                minlength: 8
            },
            email: {
                required: true,
                email: true
            },
        },
        highlight: function (element) {
            console.log("highlighting");
            console.log(element);
        },
        success: function (element) {
            element.parent().addClass('valid');
        }
    });
}