!function(){
    var mapObj = new AMap.Map("map",{
        scrollWheel: true,//可通过鼠标滚轮缩放地图
        doubleClickZoom: true, //可以双击鼠标放大地图
        view: new AMap.View2D({
            center: new AMap.LngLat(120.408836,36.899005),
            zoom: 5
        })  //2D地图显示视口  
    });

    //添加带文本的点标记覆盖物
    function addTextMarker(lon,lat,text,color,fontSize){
        //点标记中的文本
        var markerSpan = document.createElement("span");
        markerSpan.style.color = color;
        markerSpan.style.fontSize = (fontSize || 30)+'px';
        markerSpan.innerHTML = text;
        marker = new AMap.Marker({
            map: mapObj,
            position: new AMap.LngLat(lon,lat), //基点位置
            offset: new AMap.Pixel(-18,-36), //相对于基点的偏移位置
            draggable: true,  //是否可拖动
            content: markerSpan //自定义点标记覆盖物内容
        });
        marker.setMap(mapObj);  //在地图上添加点
    }

    var data_cache;
    var $info_list = $('#info_list');
    var $num_total = $('#num_total');
    var $time = $('h1 span');
    var REG_TIME = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    window.leidian = function(data){
        data_cache = data;
        var time = data.time;
        var list = data.l;
        $num_total.text(data.count);
        var m = REG_TIME.exec(time);
        if(m){
            var startTime = m[1]+'-'+m[2]+'-'+m[3]+' '+(m[4]-1)+':'+m[5];
            var endTime = m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':'+m[5];
        }
        $time.text(startTime+'至'+endTime);
        var html = '';
        $.each(list.slice(0,10),function(i,v){
            html += '<li>经度:'+v.lon+' 纬度:'+v.lat+' 强度:'+v.intensity+'</li>';
        });
        $info_list.show().find('ul').html(html);
        renderMap(list);
    }

    var $mask = $('.mask');
    var Mask = {
        show: function(){
            $mask.show();
        },hide: function(){
            $mask.hide();
        }
    };
    var TYPE_ALL = 1,
        TYPE_INTENSITY = 2;
    var current_type = TYPE_ALL;
    function renderMap (list){
        mapObj.clearMap();
        $.each(list,function(i,v){
            var intensity = v.intensity;
            var isZheng = intensity > 0;
            if(current_type == TYPE_ALL){
                var text = isZheng?'+':'—';
                var color = isZheng?'red':'blue';
                if(!isZheng){
                    fontSize = 14;
                }
            }else{
                var text = '●';
                var color = '';
                intensity = Math.abs(intensity);
                if(intensity >=0 && intensity < 50){
                    color = 'rgb(249,242,187)';
                }else if(intensity >=50 && intensity < 100){
                    color = 'rgb(249,222,69)';
                }else if(intensity >= 150 && intensity < 200){
                    color = 'rgb(255,168,0)';
                }else if(intensity >= 200 && intensity < 250){
                    color = 'rgb(255,109,0)';
                }else if(intensity >= 250 && intensity < 300){
                    color = 'rgb(230,0,0)';
                }else{
                    color = 'rgb(158,0,1)';
                }
                var fontSize = 20;
            }
            addTextMarker(v.lon,v.lat,text,color,fontSize);
        });
        Mask.hide();
    }
    var typeTT;
    $('[name=type]').click(function(){
        var type = $(this).val();
        if(type != current_type){
            current_type = type;
            clearTimeout(typeTT);
            Mask.show();
            typeTT = setTimeout(function(){
                 renderMap(data_cache.l);
            },100);
        }
    });

    // addTextMarker(120.408836,36.899005,'+','red');
    // addTextMarker(121.408836,35.899005,'—','blue',14);
    // addTextMarker(122.408836,34.899005,'●','green');Mask.hide();
    $.getScript('http://61.4.184.32/mobile/data/leidian/');
}();