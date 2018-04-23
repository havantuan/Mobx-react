/**
 * Created by nhund on 05/12/2017.
 */

(function ($) {
  $(function () {
    let photos = [];
    let thinkings = [];
    let setIntervalThinking;
    let setIntervalPosting;

    const getPosting = function () {
      $.ajax({
        url: "http://api-trade.dev.dore.vn/api/v1/graph",
        type: "post",
        data: JSON.stringify({query: "{SlidePosts {Content CreatedBy {Name Avatar {Url}} Images {Url}}}", variables: null, operationName: null}),
        contentType: "application/json",
        dataType: 'json',
        success: function (res) {
          if(res && res.data){
            res.data.SlidePosts.map((e, i) => {
              if(e && Array.isArray(e.Images)) {
                e.Images.forEach(val => photos.push(val.Url))
              }
            });
          }
          setIntervalPosting = setInterval(function () {
            renderPosting();
          }, 15000)
        }
      })
    }

    const getDelegateThinking = function () {
      $.ajax({
        url: "http://api-trade.dev.dore.vn/api/v1/graph",
        type: "post",
        data: JSON.stringify({query: '{SlidePosts (GroupCode: "THINK"){Content CreatedBy {Name Avatar {Url}}}}', variables: null, operationName: null}),
        contentType: "application/json",
        dataType: 'json',
        success: function (res) {
          if(res && res.data){
            thinkings = res.data.SlidePosts;
          }
          console.log('%c thfafaaf', 'color: #00b33c', thinkings)
          setIntervalPosting = setInterval(function () {
            renderDelegateThinking();
          }, 15000)
        }
      })
    };

    const renderDelegateThinking = function () {

      let postingTemplate = $('#thinking-template');
      let postingContent = $('#thinking-union');
      let compiled = _.template(postingTemplate.html());

      let currentThinking = thinkings.slice(0, 5);

      postingContent.html(compiled({thinkings: currentThinking}));

      $('.box-heart').css({'height': +'px', 'margin-bottom': heightContainer * 0.017 + 'px'});

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

      thinkings.splice(0, 5);
    };

    const renderPosting = function () {
      let photoTemplate = $('#photo-template');
      let photoContent = $('#photo-union');
      let compiled = _.template(photoTemplate.html());
      let currentPhotos = photos.slice(0, 16);
      photoContent.html(compiled({photos: currentPhotos}));
      photos.splice(0, 16);
    };
    setInterval(function () {
      // console.log(thinkings, photos);
      if (thinkings.length <= 4) {
        clearInterval(setIntervalThinking);
         getDelegateThinking();
      }

      if (photos.length <= 14) {
        clearInterval(setIntervalPosting);
         getPosting()
      }
    }, 5000);
    getPosting();
     getDelegateThinking()
  });
}(window.jQuery));