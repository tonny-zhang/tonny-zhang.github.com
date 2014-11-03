!function(){
    var isLoadedMap = isLoadedData = false;
    var _hideLoading = function(){
        try{
            if(isLoadedMap && isLoadedData){
                window.android.hideLoading();
            }
        }catch(e){}
    }
	 /*自定义覆盖物*/
    ;(function(global){
        var isCanSeeAllData = true;
        /*配色方案*/
        var COLOR = {
            'precipitationb1h': function(val){
                val = parseFloat(val);
                if(val >= 0 && val < 1){
                    return 'js_1';
                }else if(val >= 1 && val < 10){
                    return 'js_2';
                }else if(val >= 10 && val < 25){
                    return 'js_3';
                }else if(val >= 25 && val < 50){
                    return 'js_4';
                }else if(val >= 50){
                    return 'js_5';
                }
            },
            'temp': function(val){
                val = parseFloat(val);
                return val > 0?'temp_1':val == 0?'temp_2':'temp_3'
            },
            'hnmidity': function(val){
                // return '#000';
                val = parseFloat(val);
                if(val >= 0 && val < 10){
                    return 'shidu_1';
                }else if(val >= 10 && val < 30){
                    return 'shidu_2';
                }else if(val >= 30 && val < 50){
                    return 'shidu_3';
                }else if(val >= 50){
                    return 'shidu_4';
                }
            }
        };
        var UNIT = {
            temp: '℃',
            maxtemp: '℃',
            mintemp: '℃',
            hnmidity: '%',
            pressure: 'hPa',
            windspeed: 'm/s',
            precipitationb1h: 'mm',
            visibility: 'm'
        }
        var BLANK = '&nbsp;&nbsp;&nbsp;&nbsp;';
        var ILLEGAL_TEXT = {
            temp: BLANK,
            maxtemp: BLANK,
            mintemp: BLANK,
            hnmidity: BLANK,
            pressure: BLANK,
            windspeed: '0m/s',
            precipitationb1h: '0mm',
            visibility: BLANK
        }
        function getShowTextFromData(data){
            var d = data[showDataKey];
            if(!isNaN(d)){
                d = parseFloat(d);
            }
            if(showDataKey == 'winddirection'){
                d = parseWind(data,showDataKey);
            }
            return d + (UNIT[showDataKey] || '');
        }
        function parseWind(data,type){
            var txt = '';
            var direc = data.winddirection;
                if(direc == 0 || direc == 360){
                    txt = '↓'
                }else if(direc == 90){
                    txt = '←';
                }else if(direc == 180){
                    txt = '↑';
                }else if(direc == 270){
                    txt = '→';
                }else if(direc > 0 && direc < 90){
                    txt = '↙';
                }else if(direc > 90 && direc < 180){
                    txt = '↖';
                }else if(direc > 180 && direc < 270){
                    txt = '↗';
                }else{//270 - 360
                    txt = '↘';
                }
            return '&nbsp;'+txt + '&nbsp;';
        }
        function parseWindText(data){
            var txt = '';
            var direc = data.winddirection;
                if(direc == 0 || direc == 360){
                    txt = '北风'
                }else if(direc == 90){
                    txt = '东风';
                }else if(direc == 180){
                    txt = '南风';
                }else if(direc == 270){
                    txt = '西风';
                }else if(direc > 0 && direc < 90){
                    txt = '东北风';
                }else if(direc > 90 && direc < 180){
                    txt = '东南风';
                }else if(direc > 180 && direc < 270){
                    txt = '西南风';
                }else{//270 - 360
                    txt = '西北风';
                }
            return '&nbsp;'+txt + '&nbsp;';
        }
        function WeatherOverlay(data){//point,icon,text
            this._point = new BMap.Point(data.lon, data.lat);
            if(data.precipitationb1h == 0){
                data.precipitationb1h = 999999;
            }
            // this._icon = icon;
            // this._text = text;
            this.data = data;
        }
        function isLegal(val){
            return !/999\d{3}/.test(val);
        }
        var TIME_REG = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/
        function formateTime(time){
        	var m = TIME_REG.exec(time);
        	if(m){
        		time = m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':'+m[5];
        	}
        	return time;
        }
        WeatherOverlay.prototype = new BMap.Overlay();
        var BLANK = '&nbsp;&nbsp;&nbsp;&nbsp;'
        WeatherOverlay.prototype.initialize = function(map){
            this._map = map;
            var data = this.data;
            var info = '';
            if(isCanSeeAllData){
                info += '<ul>';
                var str = '';
                if(data.cityName){
                    str = data.cityName+'&nbsp;&nbsp;';
                }
                if(data.weather){
                    str += data.weather
                }
                if(str){
                    info += '<li>'+str+'</li>';
                    str = '';
                }
                    
                // if(data.isStation){
                //     info += '<li>站号:'+data.stationid+'</li>';
                // }
                if(isLegal(data.stationheight)){
                    str = '经度:'+data.lon+BLANK;
                }
                if(isLegal(data.stationheight)){
                    str += '纬度:'+data.lat;
                }
                if(str){
                    info += '<li>'+str+'</li>';
                    str = '';
                }
                if(isLegal(data.temp)){
                    str = '温度:'+data.temp+'℃'+BLANK;
                }
                if(isLegal(data.hnmidity)){
                    str += '相对湿度:'+data.hnmidity+'%';
                }
                if(str){
                    info += '<li>'+str+'</li>';
                    str = '';
                }
                if(isLegal(data.stationheight)){
                    str = '海拔:'+data.stationheight+'米'+BLANK;
                }
                
                if(isLegal(data.pressure)){
                    str += '本站气压:'+data.pressure+'百帕';
                }
                if(str){
                    info += '<li>'+str+'</li>';
                    str = '';
                }
                if(isLegal(data.winddirection)){
                    str = '风向:'+parseWindText(data)+BLANK;
                }
                if(isLegal(data.windspeed)){
                    str += '风速:'+data.windspeed+'米/秒';
                }
                if(str){
                    info += '<li>'+str+'</li>';
                    str = '';
                }
                if(isLegal(data.precipitationb1h)){
                    info += '<li>观测前1小时降水量:'+data.precipitationb1h+'mm</li>';
                }
                if(isLegal(data.maxtemp)){
                    info += '<li>24小时最高气温:'+data.maxtemp+'℃</li>';
                }
                if(isLegal(data.mintemp)){
                    info += '<li>24小时最低气温:'+data.mintemp+'℃</li>';
                }
                if(isLegal(data.ptime)){
                    info += '<li>更新时间:'+formateTime(data.ptime)+'</li>';
                }
                info += '</ul>';
            }
            var $span = $('<span></span>');
            if(data.isStation){
                $span.append('<a></a>');
            }
            $span.append('<i></i>').append('<b></b>');
            var $_div = $('<div></div>').append($span);
            
            var $div = $('<div></div>').addClass('weatherOverlay ').append($_div.append(info));
            // if(isCanSeeAllData){
            //     $div.on('mouseenter',function(){
            //         $div.addClass('on');
            //     }).on('mouseleave',function(){
            //         $div.removeClass('on');
            //     });
            // }
            
            var div = $div.get(0);
            map.getPanes().labelPane.appendChild(div);
            this._div = div;
            this.resetData();
            return div;
        }
        WeatherOverlay.prototype.draw = function(){
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x + "px";
            this._div.style.top  = pixel.y + "px";
        }
        WeatherOverlay.prototype.resetData = function(){
            var data = this.data;
            var colorFn = COLOR[showDataKey];
            var txt = getShowTextFromData(data);
            var $div = $(this._div).find('div');
            if(!isLegal(txt)){
            	txt = ILLEGAL_TEXT[showDataKey];
            }

            var color = '';
            if(colorFn){
                color = colorFn(txt);
            }
            $div.removeClass().addClass(color);
            var weather_code = this.data.weathercode;
            var weather_img = '';
            if(!isNaN(weather_code)){
                $div.removeClass('no_img');
                weather_img = '<img src="http://www.weather.com.cn/m/i/weatherpic/29x20/d'+parseInt(weather_code)+'.gif"/>';
                var $li = $div.find('ul li:first');
                $li.html('<img src="http://www.weather.com.cn/m2/i/icon_weather/50x36/d'+weather_code+'.gif"/>'+$li.text());
            }else{
                $div.addClass('no_img');
            }
            $div.find('span i').html(weather_img+txt);
            $div.find('span b').css('border-top-color',$div.css('background-color'));
            if(data.isStation && (isData_2 || this._map.getZoom() < 6) || (!data.isStation && isData_1)){
                $div.show();
            }else{
                $div.hide();
            }
            // }else{console.log(showDataKey,txt);
            //     // $div.hide();
            //     $div.find('span i').html(weather_img);
            // }
        }
        WeatherOverlay.prototype.remove = function(){
            $(this._div).remove();
        }
        WeatherOverlay.prototype.getDataHTML = function(){
            return $(this._div).find('ul').clone();
        }
        WeatherOverlay.prototype.beat = function(isBeat){
            var $div = $(this._div);
            if(isBeat){
                $div.addClass('beat');
            }else{
                $div.removeClass('beat');
            }
        }
        global.WeatherOverlay = WeatherOverlay;
    })(this);
    (function(global){
        var dataCache = {};
        var tt;
        var jqueryAjax;
        var _callback;
        var $loading = $('#loading');
        function loadData(url,callback){
            var data = dataCache[url];
             _callback = callback
            if(data){
                _callback && _callback(data);
            }else{
                clearTimeout(tt);
                tt = setTimeout(function(){
                    if(!$loading.is(':visible')){
                        $loading.show();
                    }
                    if(jqueryAjax){
                        jqueryAjax.abort();
                    }
                    $.ajax({
			             url:url,
			             dataType: "jsonp",
			             jsonp: "cb",
			             success: callback,
			             error: function(a,b,c){
	                        if(b != 'abort'){
	                            alert('加载数据出现错误！');
	                            // location.reload();
	                        }
	                    }
			        });
                },50);
            }
        }

        global.loadData = loadData;
    })(this);
    function initData(data){
        isLoadedData = true;
        _hideLoading();
        map && map.clearOverlays();
        var numArr = {};
        $.each(data,function(i,v){
            v.temp = parseInt(v.temp);
            v.hnmidity = parseInt(v.hnmidity);
            v.stationheight = parseInt(v.stationheight);
            var name = (''+v.ptime).substr(0,10);
            if(!numArr[name]){
                numArr[name] = 0;
            }
            numArr[name] ++;
            map.addOverlay(new WeatherOverlay(v));
        });

        // var maxNum = Number.MIN_VALUE;
        // var lastTime;
        // for(var i in numArr){
        //     var v = numArr[i];
        //     if(v > maxNum){
        //         maxNum = v;
        //         lastTime = i;
        //     }
        // }
        // if(lastTime){
        //     var m = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(lastTime);
        //     if(m){
        //         $('#data_time').text(m[1]+'年'+m[2]+'月'+m[3]+'日'+m[4]+'时').show();
        //     }else{
        //         $('#data_time').hide();
        //     }
        // }else{
        //     $('#data_time').hide();
        // }
        var typeArr = ['temp','pressure','hnmidity','windspeed','winddirection','precipitationb1h','visibility'];
        var typeName = {
            'temp': '温度',
            'pressure': '气压',
            'hnmidity': '相对湿度',
            'windspeed': '风速',
            'winddirection': '风向',
            'precipitationb1h': '降水量',
            'visibility': '能见度'
        };
        var currentType = 0,
        	numType = typeArr.length;
        var weatherOverlays = map.getOverlays(),
        	numOverlays = weatherOverlays.length;

        var filter = function(){
            var showIndex = Math.floor(Math.random()*numOverlays);
            for(var i = 0;i<numOverlays;i++){
                var _overlay = weatherOverlays[i];
                _overlay.beat(i == showIndex);
            }
            return weatherOverlays[showIndex];
            // for(var i = 0;i<numOverlays;i++){
            //     var overlay = weatherOverlays[i];
            //     if(overlay.data.stationid == 54511){
            //         return overlay;
            //     }
            // }
        }
        var toShowDataOverlay = filter();
        $('#info_list').fadeIn().find('ul').replaceWith(toShowDataOverlay.getDataHTML());
        var delay = 4000;
        var tt;
        var $c_type = $('#c_type');
        var fn = function(){
        	var nextType = currentType + 1 <= numType-1?currentType+1:0;
        	showDataKey = typeArr[nextType];
            var showTypeName = typeName[showDataKey];
            $c_type.text('('+showTypeName+')');
        	currentType = nextType;
        	$.each(weatherOverlays,function(i,v){
	            v.resetData();
	        });
        	toShowDataOverlay = filter();
        	var $html = toShowDataOverlay.getDataHTML();
        	$('#info_list ul').show().replaceWith($html);
        	clearTimeout(tt);
        	tt = setTimeout(fn,delay);
        }
        fn();
    }
    function resetOverlay(){
        $.each(map.getOverlays(),function(i,v){
            v.resetData();
        });
    }
    var showDataKey = 'temp';
    var isData_1 = true;
    var isData_2 = false;
	var map = new BMap.Map("map");
	window._map = map;
    var currentZoom = 5;
    map.setMinZoom(5);
    map.setMaxZoom(14);
    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    map.centerAndZoom(new BMap.Point(120.408836,36.899005), currentZoom);
    map.addEventListener("dragend", dragendOrZoomend);
    map.addEventListener("zoomend", dragendOrZoomend);
    map.addEventListener("tilesloaded",function(){
        isLoadedMap = true;
        _hideLoading();
    });
    function dragendOrZoomend(){
        var zoom = map.getZoom();
        if(zoom < currentZoom){
            map && map.clearOverlays();
        }
        
        currentZoom = zoom;
        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角
                   // http://10.16.45.145:9526/weather/gridData?slon=115.148258&slat=40.315695&elon=117.581301&elat=39.581143&maplevel=10
        // var url = 'http://61.4.184.31/weather/gridData?slon='+bssw.lng + "&slat=" + bsne.lat+'&elon='+bsne.lng + "&elat=" + bssw.lat+'&maplevel='+map.getZoom();
        // console.log(url);
        // url = 'http://10.16.45.145:9526/weather/gridData?slon='+bssw.lng + "&slat=" + bsne.lat+'&elon='+bsne.lng + "&elat=" + bssw.lat+'&maplevel='+map.getZoom();
        // var prex = 'http://10.14.85.116/php/gedian/';
        var prex = 'http://radar.tianqi.cn/';
        var url = prex + 'gridData.php?param='+encodeURIComponent('slon='+bssw.lng + "&slat=" + bsne.lat+'&elon='+bsne.lng + "&elat=" + bssw.lat+'&maplevel='+map.getZoom());
        // console.log(url);
        loadData(url,initData);
    }
    // 第一次初始化自定义覆盖
    dragendOrZoomend();

    setTimeout(function(){
        location.reload();
    },1000*60*60);
}()