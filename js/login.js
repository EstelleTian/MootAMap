
var Login = function () {

    var isLogin = false;


    var init = function () {

        initEvent();

        exchengeLogin();
    }

    var initEvent = function () {
        $('.avatar').on('click',function () {
            var $user = $('.user-panel');
            if($user.is(':visible')){
                $user.hide();
            }else {
                $user.show();
            }
        });

        $('.shenfen').on('click',function () {
            $('.shenfen-list').show();
        })
        $('.shenfen-list').on('click','a',function (e) {
            e.stopPropagation();
            $('.shenfen-list a').removeClass('select');
            $($(this)).addClass('select');
            var val = $(this).attr('data-key');
            $('.shenfen-val').text(val);
            $('.shenfen-list').hide();
        })


    };


    var exchengeLogin = function () {
        var box =  $('#loginbox');
        if(isLogin){
            $('.login-banner', box).show();
        }else {
            $('.login-banner', box).hide();
        }
    }

    return {
        init: init
    }
}();


$(document).ready(function(){
    Login.init();
});

