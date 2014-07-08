!function(){
    /*简单播放器*/
    (function(global){
        var $container;
        var progressWidth;
        $(function(){
            $container = $('body');
            progressWidth = $container.width() - 30;
        })
        var delay = 1000;
        
        var Player = function(_totalNum,callback,tuli){
            var self = this;
            self.cIndex = -1;
            self.tIndex = _totalNum;
            var width = progressWidth / _totalNum - 5;
            self.pWidth = width;
            var $html = '<div class="fix_layer bottom_layer nav_animate">';
                        if(tuli){
                            $html += '<div class="tuli_layer"><img src="'+tuli+'"/></div>';
                        }
                        $html +='<span class="btn_player">';
                        
                        $html += '</span>';
                            $html +='<div class="progress">';
                            $html += '<div class="handle" style="left:'+(width*_totalNum)+'px"><i></i></div>';
                            for(var i = 0;i<_totalNum;i++){
                                $html += '<span data-index='+i+' style="width:'+width+'px" class="on"></span>'
                            }
                $html +=            '</div>'+
                                '</div>';
            $html = $($html).appendTo($container);
            self.playerTT;
            var $btn_play = $html.find('.btn_player').click(function(){
                var $this = $(this);
                $('#n_play').hide();
                if($this.hasClass('pause')){
                    self.stop();
                    $this.removeClass('pause');
                }else{
                    $this.addClass('pause');
                    self.play(0);
                }
            }); 
            var $btns = self.progressBtns = $html.find('.progress span').click(function(){
                self.stop();
                self.play($(this).data('index'),true);
            });
            var $handle = self.handle = $html.find('.progress .handle');
            self.playerHTML = $html;
            self.callback = callback || function(toIndex,fn){fn()};
        }
        var prop = Player.prototype;
        prop.play = function(index,isFromProgress){
            var self = this;
            var callback = self.callback;
            var cIndex = self.cIndex;
            var tIndex = self.tIndex;
            var toIndex = index != null? index:cIndex+1<tIndex?cIndex+1:-1;
            if(toIndex < 0){
                self.stop();
                // callback(0);
            }else{
                var $span = self.progressBtns.removeClass('on');
                self.playerHTML.find('.progress .time').show();
                $span.filter(':lt('+toIndex+'),:eq('+toIndex+')').addClass('on');
                self.handle.css({left: self.pWidth * (toIndex+1) + 2});
                self.cIndex = toIndex;
                callback(toIndex,function(){
                    if(!isFromProgress){//当点击进度条上的按钮时不继续播放
                        self.playerTT = setTimeout(function(){;
                            self.play();
                        },delay);
                    }
                });         
            }
        }   
        prop.stop = function(){
            var self = this;
            self.cIndex = -1;
            // self.playerHTML.find('.progress .time').hide();
            // self.progressBtns.removeClass('on');
            self.playerHTML.find('.btn_player').removeClass('pause');
            // self.handle.css({left: 0});
            clearTimeout(this.playerTT);
        }
        prop.hide = function(){
            this.stop();
            this.playerHTML.remove();
        }
        var relativeWidth;//时间提示参考最外层容器的宽度
        prop.showText = function(text){
            var self = this;
            var $html = self.playerHTML;
            var $time = $html.find('.progress .time');
            if($time.length == 0){
                $time = $('<div class="time"><i></i><div></div></div>').appendTo($html.find('.progress'));
            }
            if(text){
                try{
                    $time.find('i').text(text);
                    var toItem = $html.find('span.on').last();

                    var toItemW = toItem.width();
                    var timeW = $time.width();
                    var toItemLeft = toItem.position().left + toItemW - timeW/2;
                    var toLeft = toItemLeft;// - (timeW - toItemW)/2;
                    var sorrowLeft = timeW / 2 - 10;
                    if(!relativeWidth){
                        relativeWidth = $html.find('.progress').width()+10;
                    }
                    if(toLeft + timeW > relativeWidth){
                        var fixedLeft = relativeWidth - timeW;
                        sorrowLeft += toLeft - fixedLeft;
                        toLeft = fixedLeft;
                    }else if(toLeft < 0){
                        sorrowLeft += toLeft;
                        toLeft = 0;
                    }

                    $time.find('div').css({
                        left: sorrowLeft
                    });
                    $time.css({
                        left:  toLeft
                    }).show();
                }catch(e){}
            }else{
                $time.hide();
            }
        }
        global.Player = Player;
    })(this);
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
        data.l.reverse();
        data_cache = data;
        window['data'] = data;
        var time = data.time;
        var len = data.l.length;
        var list = data.l[len-1];
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
        var fn = function(toIndex,nextFn){
            var _list = data.l[toIndex];
            console.log(_list);
            var time_start = _list[_list.length-1].time;
            var time_end = _list[0].time;
            $time.text(time_start+'至'+time_end);
            renderMap(_list);
            nextFn && nextFn(toIndex,nextFn);
        }
        var player = new Player(len,fn);
        fn(len-1);
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
                var text = '●';//isZheng?'+':'—';
                var color = isZheng?'#29f800':'blue';
                var fontSize = 15;
            }else{
                var text = '●';
                var color = '';
                intensity = Math.abs(intensity);
                if(intensity >=0 && intensity < 100){
                    color = '#50f82f';
                }else if(intensity >=100 && intensity < 150){
                    color = '#34a51e';
                }else if(intensity >= 150 && intensity < 200){
                    color = '#1c5b10';
                }else if(intensity >= 200 && intensity < 250){
                    color = 'rgb(255,109,0)';
                }else if(intensity >= 250 && intensity < 300){
                    color = 'rgb(230,0,0)';
                }else{
                    color = 'rgb(158,0,1)';
                }
                var fontSize = 15;
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
            $('.tuli>div').hide();
            $('#tuli_'+type).show()
            typeTT = setTimeout(function(){

                renderMap(data_cache.l[data_cache.l.length-1]);
            },300);
        }
    });
    var $slide_bar = $('.slide_bar');
    var $btn_switch = $('.btn_switch').click(function(){
        if(!$slide_bar.hasClass('show')){
            $btn_switch.text('关闭面板');
            $slide_bar.addClass('show');
        }else{
            $btn_switch.text('打开面板');
            $slide_bar.removeClass('show');
        }        
    });
    // addTextMarker(120.408836,36.899005,'+','red');
    // addTextMarker(121.408836,35.899005,'—','blue',14);
    // addTextMarker(122.408836,34.899005,'●','green');Mask.hide();
    $.getScript('http://61.4.184.32/mobile/data/leidian/');
}();