var widthContainer = $('.container').width();
var heightContainer = widthContainer * 9 / 16;

$('.wrapper-right').css({'height': heightContainer * 0.88 + 'px'});

// $('.container').css({'height': heightContainer + 'px'});
$('.wrapper').css({'padding-top': (heightContainer * 0.027) + 'px'});
$('.title-wrapper-left').css({'height': heightContainer * 0.105 + 'px'});
$('.title-wrapper-right').css({'height': heightContainer * 0.105 + 'px'});

var widthTitlePLeft = $('.title-wrapper-left p').width();
$('.title-wrapper-left p').css({
    'height': heightContainer * 0.105 + 'px',
    'font-size': (heightContainer * 0.04) + 'px',
    'line-height': heightContainer * 0.15 + 'px'
});
$('.title-wrapper-right p').css({
    'height': heightContainer * 0.105 + 'px',
    'font-size': (heightContainer * 0.04) + 'px',
    'line-height': heightContainer * 0.15 + 'px',
    'margin-left': widthContainer * 0.075 + 'px'
});
$('.content-wrapper-left').css({'height': heightContainer * 0.78 + 'px', 'margin-top': heightContainer * 0.03 + 'px'});
$('.content-wrapper-right').css({'margin-top': heightContainer * 0.03 + 'px'});
$('.box-heart').css({ 'height':  + 'px', 'margin-bottom': heightContainer * 0.017 + 'px'});

//box avatar
var widthBoxAvatar = $('.box-avatar-left').width();
$('.box-avatar-left').css({'height': widthBoxAvatar + 'px'});
$('.box-avatar-right').css({'height': widthBoxAvatar + 'px'});
$('.content-heart-left').css({'font-size': heightContainer * 0.02 + 'px'});
$('.content-heart-right').css({'font-size': heightContainer * 0.02 + 'px'});
$('.name-heart-left').css({'font-size': heightContainer * 0.02 + 'px'});
$('.name-heart-right').css({'font-size': heightContainer * 0.02 + 'px'});
$('.box-content-heart-left').css({'min-height': widthBoxAvatar + 'px'});
$('.box-content-heart-right').css({'min-height': widthBoxAvatar + 'px'});