var map = new AMap.Map('container', {
    zoom: 13,
    resizeEnable: true,
});

AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
    var poiPicker = new PoiPicker({
        //city:'北京',
        input: 'searchipt'
    });
    //初始化poiPicker
    poiPickerReady(poiPicker);
});
var marker;
function poiPickerReady(poiPicker) {

    window.poiPicker = poiPicker;

    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {
        var poi = poiResult.item;
        //输入框回填选中的值
        document.getElementById("searchipt").value = poi.name;
        var placeSearch = new AMap.PlaceSearch({
            city: '', // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            pageSize: 10, // 单页显示结果条数
            children: 0, //不展示子节点数据
            pageIndex: 1, //页码
            extensions: 'base' //返回基本地址信息
        });
        //详情查询
        placeSearch.getDetails(poi.id, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                placeSearch_CallBack(result);
            }
        });
        var infoWindow = new AMap.InfoWindow({
            autoMove: true,
            offset: {x: 0, y: -30}
        });
        //回调函数
        function placeSearch_CallBack(data) {
            var poiArr = data.poiList.pois;
            if( marker != undefined){
                map.remove(marker);
            }

            //添加marker
            marker = new AMap.Marker({
                map: map,
                position: poiArr[0].location
            });
            map.setCenter(marker.getPosition());
            infoWindow.setContent(createContent(poiArr[0]));
            infoWindow.open(map, marker.getPosition());
        }
        function createContent(poi) {  //信息窗体内容
            var s = [];
            s.push("<b>名称：" + poi.name+"</b>");
            s.push("地址：" + poi.address);
            s.push("电话：" + poi.tel);
            s.push("类型：" + poi.type);
            return s.join("<br>");
        }

    });

}

//输入提示
var auto = new AMap.Autocomplete({
    input: "tipinput"
});

AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
function select(e) {
    placeSearch.setCity(e.poi.adcode);
    placeSearch.search(e.poi.name);  //关键字查询查询
}


//根据cityname、adcode、citycode设置地图位置
function gotoCity() {
    var val = document.querySelector('#city-name').value; //可以是cityname、adcode、citycode
    if (!val) {
        val = "北京市";
    }
    map.setCity(val);
}

//指定城市---绑定查询点击、回车事件
document.querySelector('#query').onclick = gotoCity;
document.querySelector('#city-name').onkeydown = function(e) {
    if (e.keyCode === 13) {
        gotoCity();
        return false;
    }
    return true;
};

//实时路况图层
var trafficLayer = new AMap.TileLayer.Traffic({
    zIndex: 10
});

trafficLayer.setMap(map);
trafficLayer.hide();
var isVisible = false;
document.getElementById('lukaung-btn').onclick = function(e){
    if (isVisible) {
        trafficLayer.hide();
        isVisible = false;
        e.target.innerHTML = "显示实时路况";
    } else {
        trafficLayer.show();
        isVisible = true;
        e.target.innerHTML = "隐藏实时路况";
    }
};


