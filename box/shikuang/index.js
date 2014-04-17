!function(){
    var yjlb = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰'];
    var gdlb = ['寒冷', '灰霾', '雷雨大风', '森林火险', '降温', '道路冰雪','干热风','低温','冰冻'];
    var yjyc = ['蓝色', '黄色', '橙色', '红色'];
    var gdyc = ['白色'];
    //得到预警描述及等级
    var REG = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})\d{2}-(\d{2})(\d{2})\.html/;
    
    var currentCityId = '101010100';//'101280902';
    // var currentCityId = '101281108';
    /*加载实况信息*/
    var ajax_sk = $.getJSON('http://mobile.weather.com.cn/data/sk/'+currentCityId+'.html');
    var ajax_alarm = $.getScript('http://product.weather.com.cn/alarm/grepalarm.php?areaid='+currentCityId+'&type=[0-9]{2}&count=1');
    var ajax_line = $.getJSON('http://mobile.weather.com.cn/data/UsedLive/'+currentCityId+'.html');
    var der = $.when(ajax_sk,ajax_line,ajax_alarm);
    der.done(function(sk_data,line_data){
        var hasAlarm = false;
        if(alarminfo && alarminfo.data.length > 0){
            var data = alarminfo.data[0];
            var url = data[1];
            var m = REG.exec(url);
            if(m){
                var textIndex = parseInt(m[6],10);
                var text = '';
                if(textIndex > 90){
                    text = gdlb[textIndex-91];
                }else{
                    text = yjlb[textIndex - 1];
                }

                var level = '';
                var levelIndex = parseInt(m[7],10);
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
                    img = m[6]+m[7];
                }
                $('.alarm').html('<img src="http://www.weather.com.cn/m/i/alarm_s/'+img+'.gif"/>'+val).show();
                hasAlarm = true;
            }
        }
        
        sk_data = sk_data[0];
        if(sk_data && sk_data.sk_info){
            var data = sk_data.sk_info;
            var date_str = '';
            var date = data.date;
            var m = /\d{4}(\d{2})(\d{2})/.exec(date);
            if(m){
                date_str += m[1]+'月'+m[2]+'日<br/>'; 
            }
            date_str += data.time;
            $('.date').html(date_str);
            var temp = data.temp;
            $('.value b').text(temp);
            $('.value span:first').text('体感温度：'+temp);
            $('.value span:eq(1)').text('相对温度：'+data.sd);
            $('.value span:eq(2)').text('舒适度：'+'较舒适');
            $('.wind .text').text(data.wd);
            $('.wind .text_inner').text(data.ws);
            $('body').addClass('loaded ');
            // -50- 9 |0 -49 |5 - 68
            var height = 50 + parseFloat(temp)*(19/25);
            $('.temp span').height(height);
            $('.top_right').width($('#main').width()-288-15);
            var toHeight = 700 - $('.top_container').height() - 56 - 10;
            if(hasAlarm){
                toHeight = toHeight - $('.alarm').outerHeight() - 10;
            }
            $('#line').height(toHeight);
        }else{
            $('#loading').text('出现错误！');
            setTimeout(function(){
                location.reload();
            },1000);
        }
        renderLine.apply(null,line_data);
    });
    var COLOR_TEMP = '#F3715C';
    var COLOR_JS = '#2468A2';
    var COLOR_SD = '#AA4643';
    var COLOR_WIND = '#000';
    var style = {
        fontSize: '18px'
    }
    var options = {
        chart: {
            zoomType: 'xy',
            style: style
        },
        xAxis: [{
            categories: [],
            lineColor:"#115aaa",
            lineWidth:5,
            labels: {
                y: 25,
                style: style
            }
        }],
        yAxis: [{ // Primary yAxis
            allowDecimals: false,
            labels: {
                format: '{value}°C',
                style: $.extend({},style,{
                    color: COLOR_TEMP,
                })
            },
            title: {
                style: $.extend({},style,{
                    color: COLOR_TEMP,
                })
            },
            opposite: true
        }, { // Secondary yAxis
            allowDecimals: false,
            title: {
                style: $.extend({},style,{
                    color: COLOR_JS,
                })
            },
            labels: {
                format: '{value} mm',
                style: $.extend({},style,{
                    color: COLOR_JS,
                })
            },
            min: 0,
            minRange: 5
        }, { // Secondary yAxis
            allowDecimals: false,
            title: {
                style: $.extend({},style,{
                    color: COLOR_SD,
                })
            },
            labels: {
                format: '{value} %',
                style: $.extend({},style,{
                    color: COLOR_SD,
                })
            },
            opposite: true
        }, { // Secondary yAxis
            allowDecimals: false,
            title: {
                style: $.extend({},style,{
                    color: COLOR_WIND,
                })
            },
            labels: {
                format: '{value} 级',
                style: $.extend({},style,{
                    color: COLOR_WIND,
                })
            },
            min: 0,
            minRange: 1
        }],
        tooltip: {
            shared: true,
            style: style
        },
        legend: {
            // layout: 'vertical',
            align: 'center',
            // x: 120,
            verticalAlign: 'top',
            // y: 100,
            // floating: true,
            backgroundColor: '#FFFFFF',
            itemStyle: {
                fontSize: '24px'
            }
        },
        series: [],
        plotOptions: {
            series: {
                lineWidth: 4,
                marker: {
                    radius: 6
                }
            }
        }
    }
    /*加载并渲染曲线数据*/
    function renderLine(data){
        var wind = data.l3.split('|');
        var wind_type = data.l4.split('|');
        var js = data.l6.split('|');
        var temp = data.l1.split('|');
        var sd = data.l2.split('|');
        var last_wind = wind_type[wind_type.length-1];
        var degree = Math.min(360,45 * last_wind);
        var $wind_flag = $('.wind .flag');
        if(degree == 0){
            $wind_flag.remove();
        }else{
            $wind_flag.css('transform','rotate('+degree+'deg)');
        }

        var arr = [];
        var temp_option = {
            name: '温度',
            color: COLOR_TEMP,
            type: 'spline',
            yAxis: 0,
            data: [],
            tooltip: {
                valueSuffix: ' °C'
            }

        }
        var js_option = {
            name: '降水量',
            color: COLOR_JS,
            type: 'column',
            yAxis: 1,
            data: [],
            tooltip: {
                valueSuffix: ' mm'
            }

        }
        var sd_option = {
            name: '湿度',
            color: COLOR_SD,
            type: 'spline',
            yAxis: 2,
            data: [],
            tooltip: {
                valueSuffix: '%'
            }
        };
        var wind_option = {
            name: '风速',
            color: COLOR_WIND,
            type: 'spline',
            yAxis: 3,
            marker: {
                symbol: 'square'
            },
            data: [],
            tooltip: {
                valueSuffix: '级'
            }
        };
        var wind_type_str = ['无持续风向','东北','东','东南','南','西南','西','西北','北','旋转'];
        var last_time = parseInt(data.l7);
        for(var i = 0;i<= 24;i++){
            var v = last_time + i;
            if(v >= 24){
                v = v - 24;
                if(v == last_time){
                    v = v+'(h)';
                }
            }
            var _w_type = parseInt(wind_type[i]);
            // v = wind_type_str[_w_type]+'<br/>'+v;
            arr.push(v);
            var wind_speed = parseFloat(wind[i]);
            
            wind_option.data.push({
                y: wind_speed,
                marker: {
                    symbol: 'url(http://mobile.weather.com.cn/images/fx/'+_w_type+'.png)'
                }
            });
            temp_option.data.push(parseFloat(temp[i]));
            js_option.data.push(parseFloat(js[i]));
            // js_option.data.push(Math.random()*1000);
            sd_option.data.push(parseFloat(sd[i]));
        }
        options.xAxis[0].categories = arr;// = $.extend(options.xAxis,[{categories:arr}]);

        options.series = [temp_option,js_option,sd_option,wind_option];
        $(function(){
            $('#line').highcharts(options);
            window.chart = $('#line').highcharts();
            var $legend_items = $('.highcharts-legend-item').click();
            var legend_items_len = $legend_items.length;
            var currentIndex = 0;
            $legend_items.eq(currentIndex).click();

            var delay = 4000;
            var fn = function(){
                $legend_items.eq(currentIndex).click();
                var nextIndex = currentIndex + 1 > legend_items_len - 1?0:currentIndex+1;
                $legend_items.eq(nextIndex).click();
                currentIndex = nextIndex;
                setTimeout(fn,delay);
            }
            setTimeout(fn,delay);
        });
    };
    setTimeout(function(){
        location.reload();
    },1000*60*10);
}()

