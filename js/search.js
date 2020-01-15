

var map;
var cityinfo;

var Map = (function(){
    var init = function () {
        $('.dropdown-toggle').dropdown();
        //监听导航栏
        listenNav();
        initMap();
    }

    var initMap = function () {
        //获取用户所在城市信息
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    cityinfo = result;
                    var citybounds = result.bounds;
                    //初始化地图实例
                    map = new AMap.Map('container', {
                        zoom: 10,
                        resizeEnable: true,
                    });
                    //地图显示当前城市
                    map.setBounds(citybounds);
                }
            }
        });
    }
    //监听导航栏
    var listenNav = function () {
        $('.click-item').on("click", function(){
            $(".nav-li").removeClass("active");
            if( $(this).hasClass("nav-li") ){
                $(this).addClass("active");
            }else{
                $(this).parents(".nav-li").addClass("active");
            }
            //根据选中内容切换模块
            var key = $(this).data("key") || "";
            toggleShowModule(key);

        });
    }

    //模块切换
    var toggleShowModule = function (key) {
        $(".filtercanvas").addClass("hide");
        $("."+key).removeClass("hide");
        // 清除标记
        initMap();
    }

    return {
        init: init
    }
})()

$(document).ready(function(){
    Map.init();
});


















