(function ($) {
    $(function () {
        let arrayImages   = [];
        let fixArray      = [];
        let avatarLNArray = [];
        let LastNineAvatar= [];
        let images        = '';
        let indexAvatar   = 0;
        let delegateSize  = 0;
        let movingFlag    = false;
        let TimeoutRound1, TimeoutRound2, TimeoutRound3, TimeoutRound4, movingTimeout;
        let append        = false;

        let firstTimeFlag = false;
        let firstTimeFlag1= false;

        let isChecking = true;

        let totalMoving = 4800;
        let timeMovingElement= 1200;
        let timeAppendName = 600;

        let oldDelegates = [];


        // init index small avatars in logo
        const initArrayImage  = function () {
//            const image =  document.getElementById('delegate');
            let image       = $('.box-four-star');
            let position    = image.position();
            let heightImage = image.height();
            let top         = position.top;
            delegateSize    = heightImage/40;

            for (let i = 1; i<=40 ; i ++)
            {
                let left = position.left;
                for (let j = 1; j<=40 ; j ++)
                {
                    let lng_Log = {top : top+'px', left : left+'px', height:delegateSize+'px', width:delegateSize+'px', opacity:0.60, 'margin-left':2+'px', 'margin-bottom':2+'px'};
                    arrayImages.push(lng_Log);
                    left += delegateSize;
                }

                top += delegateSize
            }

            // let rejectArray= [13, 16,17,18,23,24,25,26,29,30,31,32,33,34,35,71,72,73,74,75,111,112,113,114,115,150,151,152,153,154,155,
            //     190,191,192,193,194,195,231,232,233,234,235,271,272,273,274,275,312,313,314,315,352,353,354,355,393,394,395,
            //     433,434,435,473,474,475,512,513,514,515,552,553,591,592,631, 670, 904, 941,942,943,982, 835, 874, 913, 952, 991, 1030,
            //     1030, 1069, 1108, 1147,1148, 1187,1188, 1228, 1259,1260,1298,1299,1300,1301,1337,1338,1339,1340,1341,1342,
            //     91, 131,132, 171,172, 211,212,213,251,252,253,291,292,293, 331,332,333,371,372,411, 451, 491, 531, 571, 611, 651, 652, 691, 692, 731, 732,
            //     771,772,773, 811,812,813,814, 851,852,853,854,855,891, 931, 971,972, 1011,1012,1013, 1051,1052,1053,1054, 1091,1092,1093,1094,1095, 1131,1132,1133,1134,
            //     1171,1172,1173,1211,1212,1251,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1360,1361,1362,1363,1364,1365,1366,1367,1368,1400,1401,1402,1403,1404,1405,1406,1407,
            //     1440,1441,1442,1443,1444,1445,1446,1480,1481,1482,1483,1484,1485,1520,1521,1522,1523,1524,1560,1561,1562,1563,1412, 1451,1452, 1490,1491,1492,
            //     1529,1530,1531,1532,1568,1569,1570,1571,1572,1564,1565,1566,1567, 294, 412];
                let rejectArray = [];
            // for (let i = 0; i<1600 ; i += 40){
            //
            //     let zone1 = i;
            //     let zone2 = 36 + i;
            //     let zone3 = 1373 + i;
            //
            //     // zone 1
            //     for (let k = 0; k<=10; k ++){
            //         if (i < 1290){
            //             rejectArray.push(zone1 + k);
            //         }
            //     }
            //
            //     // zone 2
            //     for (let k = 0; k<=3; k ++){
            //         if (i < 1359){
            //             rejectArray.push(zone2 + k);
            //         }
            //     }
            //
            //     // zone 3
            //     for (let k = 0; k<=26; k ++){
            //         rejectArray.push(zone3 + k);
            //     }
            // }

            fixArray = arrayImages.filter((image, key) =>{
                return (rejectArray.indexOf(key) > -1) ? false : true;
            });
        };

        // init lat - lng avatars
        const innitArrayAvatar = function () {
            let avatars   = $('[data-avatar]');
            if (avatarLNArray.length){
                if (LastNineAvatar[0].length <= 9){
                    avatars.each((i ,e) => {
                        let avatar   = $(e);
                        if (i === 0 || i === 1 ){
                            let lng_Log  = {top : avatarLNArray[0].top, left : avatarLNArray[0].left};
                            avatar.css(lng_Log);
                        }else {
                            let lng_Log  = {top : avatarLNArray[i-1].top,  left : avatarLNArray[i-1].left};
                            avatar.css(lng_Log);
                        }
                    });
                }else {
                    avatars.each((i ,e) => {
                        let avatar   = $(e);
                        if (i === 0 || i === 1 || i === 2 ||i === 3 ||i === 4 ){
                            let lng_Log  = {top : avatarLNArray[0].top, left : avatarLNArray[0].left};
                            avatar.css(lng_Log);
                        }else {
                            let lng_Log  = {top : avatarLNArray[i-4].top,  left : avatarLNArray[i-4].left};
                            avatar.css(lng_Log);
                        }
                    });
                }
            }else {
                avatars.each((i ,e) => {
                    let avatar   = $(e);
                    let position = avatar.position();
                    let lng_Log  = {top : position.top+'px', left : position.left+'px'};
                    avatar.css(lng_Log);
                    avatarLNArray.push(lng_Log)
                });
            }

            avatars.addClass('avatar');
        };

        // moving avatar
        const avatarMoving = function () {

            if(LastNineAvatar[0].length <= 9){
                FirstMoving();
            }else {

                if (LastNineAvatar[0].length === 13){
                    let time1= 2500;
                    let time2= 2300;
                    let size = delegateSize*20;
                    let copyAvatarsMoved = [];
                    let imageUrl, newestName;
                    // if(LastNineAvatar[0].length > 8){
                    let avatar8 = Object.assign({height: ch * 0.1475,width: ch * 0.1475, 'margin-left':0,  'z-index': 3},avatarLNArray[8]);

                    $('[data-avatar=6]').animate({
                        opacity:1, left: arrayImages[0].left,
                        top: arrayImages[0].top, width: size,
                        height: size}, time1)
                        .animate(fixArray[indexAvatar], time2)
                        .removeClass('box-avatar');

                    imageUrl = LastNineAvatar[0] && LastNineAvatar[0][6] ? LastNineAvatar[0][6].avatar_url : '';
                    copyAvatarsMoved.push({imageUrl, LatLng : fixArray[indexAvatar]});
                    checkIndexImage();

                    $('[data-avatar=8]').animate({
                        opacity:1, left: arrayImages[21].left,
                        top:  arrayImages[21].top, width: size,
                        height:size}, time1)
                        .animate(fixArray[indexAvatar], time2)
                        .removeClass('box-avatar');

                    imageUrl = LastNineAvatar[0] && LastNineAvatar[0][8] ? LastNineAvatar[0][8].avatar_url : '';
                    copyAvatarsMoved.push({imageUrl, LatLng : fixArray[indexAvatar]});
                    checkIndexImage();

                    $('[data-avatar=10]').animate({
                        opacity:1, left: arrayImages[840].left,
                        top: arrayImages[840].top, width: size,
                        height: size}, time1)
                        .animate(fixArray[indexAvatar], time2)
                        .removeClass('box-avatar');

                    imageUrl = LastNineAvatar[0] && LastNineAvatar[0][10] ? LastNineAvatar[0][10].avatar_url : '';
                    copyAvatarsMoved.push({imageUrl, LatLng : fixArray[indexAvatar]});
                    checkIndexImage();

                    $('[data-avatar=12]').animate({
                        opacity:1, left: arrayImages[861].left,
                        top: arrayImages[861].top, width: size,
                        height: size}, time1)
                        .animate(fixArray[indexAvatar], time2)
                        .removeClass('box-avatar');

                    imageUrl = LastNineAvatar[0] && LastNineAvatar[0][12] ? LastNineAvatar[0][12].avatar_url : '/images/avatar-default.jpg';
                    copyAvatarsMoved.push({imageUrl, LatLng : fixArray[indexAvatar]});
                    checkIndexImage();


                    // time 1
                    // TimeoutRound1 = setTimeout(function () {
                    newestName = LastNineAvatar[0] && LastNineAvatar[0][3] ? LastNineAvatar[0][3].name : '';
                    setTimeout(function () {
                        $('.delegate-name').html(newestName);
                    }, timeAppendName);

                    $('[data-avatar=3]').show(timeMovingElement);
                    $('[data-avatar=13]').animate(avatarLNArray[6],timeMovingElement);
                    $('[data-avatar=11]').animate(avatarLNArray[4], timeMovingElement);
                    $('[data-avatar=9]').animate(avatarLNArray[2], timeMovingElement);
                    $('[data-avatar=7]').animate(avatarLNArray[1], timeMovingElement);
                    $('[data-avatar=4]').animate(avatar8, timeMovingElement).addClass('continue').removeClass('first');

                    // }, timeMovingElement);

                    // time 2
                    TimeoutRound2 = setTimeout(function () {
                        newestName = LastNineAvatar[0] && LastNineAvatar[0][2] ? LastNineAvatar[0][2].name : '';
                        setTimeout(function () {
                            $('.delegate-name').html(newestName);
                        }, timeAppendName);
                        $('[data-avatar=2]').show(timeMovingElement);
                        $('[data-avatar=4]').animate(avatarLNArray[6], timeMovingElement);
                        $('[data-avatar=13]').animate(avatarLNArray[4], timeMovingElement);
                        $('[data-avatar=11]').animate(avatarLNArray[2], timeMovingElement);
                        $('[data-avatar=9]').animate(avatarLNArray[1], timeMovingElement);
                        $('[data-avatar=7]').animate(avatarLNArray[3], timeMovingElement);
                        $('[data-avatar=3]').animate(avatar8, timeMovingElement).addClass('continue').removeClass('first');

                    }, timeMovingElement);

                    // time 3
                    TimeoutRound3 = setTimeout(function () {
                        newestName = LastNineAvatar[0] && LastNineAvatar[0][1] ? LastNineAvatar[0][1].name : '';
                        setTimeout(function () {
                            $('.delegate-name').html(newestName);
                        }, timeAppendName);
                        $('[data-avatar=1]').show(timeMovingElement);
                        $('[data-avatar=3]').animate(avatarLNArray[6], timeMovingElement);
                        $('[data-avatar=4]').animate(avatarLNArray[4], timeMovingElement);
                        $('[data-avatar=13]').animate(avatarLNArray[2], timeMovingElement);
                        $('[data-avatar=11]').animate(avatarLNArray[1], timeMovingElement);
                        $('[data-avatar=9]').animate(avatarLNArray[3], timeMovingElement);
                        $('[data-avatar=7]').animate(avatarLNArray[5], timeMovingElement);
                        $('[data-avatar=2]').animate(avatar8, timeMovingElement).addClass('continue').removeClass('first');

                    }, timeMovingElement*2);

                    // time 4
                    TimeoutRound4 = setTimeout(function () {
                        newestName = LastNineAvatar[0] && LastNineAvatar[0][0] ? LastNineAvatar[0][0].name : '';
                        setTimeout(function () {
                            $('.delegate-name').html(newestName);
                        }, timeAppendName);
                        $('[data-avatar=0]').show(timeMovingElement);
                        $('[data-avatar=2]').animate(avatarLNArray[6], timeMovingElement);
                        $('[data-avatar=3]').animate(avatarLNArray[4], timeMovingElement);
                        $('[data-avatar=4]').animate(avatarLNArray[2], timeMovingElement);
                        $('[data-avatar=13]').animate(avatarLNArray[1], timeMovingElement);
                        $('[data-avatar=11]').animate(avatarLNArray[3], timeMovingElement);
                        $('[data-avatar=9]').animate(avatarLNArray[5], timeMovingElement);
                        $('[data-avatar=7]').animate(avatarLNArray[7], timeMovingElement);
                        $('[data-avatar=1]').animate(avatar8, timeMovingElement).addClass('continue').removeClass('first');

                        // remove lastNineAvatar was rendered
                        LastNineAvatar.shift();

                    }, timeMovingElement*3);

                    setTimeout(function () {
                        // add 4 avatar were moved in logo
                        copyAvatarsMoved.forEach(function (e, i) {
                            addSmallAvatar(e.imageUrl, e.LatLng);
                        });
                    }, time1 + time2);
                }
            }
        };

        const FirstMoving = function () {

            let avatar8 = Object.assign({height: ch * 0.1475,width: ch * 0.1475, 'margin-left':0,  'z-index': 3},avatarLNArray[8]);

            $('[data-avatar=0]').show(timeMovingElement);
            $('[data-avatar=13]').animate(avatarLNArray[6],timeMovingElement);
            $('[data-avatar=11]').animate(avatarLNArray[4], timeMovingElement);
            $('[data-avatar=9]').animate(avatarLNArray[2], timeMovingElement);
            $('[data-avatar=7]').animate(avatarLNArray[1], timeMovingElement);
            $('[data-avatar=6]').animate(avatarLNArray[3], timeMovingElement);
            $('[data-avatar=8]').animate(avatarLNArray[5], timeMovingElement);
            $('[data-avatar=10]').animate(avatarLNArray[7], timeMovingElement);
            $('[data-avatar=1]').animate(avatar8, timeMovingElement).addClass('continue').removeClass('first');

            // remove lastNineAvatar was rendered
            LastNineAvatar.shift();
        };

        const checkIndexImage = function () {
            if (indexAvatar >= 695){
                append = true;
                indexAvatar = 300;
            }else {
                indexAvatar++;
            }
        };

        // render new avatar
        const renderNewAvatars = function () {

            let rightBox =  $('.new-right-box');
            let compiled = _.template($('#avatar-template').html());

            rightBox.html(compiled({avatars: LastNineAvatar[0]}));

            rightBox.css({'height': hright + 'px', 'margin-top': (ch * 0.015) + 'px'});
            $('.new-right-box .first').css({'height': ch * 0.25 + 'px','width': ch * 0.25 + 'px', 'margin-bottom': ch * 0.0175 + 'px', 'margin-left': ch * 0.0175 + 'px'});

            $('.new-right-box .continue').css({'width' : ch * 0.1475 + 'px', 'height': ch * 0.1475 + 'px', 'margin-bottom': ch * 0.018 + 'px'});

            let newestName = '';
            if(LastNineAvatar[0].length <= 9) {
                newestName = LastNineAvatar[0] && LastNineAvatar[0][0] ? LastNineAvatar[0][0].name : '';
            }else {
                newestName = LastNineAvatar[0] && LastNineAvatar[0][4] ? LastNineAvatar[0][4].name : '';
            }

            setTimeout(function () {
                $('.delegate-name').html(newestName);
            }, timeAppendName);

            innitArrayAvatar();

        };
        let numberChange = 0;

        const getLastThirteenAvatars = function () {
            numberChange = 0;
            // console.log('getLastNineAvatars');
            $.get('newDelegates.json', {}).then(function (res) {
                // readTextFile("file:///C:/DORE/127.0.0.1_8000/newDelegates");
                if(res.response_code === 200){
                    let newDelegates = res.data;
                    let count  = newDelegates.length;
                    // res.data.splice(0, 5);
                    if (count >= 9){
                        firstTimeFlag1 = false;
                    }else {
                        firstTimeFlag1 = true;
                    }

                    if (count > 9){
                        if (firstTimeFlag){
                            clearInterval(intervalTime);
                            intervalTime  = setInterval(runningScreen, totalMoving+500);
                        }
                        firstTimeFlag = false;
                    }else {
                        firstTimeFlag = true;
                    }

                    LastNineAvatar.push(res.data);
                }
            });
        };

        // render  delegates's small avatars were checked in logo;
        const renderSmallAvatars = function () {

            $.get('delegatesChecked.json', {}).then(function (res) {
               if (res.response_code === 200){
                   return res.data
               }else {
                   return [];
               }
            }).then(function (delegates) {
                // console.log('renderSmallAvatars',delegates);

                if (delegates.length > 9){
                    firstTimeFlag = false;
                }else{
                    firstTimeFlag = true;
                }

                delegates.forEach((e, i) => {
                    if (!append){
                        let latLng = JSON.stringify(fixArray[indexAvatar]);
                        latLng = latLng.split('"').join('');
                        latLng = latLng.split(',').join(';');
                        latLng = latLng.slice(1, -1);
                        images += '<img class="avatar-sm" src="'+e.avatar_url+'" style="'+latLng+'"/>';
                        if (indexAvatar >= 695){
                            append = true;
                            indexAvatar = 300;
                        }else {
                            indexAvatar++;
                        }
                    }
                });
                $('.box-four-star').append(images);
            });
        };

        //add small avatar in logo
        const addSmallAvatar = function (image , lagLng) {
            if (append){
                return false;
            }
            let e = JSON.stringify(lagLng);
            e = e.split('"').join('');
            e = e.split(',').join(';');
            e = e.slice(1, -1);
            images = '<img class="avatar-sm" src="'+image+'" style="'+e+'"/>';
            $('.box-four-star').append(images);
        };

        const runningScreen = function () {
            if (LastNineAvatar.length){
                if(!movingFlag){
                    movingFlag = true;
                }else {
                    // console.log('runningScreen');
                    clearAllTimeout();
                    renderNewAvatars();
                    movingTimeout = setTimeout(avatarMoving, 500)
                }
            }
        };

        const clearAllTimeout = function () {
            clearTimeout(TimeoutRound1);
            clearTimeout(TimeoutRound2);
            clearTimeout(TimeoutRound3);
            clearTimeout(TimeoutRound4);
            clearTimeout(movingTimeout)
        };


        initArrayImage();

        innitArrayAvatar();

        renderSmallAvatars();

        getLastThirteenAvatars();

        let intervalTime;
        setTimeout(function () {
            clearInterval(intervalTime);
            if (firstTimeFlag){
                intervalTime  = setInterval(runningScreen, timeMovingElement + 500);
            }else {
                intervalTime = setInterval(runningScreen, totalMoving +500);
            }
        }, 2000);

        setInterval(function () {
            if (LastNineAvatar.length > 1){
                if (!isChecking){
                    $('.new-right-box').empty();
                    $('.delegate-name').empty();
                }else{
                    isChecking = false;
                }
            }
        }, 30000);

        // initial use firebase
        firebase.initializeApp(FIREBASE_CONF);

        let database = firebase.database();

        let changed = false;

        // listen when having person checkin
        let changeScore  = database.ref('daihoidoan/checkin');

        changeScore.on('child_changed', function(snapshot) {
            changed    = true;
            isChecking = true;
            if ((numberChange === 3 && !firstTimeFlag1) || firstTimeFlag1){
                console.log(firstTimeFlag,firstTimeFlag1, 1, numberChange, 'child_changed');
                getLastThirteenAvatars();
            } else  {
                console.log(firstTimeFlag,firstTimeFlag1,2,  numberChange, 'child_changed');
                numberChange++;
            }
        });

        changeScore.on('child_added', function(snapshot) {
            if (!changed){
                changed    = true;
                isChecking = true;
                if ((numberChange === 3 && !firstTimeFlag1) || firstTimeFlag1){
                    console.log(firstTimeFlag,firstTimeFlag1, 1, numberChange, 'child_added');
                    getLastThirteenAvatars();
                } else  {
                    console.log(firstTimeFlag,firstTimeFlag1,2, numberChange, 'child_added');
                    numberChange++;
                }
            }
        });

    })
}(window.jQuery));