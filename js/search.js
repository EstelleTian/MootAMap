

var map;
var cityinfo;
var driving;
var transfer;
var walking;

var Map = (function(){
    var init = function () {
        $('.dropdown-toggle').dropdown();
        // var now = $.getFullTime(new Date());
        $('.startDate').datetimepicker();
        //监听导航栏
        listenNav();
        initMap();
        //监听选中模块
        listenItemClick();
        //监听线路规划
        listenRoute();
    }

    var initMap = function ( key ) {
        $("#poiInfo").html("");
        $("#routeInfo").html("");
        $("#dir_from_ipt").val("");
        $("#dir_to_ipt").val("");
        //初始化地图实例
        map = new AMap.Map('container', {
            resizeEnable: true,
        });

        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                    var addressComponent = result.addressComponent;
                    cityinfo = addressComponent;
                    var position = result.position;
                    var lng = position.lng;
                    var lat = position.lat;
                    var center = [];
                    center.push(lng);
                    center.push(lat);
                    map.setCenter(center);
                    if( key == "lukuang"){
                        //实时路况图层
                        var trafficLayer = new AMap.TileLayer.Traffic({
                            zIndex: 10
                        });
                        trafficLayer.setMap(map);
                    }else if( key == "jingzhanggaotie"){
                       var driving1 = new AMap.Driving({
                            map: map,
                            panel: ""
                        });
                        // 根据起终点名称规划驾车导航路线
                        driving1.search([
                            {keyword: "北京北站", city:''},
                            {keyword: "张家口站", city:''}
                        ], function(status, result) {
                            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                            if (status === 'complete') {
                                console.log('完成')
                            } else {
                                console.log('失败：' + result)
                            }
                        });
                    }else if( key == "jichangbashi"){
                        //地铁图
                        // $(".ditietu").show();
                       // var driving2 = new AMap.Driving({
                       //      map: map,
                       //      panel: ""
                       //  });
                       //  // 根据起终点名称规划驾车导航路线
                       //  driving2.search([
                       //      {keyword: "北京航空航天大学", city:''},
                       //      {keyword: "北京首都机场", city:''}
                       //  ], function(status, result) {
                       //      // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                       //      if (status === 'complete') {
                       //          console.log('完成')
                       //      } else {
                       //          console.log('失败：' + result)
                       //      }
                       //  });
                    }else if( key == "bancheshike" ){
                        var driving2 = new AMap.Driving({
                             map: map,
                             panel: ""
                         });
                         // 根据起终点名称规划驾车导航路线
                         driving2.search([
                             {keyword: "北京航空航天大学", city:''},
                             {keyword: "北京首都机场", city:''}
                         ], function(status, result) {
                             // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                             if (status === 'complete') {
                                 console.log('完成')
                             } else {
                                 console.log('失败：' + result)
                             }
                         });
                    }
                }else{
                    console.log(result)
                }
            });
        });


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
                        zoom: 12,
                        resizeEnable: true,
                    });
                    //地图显示当前城市
                    // map.setBounds(citybounds);
                    if( key == "lukuang"){
                        //实时路况图层
                        var trafficLayer = new AMap.TileLayer.Traffic({
                            zIndex: 10
                        });
                        trafficLayer.setMap(map);
                    }
                }
            }
        });
    }
    //监听线路规划
    var listenRoute = function () {
        $(".palntype_tab.icondirtip").on("click", function(){
            $(".palntype_tab.icondirtip").removeClass("current");
            $(this).addClass("current");
        });

        //路径交换
        $("#dir_exchange").on("click", function(){
            var frominput = $("#dir_from_ipt");
            var toinput = $("#dir_to_ipt");
            var fromVal = frominput.val();
            var toVal = toinput.val();
            frominput.val(toVal);
            toinput.val(fromVal);
            activeRouteSearch();
        });

//查询按钮
        function activeRouteSearch(){
            var frominput = $("#dir_from_ipt");
            var toinput = $("#dir_to_ipt");
            var fromVal = frominput.val();
            var toVal = toinput.val();
            var type = $(".palntype_tab.icondirtip.current").data('type');
            // $(".time-select .form-control").val()
            if( type == "car"){
                //构造路线导航类
                if( driving != undefined){
                    driving.clear();
                    $("#routeInfo").html("");
                }
                driving = new AMap.Driving({
                    map: map,
                    panel: "routeInfo"
                });
                // 根据起终点名称规划驾车导航路线
                driving.search([
                    {keyword: fromVal, city:''},
                    {keyword: toVal, city:''}
                ], function(status, result) {
                    // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                    if (status === 'complete') {
                        console.log('绘制驾车路线完成')
                    } else {
                        console.log('获取驾车数据失败：' + result)
                    }
                    setTimeout(function(){
                        $(".amap-call").remove();
                    }, 500)
                });
            }else if( type == 'bus'){
                var transOptions = {
                    map: map,
                    city: cityinfo.citycode,
                    panel: 'routeInfo',
                    policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                };
                if( transfer != undefined){
                    transfer.clear();
                    $("#routeInfo").html("");
                }
                //构造公交换乘类
                transfer = new AMap.Transfer(transOptions);
                //根据起、终点名称查询公交换乘路线
                transfer.search([
                    {keyword: fromVal, city:''},
                    {keyword: toVal, city:''}
                ], function(status, result) {
                    // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
                    if (status === 'complete') {
                        console.log('绘制公交路线完成')
                    } else {
                        console.log('公交路线数据查询失败' + result)
                    }
                    setTimeout(function(){
                        $(".amap-call").remove();
                        $(".planTitle ul.clearfix").remove();
                    }, 500)

                });
            }else if( type == 'walk'){
                if( walking != undefined){
                    walking.clear();
                    $("#routeInfo").html("");
                }
                //步行导航
                walking = new AMap.Walking({
                    map: map,
                    panel: "routeInfo"
                });
                walking.search([
                    {keyword: fromVal, city:''},
                    {keyword: toVal, city:''}
                ], function(status, result) {
                    // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
                    if (status === 'complete') {
                        console.log('绘制步行路线完成')
                    } else {
                        console.log('步行路线数据查询失败' + result)
                    }
                    setTimeout(function(){
                        $(".amap-call").remove();
                        // $(".planTitle ul.clearfix").remove();
                    }, 500)
                });
            }

        }
        $(".dir_submit").on("click", activeRouteSearch);
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


    //监听选中模块
    var listenItemClick = function(){
        function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
        }

        //快捷名称选择
        $(".recommend-c .keyfilter-item").on("click", function(){
            var html = $(this).attr("keyword");
            if(html != ""){
                AMap.service(["AMap.PlaceSearch"], function() {
                    var placeSearch = new AMap.PlaceSearch({
                        pageSize: 7, // 单页显示结果条数
                        pageIndex: 1, // 页码
                        city: cityinfo.citycode, // 兴趣点城市
                        citylimit: true,  //是否强制限制在设置的城市内搜索
                        map: map, // 展现结果的地图实例
                        panel: "poiInfo", // 结果列表将在此容器中进行展示。
                        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                    });

                    //关键字查询
                    placeSearch.search(html);
                })

            }
        })
    }
    //模块切换
    var toggleShowModule = function (key) {
        $(".filtercanvas").addClass("hide");
        $("."+key).removeClass("hide");
        // 清除标记
        initMap(key);

    }

    return {
        init: init
    }
})()

$(document).ready(function(){
    Map.init();
});


















