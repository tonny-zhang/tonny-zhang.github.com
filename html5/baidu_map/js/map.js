!function(){
	// 在手机上调试不可预知的错误
	window.onerror = function(e){
		alert(e);
		return true;
	}
	var map;
	var cache = {};
	/*得到xml并缓存数据*/
	var loadXML = (function(){
		var loadTT;
		var timeoutDelay = 2000;//超时时间
		var timing = function(xmlUrl){
			loadTT = setTimeout(function(){
				alert('加载"'+xmlUrl+'"超时或出现错误！');
			},timeoutDelay);
		}
		var endTiming = function(){
			clearTimeout(loadTT);
		}
		try{
			if (window.ActiveXObject){
				return function(xmlURl){
					timing(xmlURl);
					var xmlDoc = cache[xmlURl];
					if(!xmlDoc){
						xmlDoc = new ActiveXObject('Msxml2.DOMDocument');
				        xmlDoc.async=false;
				        xmlDoc.load(xmlURl);
					}
					endTiming();
			        return xmlDoc;
				}
			}else if (document.implementation && document.implementation.createDocument){
				return function(xmlURl){
					timing(xmlURl);
					var xmlDoc = cache[xmlURl];
					if(!xmlDoc){
						var xmlhttp = new window.XMLHttpRequest();
				        xmlhttp.open("GET",xmlURl,false);
				        xmlhttp.send(null);
				        xmlDoc =  xmlhttp.responseXML.documentElement; 
					}
					endTiming();
					return xmlDoc;
				}
			}else{
				return function(){}
			}
		}catch(e){console.log(e)}
	})();
	/*统一提示窗口*/
	var infoWin = function(message,option){
		this.infoWindow = new BMap.InfoWindow(message,$.extend({enableAutoPan:false,enableMessage:false},option));  // 创建信息窗口对象
	}
	infoWin.prototype.show = function(point){
		map.openInfoWindow(this.infoWindow,point); //开启信息窗口
	}
	$(function(){
		var $map_container = $('#map_container');
		var $title = $map_container.find('.title');

		var typhoonInfo = loadXML('xml/taifeng.xml');
		var typhoonList = $(typhoonInfo).children();


		/*回放按钮*/
		$('.btn_reset').click(function(){
			initTyphoon(currentTyphoonIndex);
		});

		/*台风列表按钮事件*/
		var $typhoon_list = $('.typhoon_list').click(function(){
			$typhoon_list_ul.toggle();
		});
		/*切换台风*/
		var $typhoon_list_ul = $typhoon_list.find('ul').click(function(e){
			initTyphoon($(e.target).index());
		});
		/*初始化台风列表*/
		typhoonList.each(function(){
			$typhoon_list_ul.append($('<li>').text($(this).attr('title')));
		});


		var $info = $map_container.find('.info');
		var $info_title = $info.find('div:first');
		var $info_list = $info.find('ul');
		/*展开按钮事件*/
		var isOpen = false;
		$info.find('.btn').click(function(){
			var $this = $(this);
			if(isOpen){
				$info_list.slideUp(function(){
					$this.text('展开');
					isOpen = false;
				});
			}else{
				$info_list.slideDown(function(){
					$this.text('收缩');
					isOpen = true;
				});
			}
		});

		//图例按钮
		$('.btn_legend').click(function(){
			$(this).find('img').toggle();
		})

		var runTT;
		var overlays = [];//用于存储拆线路径
		function reset(){
			clearTimeout(runTT);
			map && map.clearOverlays();
			var temp;
		    while(temp = overlays.pop()){
		        map.removeOverlay(temp);
		    }
		}
		var lastPointForCenter;
		/*初始化地图*/
		function initMap(centerPoint){
			if(!map){
				var map_id = 'map_'+new Date().getTime();
				$('<div></div>').attr('id',map_id).addClass('map_c').appendTo($map_container);
				map = new BMap.Map(map_id,{minZoom: 4/*,mapType: BMAP_HYBRID_MAP*/});
				map.setZoom(6);
				map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM,offset: new BMap.Size(20, 100)}));  //右下角，仅包含缩放按钮
				map.addEventListener('zoomend',function(){
					lastPointForCenter && map.setCenter(lastPointForCenter);
				})
			}			
			map.centerAndZoom(centerPoint, map.getZoom());
		}
		var currentTyphoonIndex = -1;

		/*初始化台风路径*/
		function initTyphoon(typhoonIndex){
			currentTyphoonIndex = typhoonIndex;
			reset();
			var info = typhoonList.eq(typhoonIndex);
			var title = info.attr('title');
			$title.text(title).show();
			var pathUrl = 'xml/'+info.attr('code')+'.xml';
			var points = $(loadXML(pathUrl)).children();
			var numOfPoints = points.length;
			var currentIndex = 0;
			var runDelay = Math.min(5000/numOfPoints,500);

			function getBDPoint(index){
			    var point = points.eq(index);
			    var bdPoint = new BMap.Point(point.attr('jd'), point.attr('wd'));
			    bdPoint.time = point.attr('y')+'年'+point.attr('m')+'月'+point.attr('d')+'日'+point.attr('h')+'时';
			    bdPoint._index = index;
			    return bdPoint
			}
			/*初始化台风提示信息*/
			function initInfo(index){
				var lastPoint = points.eq(index);
				var html = '<li><span>经度'+lastPoint.attr('jd')+'</span><span>纬度'+lastPoint.attr('wd')+'</span></li>';
				html += '<li><span>最大风力</span><span>'+lastPoint.attr('fs')+'米/秒</span></li>';
				html += '<li><span>移动速度</span><span>'+lastPoint.attr('sd')+'公里/小时</span></li>';
				html += '<li><span>移动方向</span><span>'+lastPoint.attr('fx')+'</span></li>';
				html += '<li><span>七级风圈半径</span><span>'+lastPoint.attr('b7')+'公里</span></li>';
				html += '<li><span>十级风圈半径</span><span>'+lastPoint.attr('b10')+'公里</span></li>';
				html += '<li><span>中心气压</span><span>'+lastPoint.attr('qy')+'百帕</span></li>';
				html += '<li><span>中心风力</span><span>'+lastPoint.attr('fl')+'级</span></li>';
				$info_list.html(html);
				$info_title.text(lastPoint.attr('y')+'年'+lastPoint.attr('m')+'月'+lastPoint.attr('d')+'日'+lastPoint.attr('h')+'时台风实时数据');
				$info.show();
			}
			var firstPoint = getBDPoint(0);
			initMap(firstPoint);
			initInfo(0);
			var typhoonIcon = new BMap.Icon("img/move.png", new BMap.Size(28, 28));
			var tyhoonMark = new BMap.Marker(firstPoint,{icon:typhoonIcon});
			map.addOverlay(tyhoonMark);
			setTimeout(function(){
				$(tyhoonMark.Db).find('img').addClass('rotate');
			},10);
			
			

			function addClickPoint(point){
				var index = point._index;
				var sPoint = points.eq(index);
				// var circle = new BMap.Circle(point,2000);

				var myIcon = new BMap.Icon('img/a.png', new BMap.Size(10, 10),{imageOffset: new BMap.Size(3, 3)});
				var marker1 = new BMap.Marker(point,{icon:myIcon});  // 创建标注
				var html = '<p>'+point.time+'<br/>经度：'+sPoint.attr('jd')+'<br/>纬度：'+sPoint.attr('wd')+'<br/>气压：'+sPoint.attr('qy')+'百帕<br/>最大风速：'+sPoint.attr('fs')+'米/秒<br/>7级风半径：'+sPoint.attr('b7')+'公里<br/>10级风半径：'+sPoint.attr('b10')+'公里</p>';
				var infoWindow = new infoWin(html);
				marker1.addEventListener('click', function(){
					infoWindow.show(point);
				});
				map.addOverlay(marker1);              // 将标注添加到地图中
			}
			addClickPoint(firstPoint);//添加第一个点击点
			
			new infoWin(firstPoint.time).show();
			// #4CEEDF
			// #90F46D
			// #FFF203
			// #FF7E00
			// #F71A08
			// #940EE9
			function getLineOpt(index){
				var point = points.eq(index);
				var fl = point.attr('fl');
				var color;

				if(fl >= 6 && fl <=7){
					color = '#4CEEDF';
				}else if(fl >= 8 && fl <=9){
					color = '#90F46D';
				}else if(fl >= 10 && fl <=1){
					color = '#FFF203';
				}else if(fl >= 12 && fl <=13){
					color = '#FF7E00';
				}else if(fl >= 14 && fl <=15){
					color = '#F71A08';
				}else if(fl >= 16){
					color = '#940EE9';
				}
				return {strokeColor:color||"blue", strokeWeight:3, strokeOpacity:0.5};//画折线样式
			}
			function run(){
				var one = getBDPoint(currentIndex);
		        var two = getBDPoint(currentIndex+1);
		        lastPointForCenter = two;
		        var polyline = new BMap.Polyline([one,two], getLineOpt(currentIndex+1));
		        
		        // pathOverlay.push(polyline);
		        map.addOverlay(polyline);
		        addClickPoint(two);
		        tyhoonMark.setPosition(two);
		        initInfo(currentIndex);
		        // carMk.setPosition(two);
		        if(currentIndex++ < numOfPoints-2){
		            runTT = setTimeout(run,runDelay)
		        }else{
		        	try{
		        		var incPoint = $(loadXML('xml/'+info.attr('incPoint'))).children();
			        	var pathArr = [];
			        	incPoint.each(function(){
			        		var $this = $(this);
			        		pathArr.push(new BMap.Point($this.attr('x'), $this.attr('y')));
			        	});
			        	var polygon = new BMap.Polygon(pathArr, {strokeWeight: 1,strokeColor:'#7B9AE3',fillColor:'#7B9AE3',strokeOpacity:0.7,fillOpacity:0.7});
				        // pathOverlay.push(polygon);
				        map.addOverlay(polygon);
		        	}catch(e){console.log(e)}
		        }
			}
			runTT = setTimeout(run,1000);

			/*添加受影响城市*/
			var cityList = loadXML('xml/'+info.attr('city'));
			cityList = $(cityList).children().children();
			cityList.each(function(){
				var $this = $(this);
				var type = $this.attr('yx');
				var name = (type == 1 || type == 2)?type:3;
				var myIcon = new BMap.Icon('img/'+name+'.png?1', new BMap.Size(14, 14));
				var posPoint = new BMap.Point($this.attr('jd'), $this.attr('wd'));
				var carMk = new BMap.Marker(posPoint,{icon:myIcon,title:$this.attr('name')});
				map.addOverlay(carMk);

				var info = $this.attr('info');
				if(info){
					new infoWin('<br/>'+info).show(posPoint);
				}
			});
		}
		initTyphoon(0);
	})
}();