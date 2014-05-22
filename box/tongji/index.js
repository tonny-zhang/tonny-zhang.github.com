!function(){
	var _hideLoading = function(){
        try{
            window.android.hideLoading();
        }catch(e){}
    }
    var _formateNum = function(num){
    	return (num < 10?'0':'')+num;
    }
	var style = {
        fontSize: '22px'
    };
    var s_time = '20140401';
    var e_time = new Date();
    var month = _formateNum(e_time.getMonth()+1);
    var date = _formateNum(e_time.getDate());
    e_time = [e_time.getFullYear(), month, date].join('');
    var cityid = '54511'
	// $.getJSON('./data/all.json',function(data){
	$.ajax({
         url: 'http://61.4.184.31/weather/history?s_time='+s_time+'&e_time='+e_time+'&cityid='+cityid,
         dataType: "jsonp",
         jsonp: "cb",
         success: renderData,
         error: function(a,b,c){
            if(b != 'abort'){
                alert('加载数据出现错误！');
                // location.reload();
            }
        }
    });
    var REG_DATE = /(\d{4})(\d{2})(\d{2})/;
    function formateDate(date){
    	var m = REG_DATE.exec(date);
		if(m){
			return m[1]+'-'+m[2]+'-'+m[3];
		}
		return date;
    }
	function renderData(data){
		data.s_time = formateDate(data.s_time);
		data.e_time = formateDate(data.e_time);
		var startMonth = parseInt(data.s_time.split('-')[1]);
		var xArr = [],
			yArr = [];
		var piepArr = [];
		//对数据进行排序
		data.tqxx.value.sort(function(a,b){
			return a.y > b.y?-1:1;
		});
		$.each(data.tqxx.value,function(i,v){
			xArr.push(v.x);
			yArr.push(v.y);
			if(v.y > 0)
			piepArr.push([v.x+'('+v.y+'天)',v.y]);
		});
		$('#chart').highcharts({
	        chart: {
	            zoomType: 'xy',
	            style: style
	        },
	        xAxis: {
	            categories: xArr,
	            lineColor:"#115aaa",
	            lineWidth:5,
	            labels: {
	                y: 25,
	                style: style
	            }
	        },
	        yAxis: { // Primary yAxis
	            allowDecimals: false,
	            labels: {
	                format: '{value}',
	                style: style
	            },
	            // title: {
	            //     text: '天气现象统计(天)',
	            //     style: style
	            // },
	            min: 0
	        },
	        legend: {
	            // layout: 'vertical',
	            align: 'center',
	            // x: 120,
	            verticalAlign: 'top',
	            // y: 100,
	            // floating: true,
	            backgroundColor: '#FFFFFF',
	            itemStyle: style
	        },
	        series: [{
	        	name: '天气现象统计(天)',
	            data: piepArr,
	            type: 'pie'
	        }],
	        plotOptions: {
	            pie: {
	            	size: 150,
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    connectorColor: '#000000',
	                    // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    format: '{point.name}',
	                    style: style
	                }
	            }
	        }
	    });
		
		/*对X轴的日期进行处理*/
		var currentDate = 0;
		var currenMonth = startMonth;
		$.each(data.tq.value,function(i,v){
			var date = parseInt(v.x);
			if(date < currentDate){
				currenMonth++;
			}
			currentDate = date;
			v.x = currenMonth+'-'+_formateNum(currentDate);
		});
		var temp_x = [],
			temp_max_y = [],
			temp_min_y = [],
			js_y = [];
		$.each(data.tq.value,function(i,v){
			temp_x.push(v.x);
			temp_max_y.push(v.y[0]);
			temp_min_y.push(v.y[1]);
			js_y.push(v.y[2]);
		});
		var max_temp = Math.max.apply(Math,temp_max_y);
		$.each(temp_max_y,function(i,v){
			if(v == max_temp){
				temp_max_y[i] = {
					y: v,
					marker: {
						// fillColor: 'red',
						radius: 10,
						symbol: 'triangle'
					}
				}
			}
		});
		var min_temp = Math.min.apply(Math,temp_min_y);
		$.each(temp_min_y,function(i,v){
			if(v == min_temp){
				temp_min_y[i] = {
					y: v,
					marker: {
						// fillColor: 'blue',
						radius: 10,
						symbol: 'triangle-down'
					}
				}
			}
		});
		var max_js = Math.max.apply(Math,js_y);
		// var title = formateDate(data.s_time)+'至'+formateDate(data.e_time)+'数据';
		$('#chart_temp').highcharts({
	        chart: {
	            zoomType: 'xy',
	            style: style
	        },
	        xAxis: {
	            categories: temp_x,
	            // lineColor:"#115aaa",
	            // lineWidth:2,
	            labels: {
	                y: 30,
	                style: style,
	                rotation: -90,
	                y: 40,
	                x: 8
	            }
	        },
	        yAxis: [{ // Primary yAxis
	            labels: {
	                format: '{value}°C',
	                style: style
	            }
	            // ,
	            // title: {
	            //     text: title,
	            //     style: style
	            // }
	        },{ // Primary yAxis
	            labels: {
	                format: '{value}mm',
	                style: style
	            },
	            opposite: true
	        }],
	        legend: {
	            // layout: 'vertical',
	            align: 'center',
	            // x: 120,
	            verticalAlign: 'top',
	            // y: 100,
	            // floating: true,
	            backgroundColor: '#FFFFFF',
	            itemStyle: style
	        },
	        series: [{
	        	name: data.tq.name[2],
	            data: js_y,
	            yAxis: 1,
	            color: '#2468A2',
	            type: 'column',
	            dataLabels: {
	                // enabled: true,
	                // rotation: -90,
	                // color: '#FFFFFF',
	                // align: 'right',
	                // x: 4,
	                // y: -10,
	                // style: {
	                //     fontSize: '13px',
	                //     fontFamily: 'Verdana, sans-serif',
	                //     textShadow: '0 0 3px black'
	                // },
	                // formatter: function(){
	                // 	if(this.y > 0){
	                // 		return this.y;
	                // 	}
	                // }
	            }
	        },{
	        	name: data.tq.name[0],
	            data: temp_max_y,
	            yAxis: 0,
	            color: '#FF7E00',
	            type: 'spline'
	        },{
	        	name: data.tq.name[1],
	            data: temp_min_y,
	            yAxis: 0,
	            color: '#45B400',
	            type: 'spline'
	        }],
	        plotOptions: {
	            series: {
	                lineWidth: 4,
	                marker: {
	                    radius: 6
	                }
	            },
	            column: {
	            	shadow: true
	            }
	        }
	    });
		$('article .time').text('('+data.s_time+'至'+data.e_time+')');
		var desc = '自'+data.s_time+'至'+data.e_time+'：<br/>日最高气温<span>'+max_temp+'</span>°C,日最低气温<span>'+min_temp+'</span>°C,日最大降水量<span>'+max_js+'</span>mm,降水日数<span>'+data.num_js+'</span>天，连续无降水日数<span>'+data.num_no_js+'</span>天，霾日数<span>'+data.num_mai+'</span>天，连续霾日数<span>'+data.num_mai_lx+'</span>天。<br/><p>本数据来源于<span>SmartCloud</span>云存储与计算平台,更多信息可访问<a href="http://smart.weather.com.cn/">http://smart.weather.com.cn/</a></p>';
		$('#desc').html(desc);
		_hideLoading();
	}

	setTimeout(function(){},1000*60*10);
}()