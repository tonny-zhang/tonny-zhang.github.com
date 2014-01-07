/*
功能：天气网产品播放组件
用法：$(function(){
		var player = new Player($('.test'));
		//若数据格式不是默认的处理，可重写配置中的‘parseData’，返回如：
		//{'zone':'中国','name':'降水量',data:[{{'t':'2013-07-25 05:35','s':'','m':'','l':''}}],'index':0,'showsize':'m'};
		$('.btn_change').click(function(){
			var href = $(this).data('href');
			player.config({
				href: href
			});
		}).eq(0).click();
	})
*/

(function(global){
	var _slider = (function(){
		var defaultConfig = {max:0,min:0,values:[0,0],step:1,dir:'lr'};
		var doc = $(document);
		
		/*滑动条，只支持左右或上下*/
		var Slider = function(container){
			var _this = this;
			_this.container = $(container);
			_this._num = 0;
			_this._config = $.extend(true,{},defaultConfig);
		}
		sliderProp = Slider.prototype;
		/*配置*/
		sliderProp.config = function(config){
			var _this = this;
			config = $.extend(true,_this._config,config);
			var _configMin = config.min;
			var _configMax = config.max;
			var vals = config.values;
			if(vals){
				vals[0] = vals[0] == 0 ? _configMin : Math.max(vals[0],_configMin);
				vals[1] = vals[1] == 0 ? _configMax : Math.min(vals[1],_configMax);
			}
			var _data = _this.data || (_this.data = {});

			var container = _this.container;
			var _width = container.width();
			var _height = container.height();
			var vals = config.values;
			var isLR = config.dir == 'lr';
			var step = config.step;
			var max = vals[1]/step;
			var min = vals[0]/step;
			var _stepLen = 0;
			var type;
			if(_configMax){
				if(isLR){
					_stepLen = _width/_configMax;
					type = 'left';
				}else{
					_stepLen = _height/_configMax;
					type = 'bottom';
				}
			}
			_data['stepLen'] = _stepLen;
			_data['min'] = min;
			_data['max'] = max;
			_data['step'] = step;
			_data['type'] = type;
			_data['isLR'] = isLR;
			_data['_width'] = _width;
			_data['_height'] = _height;

			_this._num = vals[0]/step;//设置成跨度的最小值
			_this._initEvent();
			return _this;
		}
		sliderProp._initEvent = function(){
			var _this = this;
			var _data = _this.data;
			var config = _this._config;

			if(_this._isInit){
				return;
			}
			_this._isInit = true;
			/*计算toIndex，并触发config.change*/
			var _change = function(toIndex){
				var step = _data.step;
				var min = config['min']/step,
					max = config['max']/step;
				var _changeEvent = config.change||function(){}
				if(toIndex < min){
					toIndex = min;
				}else if(toIndex > max){
					toIndex = max;
				}

				var data = {val:toIndex * step,n:toIndex};
								
				if(_this._num != toIndex){
					_this._num = toIndex;
					var stepLen = _data.stepLen;
					if(stepLen > 0){
						data['typeVal'] = stepLen * step * toIndex;
						_changeEvent(data);
					}
				}
				//返回data,方便扩展
				return data;
			}
			/*对外接口 value为定义的值*/
			_this.change = function(value){
				return _change(_getTo(value/_data.step));
			};
			/*上一个*/
			_this.prev = function(){
				return _change(_this._num-1);
			}
			/*下一个*/
			_this.next = function(){
				return _change(_this._num+1);
			}
			var _startDrag = function(e){
				doc.on('mousemove',_drag);
			}
			/*得到和其值最接近的整数*/
			var _getTo = function(v){
				var small = Math.floor(v);
				var big = Math.ceil(v);
				return v - small > big - v ? big:small;
			}
			var _drag = function(e){
				var _width = _data['_width'];
				var _height = _data['_height'];
				var offset =  _this.container.offset();
				var max = config['max']/config['step'];
				var x = e.pageX - offset.left;
				var y = e.pageY - offset.top;
				var toPerX = _getTo(x/_width * max);
				var toPerY = max-_getTo(y/_height * max);//从下往上
				_change(_data.isLR?toPerX:toPerY);
			}
			var _endDrag = function(){
				doc.off('mousemove',_drag);
				(_this._config.stop || function(){})();
			}
			/*绑定事件*/
			_this.container
			.click(function(e){
				_drag(e);
				_endDrag();
			})
			.mousedown(_startDrag).mouseup(_endDrag).mouseleave(_endDrag);
		}
		return Slider
	})();

	var noImg = 'http://product.weather.com.cn/m/i/tqld/no_product.jpg';
	var defaultConfig = {href:'',isNotice:true};
	var defaultData = {'zone':'','name':'','data':[],'index':0,'showsize':'m'};

	var duibiHtml = '';//'<span class="contrast"></span>';
	//player整体tpl
	var playerHtml = '<div class="player">\
						<div class="img"></div>\
						<div class="toolbar">\
							<span class="span"></span>\
							<span class="play"></span>\
							<span class="prev"></span>\
							<span class="next"></span>\
							<div class="speed">\
								<div class="bg_select"><span class="handleP"><span class="handle"></span></span></div>\
								<input class="speedTxt" value="1秒"/>\
							</div>\
							<div class="progress ui-br3">\
								<span class="handle"><i class="ui-br3"></i></span>\
								<span class="range bg_play"></span>\
							</div>\
							<a class="showbig" target="_blank"></a>\
							'+duibiHtml+'\
						</div>\
					</div>';
	//player,播放handle tpl
	var playerHandleHtml = '<span class="handle" style="left:100px"><i class="ui-br3"></i></span>';
	//播放进度条tpl
	var playerProcessHtml = '<span class="range bg_play" style="left:100px;width:100px;"></span>';
	//跨度背景tpl
	var playerRangeHtml = '<span class="handle left"><i class="ui-br3"></i></span>\
					<span class="handle right"><i class="ui-br3"></i></span>\
					<span class="range bg_span"></span>';
	//loading tpl
	var loadingHtml = '<span class="loading"></span>';
	//播放handle上的提示tpl 
	var noticeHtml = '<div class="notice"><p></p><span class="first">▼</span><span class="second">▼</span></div>';
	var playerArr = [];
	var Player = function(container,config){
		var _this = this;
		_this.player = $(playerHtml).appendTo($(container));
		_this.config(config);
		playerArr.push(_this);
	};
	var playerProp = Player.prototype;
	/*配置，可用于动态更改值*/
	playerProp.config = function(config){
		this._config = $.extend({},defaultConfig,config);

		this._initEvent();
	}
	/*加载jsonp数据，后期可以在这里进行数据缓存*/
	playerProp._loadData = function(href){
		var _this = this;
		_this.loading();
		// $.getScript(href,function(){
		// 	console.log(arguments);
		// 	_this.loading.stop();
		// });
		$.ajax(href,{
			'dataType':'script',
			'cache': true,
			'complete':function(){
				_this.sliderProgress.data.isPlayed = false;
				_this.loading.stop();
			}
		});
	}
	/*绑定事件*/
	playerProp._initEvent = function(){
		var _this = this;
		var _player = _this.player;

		var config = _this._config;
		var href = config.href;
		if(href){
			_this._loadData(href);
		}
		var progress = _player.find('.progress');
		var progressHandle = progress.find('.handle');
		//处理提示
		if(config.isNotice){
			var notice = progressHandle.data('notice');
			if(!notice){
				notice = $(noticeHtml).appendTo(progressHandle);
				progressHandle.data('notice',notice);
			}
			progress.mouseenter(function(){
				notice.show();
			}).mouseleave(function(){
				notice.hide();
			});
		}
		if(_this._isInit){
			return;
		}
		_this._isInit = true;
		//是否正在进行跨度操作
		var _isKuadu = function(){
			return $kuadu.hasClass('on');
		}
		var _getDelay = (function(){
			var _delay = 1000;
			var speed = _player.find('.speed').click(function(){
				sliderSpeed.change(_delay);
				speedPanel.show();
			}).mouseleave(function(){
				speedPanel.hide();
			});
			var speedPanel = speed.find('.bg_select');
			var speedContainer = speedPanel.find('.handleP');
			var speedHandle = speedContainer.find('.handle');
			var speedTxt = speed.find('.speedTxt');
			var sliderSpeed = new _slider(speedContainer);
			
			//配置时间间隔选择面板
			sliderSpeed.config({
				max: 2000,
				min: 300,
				step: 100,
				dir: 'tb',
				stop: function(){
					
				},
				change: function(v){
					var data = sliderSpeed.data;
					speedHandle.css(data.type,v.typeVal);
					_delay = v.val;
					speedTxt.val(_delay/1000+'秒');
				}
			});
			return function(){
				return _delay;
			}
		})();
		var playRange = progress.find('.bg_play');
		var sliderProgress = new _slider(progress);
		//配置进度条
		sliderProgress.config({
			dir: 'lr',
			stop: function(){
				
			},
			change: function(v){
				var data = sliderProgress.data;
				var toIndex = v.n;
				var toLeft = v.typeVal;
				var isKuadu = _isKuadu();
				var isResetHandle = false;
				var isNextOrPrev = $kuadu.data('np');
				if(isKuadu){
					if($play.hasClass('pause') || isNextOrPrev){
						$play.data('range_left',toLeft);
						isResetHandle = true;
					}else{
						var handleLeft = $kuadu.data('handleLeft');
						var handleRight = $kuadu.data('handleRight');
						var range = $kuadu.data('range');

						var _left_left = handleLeft.position().left;
						var _right_left = handleRight.position().left;

						var _values = sliderProgress._config.values;

						if(Math.abs(toLeft - _left_left) < Math.abs(toLeft - _right_left)){//左跨度
							var handle = handleLeft;
							var _w = _right_left - toLeft;
							$play.data('range_left',toLeft);
							_values[0] = toIndex;
							var bg_left = toLeft;
						}else{
							var handle = handleRight;
							var _w = toLeft - _left_left;
							_values[1] = toIndex;
							var bg_left = _left_left;
						}
						
						sliderProgress.config({
							values: _values
						});
						handle.css('left',toLeft);
						range.css({'left':bg_left,'width': _w});
					}
				}else{
					$play.data('left',toLeft);
					isResetHandle = true;
				}
				$kuadu.data('np',false);
				var largeImg = _this.data.data[_this.data.index]['l'];
				$showbig.attr('href',largeImg);
				if(isResetHandle){
					var notice = progressHandle.data('notice');
					if(notice){
						notice.find('p').text(_this.getCurrentData()['t']);
					}
					_resetPlayHandle();
					_this.showData(v.n)
				}
			}
		});

		/*重置播放handle和进度条的样式*/
		var _resetPlayHandle = function(){
			var config = sliderProgress._config;
			var range_values = config.values;
			if(_isKuadu()){
				var dataName = 'range_left';
				var minLeft = range_values[0];
			}else{
				var dataName = 'left';
				var minLeft = config.min;
			}			
			var hand_left = $play.data(dataName);
			progressHandle.css('left',hand_left);
			var data = sliderProgress.data;
			var stepLen = data.stepLen;
			var rangeLeft = minLeft * stepLen;
			playRange.css({'left':rangeLeft,'width': hand_left - rangeLeft});
		}
		/*重置sliderProgress的开始索引*/
		var _resetPlayIndex = function(){
			//重置播放的起始索引
			sliderProgress._num = $play.data(_isKuadu()?'range_left':'left')/sliderProgress.data['stepLen'];
		}
		/*显示进度条*/
		var _showHandle = function(){
			progressHandle.show();
			playRange.show();
		}
		/*隐藏进度条*/
		var _hideHandle = function(){
			progressHandle.hide();
			playRange.hide();
		}
		_this.sliderProgress = sliderProgress;

		//初始化前后按钮
		_player.find('.prev,.next').click(function(){
			if(isPlaying){
				_stop();//防止在播放过程中操作，出现抖动现象 [ 先停止，操作完后再启动 ]
				var start = true;
			}
			$kuadu.data('np',true);
			_showHandle();
			sliderProgress[$(this).attr('class')]();
			start && $play.click();
		});
		//初始化跨度按钮
		var $kuadu = _player.find('span.span').click(function(){
			_stop();
			var $this = $(this);
			var _range = $this.data('$range');
			if(!_range){
				_range = $(playerRangeHtml).appendTo(progress);
				var handles = _range.filter('.handle');
				$kuadu.data('handleLeft',handles.eq(0));
				$kuadu.data('handleRight',handles.eq(1));
				$kuadu.data('range',_range.filter('.range'));
				$kuadu.data('$range',_range);
			}
			if($this.hasClass('on')){
				$this.removeClass('on');
				_resetPlayHandle();
				_showHandle();
				_range.hide();
			}else{
				var config = sliderProgress._config;
				$play.data('range_left',config.values[0]*sliderProgress.data['stepLen']);//初始化到跨度最左
				_hideHandle();
				_range.show();
				$this.addClass('on');
			}		
			_resetPlayIndex();//重置开始索引
		});
		//在$play上绑定playHandle的位置信息 $play.data('left',120)
		var $play = _player.find('span.play').click(function(){
			_resetPlayHandle();
			_showHandle();
			var $this = $(this);
			if($this.hasClass('pause')){
				_stop();
				if(_isKuadu()){
					_hideHandle();
				}
			}else{
				_resetPlayIndex();
				$this.addClass('pause');
				_play(_this);
			}
		});
		var $showbig = _player.find('a.showbig');
		var playTT;
		var isPlaying = false;
		/*停止播放*/
		var _stop = function(){
			isPlaying = false;
			clearTimeout(playTT);
			$play.removeClass('pause');
		}
		//给内容其它方法使用
		_this._stop = _stop;
		/*播放*/
		var _play = function(){
			isPlaying = true;
			clearTimeout(playTT);
			var data = sliderProgress.data;
			var _config = sliderProgress._config;
			var vals = _config.values;
			var isKuadu = _isKuadu();

			var minIndex = isKuadu?vals[0]:_config.min;
			var maxIndex =  isKuadu?vals[1]:_config.max;
			if(!data.isPlayed && sliderProgress._num == maxIndex){
				data.isPlayed = true;
				sliderProgress.change(minIndex);
				_play();
				return;
			}
			playTT = setTimeout(function(){
				var d = sliderProgress.next();
				if(maxIndex <= d.n){//已经播放到最后一个
					setTimeout(function(){
						_this.data.index = minIndex;
						sliderProgress.change(minIndex * data.step);
						_stop();
						if(_isKuadu()){//防止在拖动跨度左handle时，显示播放handle位置错误
							_hideHandle();
						}
					},_getDelay());
				}else{
					_play();
				}
			},_getDelay());
		}
	}
	/*显示加载面板*/
	playerProp.loading = function(){
		var _this = this;
		var _player = this.player;
		var loading = _player.data('loading');
		if(!loading){
			loading = $(loadingHtml).appendTo(_player.find('.img'));
			_player.data('loading',loading);
			playerProp.loading.stop = function(){
				loading.hide();
			}
		}
		loading.show();
	}
	/*重置（主要是跨度）*/
	playerProp._reset = function(){
		var _this = this;
		var _player = _this.player;
		var sliderProgress = _this.sliderProgress;
		var $kuadu = _player.find('span.span');
		var $play = _player.find('span.play');
		var $range = $kuadu.data('$range');
		if($range){
			$range.removeAttr('style').hide();
		}
		_this._stop();//停止之前的播放
		var config = sliderProgress._config;
		var minLeft = config.min * sliderProgress.data['stepLen'];
		$play.data('left',minLeft).data('range_left',minLeft);//初始化到跨度最左
		$kuadu.addClass('on').click();
	}
	/*初始化数据并处理进度条*/
	playerProp.initData = function(data){
		var _this = this;
		_this.data = data = $.extend({},defaultData,_this._config.parseData(data));
		var max = data.data.length-1;
		var sliderProgress = this.sliderProgress.config({
			min: 0,
			max: max,
			values: [0,max]
		});
		_this._reset();
		sliderProgress.change(max);
	}
	/*加载图片数据并显示*/
	playerProp.showData = function(index){
		var _this = this;
		var data = _this.data;
		var selectIndex = index || 0;
		var imgData = data.data;
		var selectData = imgData[selectIndex];
		_this.loading();
		var img = new Image();
		var _loaded = function(src,width){
			if(_this.watingImg == src){
				_this.loading.stop();
				var $img = _this.player.find('.img>img');
				if($img.length == 0){
					var imgContainer = _this.player.find('.img');
					$img = $('<img>').appendTo(imgContainer);
				}
				$img.attr('src',src);
				$img.attr('width',Math.min($img.parent().width(),width))
				$img.attr('title',selectIndex);
				data.index = selectIndex;
				delete _this.watingImg;
			}
		}
		img.onload = function(){
			_loaded(this.src,this.width);
		}
		img.onerror = function(){
			_loaded(noImg);
		}
		var imgSrc = selectData[data['showsize']];//+'?'+Math.random();
		img.src = imgSrc;
		_this.watingImg = imgSrc;
	}
	/*得到当前的值*/
	playerProp.getCurrentData = function(){
		return this.data.data[this.data.index];
	}
	//定义默认的处理数据函数
	;(function(){
		$.extend(defaultConfig,{
			'parseData': function(data){
				var tempDate = [];
				var imgHttp = 'http://i.weather.com.cn/i/product/pic/'
				for(var i = 0,d = data.jsl,j=d.length;i<j;i++){
					var _d = d[i];
					var _imgName = _d['fn'];
					tempDate.push({'t':_d['dt'],'s':imgHttp+'s/'+_imgName,'m':imgHttp+'m/'+_imgName,'l':imgHttp+'l/'+_imgName});
				}
				return {'zone':data['cn'],'name':data['ys'],data:tempDate,'index':tempDate.length-1,'showsize':'m'};
			}
		});
	})();
	global.Player = Player;
	//暂时这么定义
	global.readerinfo = function(data){
		for(var i = 0,j = playerArr.length;i<j;i++){
			playerArr[i].initData(data);
		}
	}
})(this);