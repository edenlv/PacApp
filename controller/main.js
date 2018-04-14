var currentDetail;

$(() => {

    // $('.detailPage').bind("webkitTransitionEnd transitionend", //only works for display !== none
    //     onTransitionEndDetail);

    // $('#nav_welcome').trigger($.Event('onclick'));
});

function toggleMaster(oEvent) {
    var oMaster = $('#masterPage');
    if (oMaster.hasClass('masterHidden')) {
        oMaster.removeClass('masterHidden').addClass('masterVisible');
    } else {
        oMaster.removeClass('masterVisible').addClass('masterHidden');
    }
}

function onClickOutsideMaster(oEvent) {
    window.toggleMaster(oEvent);
    $('.detailPage').unbind("click");
}

function onMasterNavigate(oEvent, aParams) {
    var targetPage = oEvent ? $(oEvent.currentTarget).data('target') : 'welcome';

    if (targetPage === currentDetail) return;

    //bring the page from the right side
    $('#' + targetPage).removeClass('hidden');
    setTimeout(
        () => {
            $('#' + targetPage).addClass('slidingCenter');

            if (currentDetail){
                $('#'+currentDetail).addClass('slidingLeft');
                setTimeout(
                    ()=>{
                        $('#'+currentDetail).addClass('hidden');
                    }, 400
                )
            }

            setTimeout(
                ()=>{
                    $('.detailPage').removeClass('slidingLeft slidingRight slidingCenter');
                }
                ,800);
        }
        , 0);

    //slide the current window to the left side
}

function onTransitionEndDetail(oEvent) {
    console.log("ok");

    if ($(oEvent.currentTarget).hasClass('slidingCenter')) {
        currentDetail = oEvent.currentTarget.id;
    }

    // $('.detailPage').removeClass('slidingCenter slidingRight slidingLeft');
}


