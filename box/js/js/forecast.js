// JavaScript Document
function dateCount(number,mydate){
	var mydate=mydate;
    mydate.setDate(mydate.getDate()+number);
	return mydate.getDate();
}
//自动刷新
function myrefresh(){ 
$(".ri").empty();
weatherdata(); 
} 
//setTimeout('myrefresh()',100000); //指定1秒刷新一次
function weatherdata(){
	 //获取数据更新时间
	var localtime=new Date();
	var timesmonth=localtime.getMonth()+1;
	var timesday=localtime.getDate().toString();
	var timeshours=localtime.getHours().toString();
	var timesminutes=localtime.getMinutes().toString();
	//timesday=timesday.length==1?"0"+timesday:timesday;
	timesshours=timeshours.length==1?"0"+timeshours:timeshours;
	timesminutes=timesminutes.length==1?"0"+timesminutes:timesminutes;
	var update=timesmonth+"/"+timesday+" "+timeshours+":"+timesminutes+"更新";
    //获取城市ID
    var url=window.location.href;
    var urlA=url.split('.html');
	var areaid=urlA[0].substr(-9,9);
	//alert(areaid);
	$GwData=[];
	$DwData=[];
	$riqi=[];
	var weatherArr={"00":"晴","01":"多云","02":"阴","03":"阵雨","04":"雷阵雨","05":"雷阵雨伴有冰雹","06":"雨夹雪","07":"小雨","08":"中雨","09":"大雨","10":"暴雨","11":"大暴雨","12":"特大暴雨","13":"阵雪","14":"小雪","15":"中雪","16":"大雪","17":"暴雪","18":"雾","19":"冻雨","20":"沙尘暴","21":"小到中雨","22":"中到大雨","23":"大到暴雨","24":"暴雨到大暴雨","25":"大暴雨到特大暴雨","26":"小到中雪","27":"中到大雪","28":"大到暴雪","29":"浮尘","30":"扬沙","31":"强沙尘暴","53":"霾","99":""};
	//定义风向数组
	var fxArr={"0":"无持续风向","1":"东北风","2":"东风","3":"东南风","4":"南风","5":"西南风","6":"西风","7":"西北风","8":"北风","9":"旋转风"};
	//定义风力数组
	var flArr={"0":"微风","1":"3-4级","2":"4-5级","3":"5-6级","4":"6-7级","5":"7-8级","6":"8-9级","7":"9-10级","8":"10-11级","9":"11-12级"};
	$.ajax({
		type:"GET",
        url:"data/forecast/101010200.html",
		dataType:"json",
		success:function(result){	
		var publish_date=result.f.f0;
		var cityname=result.c.c3;
		var citynameen=result.c.c2;
			//年
			var timeyear=publish_date.substr(0,4);
			//月
			var timemonth=publish_date.substr(4,2);
			//截取日期
			var timeday=publish_date.substr(6,2);
			//截取小时
			var timehours=publish_date.substr(8,2);
			var mydate=new Date(timeyear,timemonth-1,timeday,timehours,"00","00");
			//alert(mydate);
			var week="日一二三四五六".charAt(mydate.getDay());
			var d0=dateCount(0,mydate);
			var d1=dateCount(1,mydate);
			var d2=dateCount(1,mydate);
			var d3=dateCount(1,mydate);
			var d4=dateCount(1,mydate);
			
			var timedayArr=new Array();
		    timedayArr=[d0,d1,d2,d3];
		    //alert(timedayArr);
			var weekArr=new Array();
			switch(week){
				case "日":
					weekArr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];	
					break;
				case "一":
					weekArr=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];	
					break;
				case "二":
					weekArr=["星期二","星期三","星期四","星期五","星期六","星期日","星期一"];	
					break;
				case "三":
					weekArr=["星期三","星期四","星期五","星期六","星期日","星期一","星期二"];	
					break;
				case "四":
					weekArr=["星期四","星期五","星期六","星期日","星期一","星期二","星期三"];	
					break;
				case "五":
					weekArr=["星期五","星期六","星期日","星期一","星期二","星期三","星期四"];	
					break;
				case "六":
					weekArr=["星期六","星期日","星期一","星期二","星期三","星期四","星期五"];	
					break;
			}
			newsArr=result.f.f1;
			$("#cityname").html(cityname+"<span>"+citynameen+"</span>");
			$("#riqi").html("<span>今天是"+timesmonth+"月"+d0+"日</span><span>"+weekArr[0]+"</span>");  
			$("#update").html(update);
			$.each(newsArr,function(i,v){
				var img1=v["fa"];
				var img2=v["fb"];
				var weather1=weatherArr[img1];
				var weather2=weatherArr[img2];
				if(weather1==weather2)
				{
					weather=weather1;
				}
				else
				{
					weather=weather1+"转"+weather2;
				}
				var temp1=v["fc"];
				var temp2=v["fd"];
				var fx1=v["fe"];
				fx1=fxArr[fx1];
				var fx2=v["ff"];
				fx2=fxArr[fx2];
				var fl1=v["fg"];
				fl1=flArr[fl1];
				var fl2=v["fh"];
				fl2=flArr[fl2];
				if(fx1+fl1==fx2+fl2)
				{
					fx=fx1+fl1;
				}
				else
				{
					fx=fx1+fl1+"转"+fx2+fl2;
				}
				if(i==0)
				{
					if(timehours<18)
					{
						$("#oneday").html("<dt>今天白天至夜间，温度"+temp1+"℃-"+temp2+"℃  "+weather+"，"+fx+"。</dt><dd></dd>");
					}
					else
					{
						$("#oneday").html("<dt>今天夜间最低气温"+temp2+"℃  "+weather2+"，"+fx2+fl2+"。</dt><dd></dd>");
					}
				}
				if(i>0 && i<4)
				{
						$("<ul><li style='font-size:18px;'>"+timedayArr[i]+"日  "+weekArr[i]+"</li><li style='font-size:20px;'>"+temp1+"℃/"+temp2+"℃</li><li><img src='images/day/d"+img1+".png' width='40px' height='40px'/><img src='images/night/n"+img2+".png' width='40px' height='40px'/></li><li style='font-size:18px; clear:both;'>"+weather+"</li></ul>").appendTo(".ri");
				}
			})
			
		}
			
	});
	//获取实况数据
	var wdContent=["温度很低，着厚羽绒服、毛皮大衣等隆冬服装。","气温较低，着棉衣、皮夹克加羊毛衫等冬季服装。","着厚外套加毛衣等服装。","天气微凉，长袖T恤、衬衫外面要加上薄外套才行哦。","天气舒适，穿长袖上衣加单裤等服装即可。","天热，穿T恤、短裤、连衣裙等夏装。","今天天儿太热了，要穿清凉的短衫、短裤等盛夏服装。"];
	var flContent=["风力不大","户外风比较大","风力很强哦","有超强劲的风"];
	var rainContent=["","有小毛毛雨，记得带伞","有中雨飘落，要带伞","雨有点大，开车要注意安全","雨点大又多，注意交通安全","倾盆暴雨，注意行车安全","伞已经遮不住了，尽量减少外出吧"];
	$.ajax({
		type:"GET",
        url:"data/observe/101010200.html",
		dataType:"json",
		success:function(result){	
			$.each(result,function(i,v){
				var wd=v["l1"];
				var sd=v["l2"];
				var fl=v["l3"];
				var fxNum=v["l4"];
				var rain=Number(v["l6"]);
				var time=v["l7"];
				var bg="";
				$('.ris').html("<dt><span style='font-size:100px;'>"+wd+"℃</span></dt><dd><span style='font-size:25px;'>湿度："+sd+"％</span> <br /> <span style='font-size:25px;'>"+fxArr[fxNum]+"     "+fl+"级</span></dd>");
				//判断背景图
				if((isNaN(rain) || rain==0) && sd<=60)
				{
					bg="00";//晴天
				}
				else if((isNaN(rain) || rain==0) && sd>60)
				{
					bg="01";//阴天
				}
				else if(rain>0 && rain<8)
				{
					bg="02";//小雨
				}
				else
				{
					bg="03";//大雨
				}
				//判断温度内容
				if(wd<-10)
				{
					wd=0;
				}
				else if(wd>=-10 && wd<5)
				{
					wd=1;
				}
				else if(wd>=5 && wd<15)
				{
					wd=2;
				}
				else if(wd>=16 && wd<22)
				{
					wd=3;
				}
				else if(wd >=22 && wd<27)
				{
					wd=4;
				}
				else if(wd>=27 && wd<32)
				{
					wd=5;
				}
				else
				{
					wd=6;
				}
				//判断温度着装
				
				//判断风力
				if(fl>=0 && fl<=4)
				{
					fl=0;
				}
				else if(fl>=5 && fl<=6)
				{
					fl=1;
				}
				else if(fl>=7 && fl<=8)
				{
					fl=2;
				}
				else
				{
					fl=3;
				}
				//判断降水
				if(isNaN(rain) || rain==0)
				{
					rain=0;
				}
				else if(rain>0 && rain<2.5)
				{
					rain=1;
				}
				else if(rain>=2.5 && rain<=8)
				{
					rain=2;
				}
				else if(rain>=8 && rain<16)
				{
					rain=3;
				}
				else if(rain>=16 && rain<30)
				{
					rain=4;
				}
				else if(rain>=30 && rain<80)
				{
					rain=5;
				}
				else
				{
					rain=6;
				}
				
				
				if(rainContent[rain]=="")
				{
				var content="亲，现在外面"+rainContent[rain]+flContent[fl]+"，"+wdContent[wd];
				}
				else
				{
				var content="亲，现在外面"+rainContent[rain]+"，"+flContent[fl]+"，"+wdContent[wd];
				}
				$(".tip").html("<span><img src='images/wxts.gif' style='margin-left:-15px;'></span>"+content);
				$(".main").css({"backgroundImage":"url(images/"+bg+".jpg)","background-repeat":"no-repeat" });
			})
		}
	})		
	//获取预警数据
	$URL='http://product.weather.com.cn/alarm/stationalarm.php?areaid=101010100&count=-1';
	$yjlb=['台风','暴雨','暴雪','寒潮','大风','沙尘暴','高温','干旱','雷电','冰雹','霜冻','大雾','霾','道路结冰'];
	$gdlb=['寒冷','灰霾','雷雨大风','森林火险','降温','道路冰雪'];
	$yjyc=['蓝色','黄色','橙色','红色','白色'];
	$gdyc=['白色'];
	var imgArr=new Array();
	var textlbArr=new Array();
	var textycArr=new Array();
		   $.ajax({
				type: "GET",
				url:$URL,
				dataType:"script",
				cache:false,
				async:false,
				success:function(){
					if(alarminfo.data!="")
					{
					 $.each(alarminfo.data,function(i,v){
						$file=v[1];
						$pos=$file.lastIndexOf('-');
						$lb=$file.substr($pos+1,2);
						$jb=$file.substr($pos+3,2);
						$time=$file.substr($pos-14,14);
						$timestr=$time.substr(0,4)+'-'+$time.substr(4,2)+'-'+$time.substr(6,2)+' '+$time.substr(8,2)+':'+$time.substr(10,2)+':'+$time.substr(12,2);                 
						$img =$lb+$jb;
						$textlb=$yjlb[parseInt($lb,10) -1 ];
						$textyc=$yjyc[parseInt($jb,10) -1 ];
						if ($lb >90 || $jb > 90)$img ='0000';
						if (parseInt($lb) >90) $textlb=$gdlb[parseInt($lb,10) - 91 ];
						if ($jb  >90) $textyc=$gdyc[parseInt($jb,10) - 91 ];
						imgArr[i]=$img;
						textlbArr[i]=$textlb;
						textycArr[i]=$textyc;
						var URL_Cont="http://product.weather.com.cn/alarm/webdata/"+v[1];
						 $.ajax({
							type: "GET",
							url:URL_Cont,
							dataType: "script",
							async : false,
							success:function(){
								$("<marquee><p style='font-size:40px; color:#fff;'>"+v[0]+"气象台发布"+textlbArr[i]+textycArr[i]+"预警:"+alarminfo.ISSUECONTENT+"</p></marquee>").appendTo("#alarm");
							}
						})
						
					}); 
					}
					else
					{
						$("#alarm").remove();	
					}
					
				}
  	})
}
/*
function myrefresh()
{
	$(".ri").empty();
	weatherdata();
}*/
$(document).ready(function() {
   weatherdata();
   setInterval('myrefresh()',30000); //指定10分钟刷新一次 
   function getNow () {
	    var now = new Date();
	        
	    return {
	        hours: now.getHours() + now.getMinutes() / 60,
	        minutes: now.getMinutes() * 12 / 60 + now.getSeconds() * 12 / 3600,
	        seconds: now.getSeconds() * 12 / 60
	    };
	};
	
	var now = getNow();

	// Create the chart
	var chart = new Highcharts.Chart({
	    chart: {
	        renderTo: 'container',
	        type: 'gauge',
	       	backgroundColor: 'rgba(255, 255, 255, 0)',  
            plotBorderColor : null,  
            plotBackgroundColor: null,  
            plotBackgroundImage:null,  
            plotBorderWidth: null,  
            plotShadow: false,    
            borderWidth : 0,  
	        plotShadow: false,
	        height: 160
	    },
	    credits: {
	        enabled: false
	    },
	    title: {
	    	text: ''
	    },
	    pane: {
	    	background: [{
	    	}, {
	    		// reflex for supported browsers
	    		backgroundColor: Highcharts.svg ? {
		    		radialGradient: {
		    			cx: 0.5,
		    			cy: -0.4,
		    			r: 1.9
		    		},
		    		stops: [
		    			[0.5, 'rgba(255, 255, 255, 0.2)'],
		    			[0.5, 'rgba(200, 200, 200, 0.2)']
		    		]
		    	} : null
	    	}]
	    },
	    yAxis: {
	        labels: {
	            distance: -15
	        },
	        min: 0,
	        max: 12,
	        lineWidth: 0,
	        showFirstLabel: false,
	        minorTickInterval: 'auto',
	        minorTickWidth: 1,
	        minorTickLength: 3,
	        minorTickPosition: 'inside',
	        minorGridLineWidth: 0,
	        minorTickColor: '#666',
	
	        tickInterval: 1,
	        tickWidth: 2,
	        tickPosition: 'inside',
	        tickLength: 6,
	        tickColor: '#666',
	        title: {
	            text:'',
	            style: {
	                color: '#BBB',
	                fontWeight: 'normal',
	                fontSize: '8px',
	                lineHeight: '10px'                
	            },
	            y: 10
	        }       
	    },
	
	    series: [{
	        data: [{
	            id: 'hour',
	            y: now.hours,
	            dial: {
	                radius: '60%',
	                baseWidth: 4,
	                baseLength: '95%',
	                rearLength: 0
	            }
	        }, {
	            id: 'minute',
	            y: now.minutes,
	            dial: {
	                baseLength: '95%',
	                rearLength: 0
	            }
	        }, {
	            id: 'second',
	            y: now.seconds,
	            dial: {
	                radius: '100%',
	                baseWidth: 1,
	                rearLength: '20%'
	            }
	        }],
	        animation: false,
	        dataLabels: {
	            enabled: false
	        }
	    }]
	},                           
	// Move
	function (chart) {
	     setInterval(function () {
	        var hour = chart.get('hour'),
	            minute = chart.get('minute'),
	            second = chart.get('second'),
	            now = getNow(),
	            // run animation unless we're wrapping around from 59 to 0
	            animation = now.seconds == 0 ? 
	                false : 
	                {
	                    easing: 'easeOutElastic'
	                };
	        
	        hour.update(now.hours, true, animation);
	        minute.update(now.minutes, true, animation);
	        second.update(now.seconds, true, animation);
	    }, 1000);
	
	});
});
$.extend($.easing, {
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	}
});