// JavaScript Document
define("GeoMap",["zrender","zrender/tool/util"],
	function(zrender,util){
		var seft = {};
		var geomap = seft;
		var _idx = 0;           //GeoMap instance's id
        var _instances = {};    //GeoMap实例map索引
		seft.version = '1.0.4';
		seft.init = function (cfg)
		{
			var gm = new GeoMap(++_idx,cfg);
			_instances[_idx] = gm;
			return gm;
		}
		/**
         * debug日志选项：catchBrushException为true下有效
         * 0 : 不生成debug数据，发布用
         * 1 : 异常抛出，调试用
         * 2 : 控制台输出，调试用
         */
        seft.debugMode = 0;
        seft.log = function() {
            if (seft.debugMode === 0) {
                return;
            }
            else if (seft.debugMode == 1) {
                for (var k in arguments) {
                    throw new Error(arguments[k]);
                }
            }
            else if (seft.debugMode > 1) {
                for (var k in arguments) {
                    console.log(arguments[k]);
                }
            }
            return seft;
        };
		//GeoMap 对象所有暴露接口在这里定义
		 function GeoMap (id,cfg){
			var seft = this;
			 seft.defaultCfg = {  //默认配置选项
					offset:null,
					showName:false,
					mapStyle:{						
						hoverable:false,
						clickable:true,
						onclick:function(){},
						style:{
							strokeColor:"#3D534E",
							// color : '#D6E6DA',
							color: '#fff',
							textColor : "#f00",
							textPosition : "left",
							brushType : 'both'
							
						}
					},
					weatherStyle:{
						hoverable:false,
						clickable:true,
						zlevel:1,
						style:{
							strokeColor:"rgba(25, 206, 250, 0.8)",
							color : '#00f',
							textColor : '#f00',
							textPosition :'bottom',
							r:16
						}
					}
				};
			util.mergeFast(cfg, seft.defaultCfg,false,true);  //合并配置选项并存下来
			seft.config=cfg;
			
			seft.container = document.getElementById(seft.config.container);
			if (seft.container.length == 0){
				geomap.log("传入ID无法在页面中找到！");
				return  false;
			}
			seft.zr = zrender.init(seft.container);
			seft.width = seft.defaultCfg.width || seft.zr.getWidth();
			seft.height = seft.defaultCfg.height || seft.zr.getHeight();
			seft.offset = seft.config.offset;
			self.scale =  seft.config.scale;
			seft.paths = null;
			seft.weatherShapes = [];
			var convertor = new  Convertor();
			seft.load =function (json,cfg){
				if (cfg){
						seft.updateCfg(cfg);
				}
				 seft.json=json;
				 seft.paths = convertor.json2path(json, seft);
				
				 for (i in seft.paths )
				 {
					util.mergeFast(seft.paths[i], seft.config.mapStyle,false,true); 
					seft.zr.addShape(seft.paths[i]); 
				 }
			}
			seft.render = function (){
				seft.zr.render();	
			}
			seft.updateCfg=function(cfg,isCover){
				if (isCover){
				util.mergeFast(cfg, seft.defaultCfg,false,true);  
				}else{
				util.mergeFast(cfg, seft.config,false,true);  			
				}
				seft.config=cfg;
			}
			seft.loadWeather= function (json,showid,cfg){
				if (cfg){
						seft.updateCfg(cfg);
				}
				for (spaheid in seft.weatherShapes ){
					seft.zr.delShape(seft.weatherShapes[spaheid]);
				}
				seft.weatherShapes = [];
				seft.weatherjson = json;
				seft.weatherpaths = convertor.json2path(json, seft);
				geomap.log(seft.weatherpaths );
				if (showid){
					seft.weatherShowid= showid ;
				}else {
					seft.weatherShowid= undefined ;
				}				
				for (i in seft.weatherpaths )
				{
					
					if (showid)
					{
						seft.weatherShowid=showid;
						geomap.log(seft.weatherpaths[i].pshapeId);
						if (seft.weatherpaths[i].pshapeId != showid) continue;
					}
					util.mergeFast(seft.weatherpaths[i], seft.config.weatherStyle,false,true); 
					seft.zr.addShape(seft.weatherpaths[i]);
					geomap.log(seft.weatherpaths[i]);
					seft.weatherShapes.push(seft.weatherpaths[i].id);
				}
			}
			seft.refresh = function (){
				seft.zr.refresh();
			}
			seft.clear = function (){
				  convertor.scale = null;
				  convertor.offset =null;
				  convertor.pathArray = [];
				  seft.weatherShapes = [];
				  seft.scale = null;
				  seft.offset =null;
				  seft.zr.clear();
			 },
			 seft.refreshWeather = function (showid){
			 		for (spaheid in seft.weatherShapes ){
						seft.zr.delShape(seft.weatherShapes[spaheid]);
					}
					seft.weatherShapes = [];
					seft.weatherpaths = convertor.json2path(seft.weatherjson, seft);
					if (showid){
					seft.weatherShowid= showid ;
				}else {
					seft.weatherShowid= undefined ;
				}
					
					for (i in seft.weatherpaths )
					{
						if (showid)
						{ 
							geomap.log(seft.weatherpaths[i].pshapeId);
							if (seft.weatherpaths[i].pshapeId != showid) continue;
						}
						util.mergeFast(seft.weatherpaths[i], seft.config.weatherStyle,false,true); 
						//newShapeid = seft.zr.newShapeId('weatherShape');
						//seft.weatherpaths[i].id=newShapeid;
						seft.zr.addShape(seft.weatherpaths[i]);
						seft.weatherShapes.push(seft.weatherpaths[i].id);
					}
					seft.refresh();
			 },
			 seft.resize = function (){
			 	seft.zr.resize();
				seft.clear();
				seft.width = seft.defaultCfg.width || seft.zr.getWidth();
				seft.height = seft.defaultCfg.height || seft.zr.getHeight();
				seft.load(seft.json);
				seft.refreshWeather(seft.weatherShowid);
				//seft.refresh();
			 }
			return seft;
		 }
		 //遍历地图数据中的各种数据的点坐标，然后计算出最大和最小的经纬度值,并且存储下来
		 function Convertor_parse (){
		 		var seft = this;
		 		//遍历各种数据点的方法
				seft.formatPoint =  function (p){
					return [
					  (p[0] < -168.5 ? p[0] + 360 : p[0]) + 170,
					  90 - p[1]
					];
				}
				seft.makePoint =function(p){
					  point =seft.formatPoint(p),
					  x = point[0],
					  y = point[1];
					if(seft.xmin > x) seft.xmin = x;
					if(seft.xmax < x) seft.xmax = x;
					if(seft.ymin > y) seft.ymin = y;
					if(seft.ymax < y) seft.ymax = y;
				  },
				  seft.Point =function(coordinates){
					seft.makePoint(coordinates);
				  },
				 seft.LineString = function(coordinates){
					var seft = this,
					  i = 0,
					  len = coordinates.length;
					for( ; i < len; i++){
					  seft.makePoint(coordinates[i]);
					}
				  },
				  seft.Polygon = function(coordinates){
					var i = 0,
					  len = coordinates.length;
				
					for(; i < len; i++){
					  seft.LineString(coordinates[i]);
					}
				  },
				  seft.MultiPoint= function(coordinates){
					var i = 0,
					  len = coordinates.length;
					for(; i < len; i++){
					  seft.Point(coordinates[i]);
					}
				  },
				  seft.MultiLineString = function(coordinates){
					var i = 0,
					  len = coordinates.length;
					for(; i < len; i++){
					  seft.LineString(coordinates[i]);
					}
				  },
				  seft.MultiPolygon = function(coordinates){
					var i = 0,
					  len = coordinates.length;
					for(; i < len; i++){
					  seft.Polygon(coordinates[i]);
					}
				  }
		 		  //传入原始数据地图数据，然后根据不同数据类型调用不同的数据解析方法
				  seft.parseSrcSize = function(json){
				  	  var
						shapes = json.features,
						shapeType,
						shapeCoordinates,
						geometries,
						i, j,
						len, len2,
						val,
						shape;
					  //默认范围为全球范围
					  seft.xmin = 360;
					  seft.xmax = 0;
					  seft.ymin = 180;
					  seft.ymax = 0;
					  for(i = 0, len = shapes.length; i < len; i++){
						shape = shapes[i];
						if(shape.type == 'Feature'){
						  seft.pushApath(shape.geometry, shape);
						}else if(shape.type = 'GeometryCollection'){
						  geometries = shape.geometries;
						  for(j = 0, len2 = geometries.length; j < len2; j++){
							val = geometries[j];
							seft.pushApath(val, val);
						  }
						}
					  }
					  seft.srcSize = {
						left: seft.xmin.toFixed(4) * 1,
						top: seft.ymin.toFixed(4) * 1,
						width: (seft.xmax - seft.xmin).toFixed(4) * 1,
						height: (seft.ymax - seft.ymin).toFixed(4) * 1
					  };
				  }
				  seft.pushApath =  function (gm){
					shapeType = gm.type;
					shapeCoordinates = gm.coordinates;
					seft[shapeType](shapeCoordinates);
				  }
		 		return seft;
		 }
		 
		 function Convertor()
		 {
			var seft = this; 
			seft.pathArray = [];
			seft.json2path = function (json,obj){
				if(!json || !obj){
					return
				}
				seft.pathArray = [];
				//geomap.log(seft.pathArray);
				 var
					shapes = json.features,
					shapeType,
					shapeCoordinates,
					str,
					geometries,
					i, j,
					len, len2,
					val,
					shape;
					seft.scale = null;
					seft.offset = null;
					convertor_parse = new Convertor_parse();

					if((!obj.scale || !obj.offset) && !convertor_parse.srcSize){
						convertor_parse.parseSrcSize(json);
						
					}
					 if(!obj.offset){
						obj.offset = {
						  x: convertor_parse.srcSize.left,
						  y: convertor_parse.srcSize.top
						};
					}else if(convertor_parse.srcSize){
						obj.offset.x = convertor_parse.srcSize.left + obj.config.offset.x;
						obj.offset.y = convertor_parse.srcSize.top + obj.config.offset.y;
				   }
				  if(!obj.scale){
					var temx = obj.width / convertor_parse.srcSize.width,
						temy = obj.height / convertor_parse.srcSize.height;
					/*
					temx > temy ? temx = temy : temy = temx;
					temx = temy * 0.73;
					*/
					
					if (temx > temy*073)
					{
						temx = temy*0.73;
						//temy = temy;
					}else
					{
						//temx = temy;
						
						temx/0.73 > temy ? temx = temy*0.73 :temy = temx/0.73;
						//temy = temx/0.73 ;
						
					}
					
					obj.scale = {
					  x: temx,
					  y: temy
					};
				  }
				  seft.scale = obj.scale;
				  seft.offset = obj.offset;
				  for(i = 0, len = shapes.length; i < len; i++){
					shape = shapes[i];
					//geomap.log(shape.type);	
					if(shape.type == 'Feature'){
					  seft.pushApath(shape.geometry, shape,obj);
					}else if(shape.type == 'GeometryCollection'){
					  geometries = shape.geometries;
					  for(j = 0, len2 = geometries.length; j < len2; j++){
						val = geometries[j];
						seft.pushApath(val, val,obj);
					  }
					}
				  }
				  return seft.pathArray;
			}
			seft.pushApath = function (gm, shape,obj){
				shapeType = gm.type;
				shapeCoordinates = gm.coordinates;
				polygonList = seft[shapeType](shapeCoordinates);
				if (shapeType == 'Point'){
				   //geomap.log(polygonList);
					var shapeObj={
							shape : 'text',
							//clickable : true,
							//hoverable:false,
							style : {
								text:shape.properties.value,
								x:polygonList[0],
								y:polygonList[1]
							},
							draggable : false
						};
					 if (shape.properties.color !== undefined ){
						 shapeObj.style.color=shape.properties.color;
					 }
					 if (shape.properties.prov_name !== undefined ){
						 shapeObj.pshapeId=shape.properties.prov_name;
					 }
					 if (!shapeObj.id)
					 {
						var newShapeid = obj.zr.newShapeId('weatherShape');
						shapeObj.id=newShapeid;
					 }
					 seft.pathArray.push(shapeObj);
				}else if (shapeType == 'PointCircle'){
					var shapeObj={
							shape : 'circle1',
							id : shape.properties.id||obj.zr.newShapeId('weatherShape'),
							style : {
								x:polygonList[0],
								y:polygonList[1]
							}
					 };
					 if (obj.config.showName)shapeObj.style.text=shape.properties.text;
					 if (shape.properties.color !== undefined ){
						 shapeObj.style.color=shape.properties.color;
					 }
					 if (shape.properties.title !== undefined ){
						 shapeObj.style.title=shape.properties.title;
					 }
					 if (shape.properties.prov_name !== undefined ){
						 shapeObj.pshapeId=shape.properties.prov_name;
					 }
					 seft.pathArray.push(shapeObj);
				}else if (shapeType == 'PointImage'){
					var shapeObj={
							shape : 'image',
							id : shape.properties.id||obj.zr.newShapeId('weatherShape'),
							style : {
								x:polygonList[0],
								y:polygonList[1]
							}
					 };
					 util.mergeFast(shapeObj.style, shape.properties,false,true); 
					 if (shape.properties.prov_name !== undefined ){
						 shapeObj.pshapeId=shape.properties.prov_name;
					 }
					 if (shape.properties.rotation !== undefined ){
						 shapeObj.rotation =  new Array();
						 shapeObj.rotation[0]=shape.properties.rotation/180*Math.PI;
						 shapeObj.rotation[1]= parseFloat(polygonList[0]);
						 shapeObj.rotation[2]= parseFloat(polygonList[1]+ parseInt(shapeObj.style.height));
						 //现所有旋转统一从文件左下角进行。
					 }
					 geomap.log(shapeObj);
					 seft.pathArray.push(shapeObj);
				
				}
				
				
				if (shapeType == 'Polygon' || shapeType == 'MultiPolygon')
				{
					for (polygoni in polygonList )
					{
						
						
						var shapeObj={
							shape : 'polygon',
							hoverable:false,
							zlevel:0,
							id:shape.id,
							style : {
								pointList : polygonList[polygoni],
							}
						};
						seft.pathArray.push(shapeObj);
						//显示地图区域名称
						//geomap.log(obj.config.showName);
						if (obj.config.showName){
							cp= seft['makePoint'](shape.properties.cp);
							seft.pathArray.push({
								shape : 'text',
								id:shape.id+'text',
								zlevel:2,
								clickable : true,
								hoverable:false,
								style : {
									text:shape.properties.name,
									x:cp[0],
									y:cp[1],
									color:"rgba(0,0,0,1)"
								},
								draggable : false
							});
						}
					}
				}
			  }
			  seft.formatPoint=function(p){
				return [
				  (p[0] < -168.5 ? p[0] + 360 : p[0]) + 170,
				  90 - p[1]
				];
			  },
			  seft.makePoint = function(p){
				var self = this,
				  point = self.formatPoint(p),
				  x = (point[0] - seft.offset.x) * seft.scale.x,
				  y = (point[1] - seft.offset.y) * seft.scale.y;
				return [x, y];
			  },
			 seft.Point = function(coordinates){
				coordinates = seft.makePoint(coordinates);
				return coordinates;
			  },
			  seft.PointCircle = function(coordinates){
				coordinates = seft.makePoint(coordinates);
				return coordinates;
			  },
			  seft.PointImage = function(coordinates){
				coordinates = seft.makePoint(coordinates);
				return coordinates;
			  },
			  seft.LineString = function(coordinates){
				var str = '',
				//  self = this,
				  i = 0,
				  len = coordinates.length,
				  point;
				var pointList = new Array();
				for( ; i < len; i++){
				  point = seft.makePoint(coordinates[i]);
				  pointList.push(point);
				}
				return pointList;
			  },
			 seft.Polygon = function(coordinates){
				var str = '',
				  i = 0,
				  len = coordinates.length;
				var polygonList = new Array();
				for(; i < len; i++){
				  polygonList.push(seft.LineString(coordinates[i]));
				}
				return polygonList;
			  },
			 seft.MultiPoint = function(coordinates){
				var arr = [],
				  i = 0,
				  len = coordinates.length;
				for(; i < len; i++){
				  arr.push(seft.Point(coordinates[i]));
				}
				return arr;
			  },
			 seft.MultiLineString = function(coordinates){
				var str = '',
				  i = 0,
				  len = coordinates.length;
				for(; i < len; i++){
				  str += seft.LineString(coordinates[i]);
				}
				return str;
			  },
			  seft.MultiPolygon = function(coordinates){
				var str = '',
				  i = 0,
				  len = coordinates.length;
				  var arr= [];
				for(; i < len; i++){
				  arr=arr.concat(seft.Polygon(coordinates[i]));
				}
				return arr;
			  }
			return seft;
		 }
		 return seft;
	}
);