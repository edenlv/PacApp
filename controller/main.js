var currentDetail;

$(() => {

    $('.detailPage').bind("transitionend", //only works for display !== none
        onTransitionEndDetail);

    //set welcome page as default - trigger click event on welcome navbutton
    $('#nav_welcome').trigger($.Event('onclick'));

    $('.detailPage').bind('mouseup',
        (oEvent)=>{
            if ( $('.masterPage').hasClass('masterVisible') )
                window.toggleMaster(oEvent);
        }
    );
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
    console.log("transition ended");
}