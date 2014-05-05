!function(){
    var isLoadedMap = isLoadedData = false;
    var _hideLoading = function(){
        try{
            if(isLoadedMap && isLoadedData){
                window.android.hideLoading();
            }
        }catch(e){}
    }
    var getAlarmInfo = (function(){
        var yjlb = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰'];
        var gdlb = ['寒冷', '灰霾', '雷雨大风', '森林火险', '降温', '道路冰雪','干热风','低温','冰冻'];
        var yjyc = ['蓝色', '黄色', '橙色', '红色'];
        var gdyc = ['白色'];
        //得到预警描述及等级
        var REG = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})\.html/;
        return function(data){
            var m = REG.exec(data[1]);
            var result = {};
            if(m){
                var textIndex = parseInt(m[7],10);
                var text = '';
                if(textIndex > 90){
                    text = gdlb[textIndex-91];
                }else{
                    text = yjlb[textIndex - 1];
                }

                var level = '';
                var levelIndex = parseInt(m[8],10);
                if(levelIndex > 90){
                    level = gdyc[levelIndex - 91];
                }else{
                    level = yjyc[levelIndex - 1];
                }

                var val = data[0]+m[1]+'年'+m[2]+'月'+m[3]+'日'+m[4]+'时'+m[5]+'分发布'+text+level+'预警';
                var img = '';
                if(level > 90 ||textIndex > 90){
                    img = '0000';
                }else{
                    img = m[7]+m[8];
                }
                result.text = data[0]+'气象台发布'+text+level+'预警';
                result.time = m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':'+m[5]+':'+m[6];
                result.img = 'http://www.weather.com.cn/m/i/alarm_s/'+img+'.gif';
            }
            return result
        }
    })();
    var AlarmOverlay = (function(){
        function AlarmOverlay(lon,lat,icon,data){//point,icon,text
            this._point = new BMap.Point(lon, lat);
            this._icon = icon;
            this._data = data;
        }
        AlarmOverlay.prototype = new BMap.Overlay();
        AlarmOverlay.prototype.initialize = function(map){
            var _this = this;
            _this._map = map;
            var $div = $('<div>').addClass('alarmOverlay').html('<img src="'+this._icon+'"/><b></b>')
            // .click(function(){
            //     console.log(_this._data);
            // });
            var div = $div.get(0);
            _this._div = div;
            map.getPanes().labelPane.appendChild(div);
            return div;
        }
        AlarmOverlay.prototype.draw = function(){
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x + "px";
            this._div.style.top  = pixel.y + "px";
        }
        AlarmOverlay.prototype.remove = function(){
            $(this._div).remove();
        }
        return AlarmOverlay;
    })();
    var map = new BMap.Map("map");
    var currentZoom = 5;
    map.setMinZoom(5);
    map.setMaxZoom(14);
    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    map.centerAndZoom(new BMap.Point(120.408836,36.899005), currentZoom);
    map.addEventListener("tilesloaded",function(){
        isLoadedMap = true;
        _hideLoading();
    });
    // map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    // map.addControl(new BMap.ScaleControl());                    // 添加默认比例尺控件
    $.getScript('http://product.weather.com.cn/alarm/grepalarmBox.php?areaid=[\\d]{5,9}&type=[0-9]{2}&count=-1',function(){
    // $.getScript('data/allalarm.html',function(){
        var $alarm_list = $('#alarm_list');
        if(alarminfo && alarminfo.count > 0 && alarminfo.data.length > 0){
            var toShowNum = 6;
            var cache = {};
            var html = '';
            $.each(alarminfo.data,function(i,v){
                var data = getAlarmInfo(v);
                var lon = v[2],
                    lat = v[3];
                if(cache[lon+'_'+lat]){
                    lon += Math.random();
                    lat += Math.random();
                }
                cache[lon+'_'+lat] = true;
                map.addOverlay(new AlarmOverlay(lon, lat,data.img,v));
                if(toShowNum-- >=0){
                    html += '<li><img src="'+data.img.replace('alarm_s','alarm_m')+'"/><span>'+data.text+'<br/>'+data.time+'</span></li>';
                }
            });
            $alarm_list.find('div span').text('目前正在生效预警'+alarminfo.count+'个');
            $alarm_list.find('ul').html(html)
        }else{
            $alarm_list.find('ul').html('<li>暂时没有预警信息</li>');
        }
        $alarm_list.show();
        isLoadedData = true;
        _hideLoading();
    });
}();