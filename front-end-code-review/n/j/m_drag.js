(function(){
	var MOUSEOVER_CLASS = 'drag_mouseover';
	var DRAG_CONTAINER_CLASS = 'drag_container';
	var DRAG_MOVE_CLASS = 'drag_move';
	var DRAG_PLACEHOLDER_CLASS = 'drag_placeholder';
	var DRAG_OPACITY_CLASS = 'drag_opacity';
	var DRAG_MOVE_ON_CLASS = 'on';

	var STR_MOUSEDOWN = 'mousedown';
	var STR_MOUSEMOVE = 'mousemove';
	var STR_MOUSEUP = 'mouseup';
	var STR_MOUSEENTER = 'mouseenter';
	var STR_MOUSELEAVE = 'mouseleave';

	var EVENT_START_MOVE = 'startmove';
	var EVENT_MOVE = 'move';
	var EVENT_END_MOVE = 'endmove';

	function init(Event){
		var $doc = $(document);
		//forbade document select
		$doc.on('selectstart',function(){
			return false; 
		});
		var defaultConfig = {
			'container': $(window)//移动元素可移动的容器范围
			,'dragHandle': null//可以拖动的元素，即响应mousedown事件
			,'getMoveHandle': function(){//得到移动元素，'this' is dragHandle
				return $(this);
			}
			,'getLayoutContainer': null//得到拖动元素布局容器
			,'animal': false//设置动画的速度,参考：http://www.w3school.com.cn/jquery/effect_animate.asp (speed)
		};
		var _inherits = W.util.inherits;
		/*得到元素的宽度*/
		var _width = function($obj,isWindow){
			return isWindow?$obj.width():$obj.get(0).offsetWidth;
		}
		/*得到元素的高度*/
		var _height = function($obj,isWindow){
			return isWindow?$obj.height():$obj.get(0).offsetHeight;
		}
		/*当前元素是否不参加布局，即这个元素不可拖动*/
		var _isnotLayout = function($obj){
			return !!$obj.data('notlayout');
		}
		var Drag = _inherits(Event,{
			'init': function(config){
				var _this = this;
				_this.config = config = $.extend({},defaultConfig,config);
				var getMoveHandle = config.getMoveHandle;
				config.getMoveHandle = $.isFunction(getMoveHandle)? 
				function($relativeObj){
					return getMoveHandle.call($relativeObj||$dragHandle);
				}:function($relativeObj){
					return $relativeObj || $dragHandle;
				}
				/*得到布局最小容器*/
				var getLayoutContainer = config.getLayoutContainer;
				config.getLayoutContainer = $.isFunction(getLayoutContainer)?function($obj){
					return getLayoutContainer($obj);
				}:function($obj){
					//保持和添加的临时div一致
					return $container.find('.'+DRAG_CONTAINER_CLASS).slice(0);//防止后面直接类数组操作
				}
				//存数据，文件扩展
				var data = _this.data = {};

				var $container = $(config.container);
				var isWin = data['isWin'] = $container.is($(window));
				if(isWin){
					$('body').addClass(DRAG_CONTAINER_CLASS);
				}else{
					// 把子元素用新元素包起来，防止容器元素的float和position:relative冲突
					var $tempContainer = $('<div>').addClass(DRAG_CONTAINER_CLASS);
					$container.wrapInner($tempContainer);
				}
				var $dragHandle = $(config.dragHandle);
				_this._initDragEvent($dragHandle);
				data['dragHandle'] = $dragHandle;
				data['container'] = $container;
			}
			,'prototype': {
				/*初始化拖动元素事件*/
				'_initDragEvent': function($dragHandle){
					var _this = this;
					var _getMoveHandle = _this.config.getMoveHandle;
					$dragHandle.on(STR_MOUSEENTER,function(e){
						var _t = this;
						e.target = _t;
						_this.emit(STR_MOUSEENTER,e);
						var $this = $(_t);
						if(!_isnotLayout(_getMoveHandle($this))){
							$this.addClass(MOUSEOVER_CLASS);
						}
					}).on(STR_MOUSELEAVE,function(e){
						var _t = this;
						e.target = _t;
						_this.emit(STR_MOUSELEAVE,e);
						var $this = $(_t);
						if(!_isnotLayout(_getMoveHandle($this))){
							$this.removeClass(MOUSEOVER_CLASS);
						}
					}).on(STR_MOUSEDOWN,function(e){
						//只允许鼠标左键,jquery e.which 1:左键;2:中键;3:右键
						if(e.which != 1){
							return;
						}
						e.target = this;
						_this.emit(STR_MOUSEDOWN,e);
					}).on(STR_MOUSEUP,function(e){return;
						e.target = this;
						_this.emit(STR_MOUSEUP,e);
					});
				},
				/*拖动*/
				'drag': function(){
					var _this = this;
					var config = _this.config;
					var data = _this.data;

					var isWin = data['isWin'];
					var $container = data['container'];
					
					var $dragHandle = data['dragHandle'];
					//鼠标按下事件
					_this.on(STR_MOUSEDOWN,function(e_mousedown){
						e_mousedown.stopPropagation();
						var $this = $(e_mousedown.target);
						var $moveHandle = config.getMoveHandle($this);
						if(_isnotLayout($moveHandle)){
							return;
						}
						_this.emit(EVENT_START_MOVE,e_mousedown);
						$moveHandle.addClass(DRAG_MOVE_CLASS);
						var $moveObj = $moveHandle.addClass(DRAG_MOVE_ON_CLASS);

						var c_width = _width($container,isWin);
						var c_height = _height($container,isWin);
						var m_height = _height($moveObj);
						var m_width = _width($moveObj);
						var x_down = e_mousedown.pageX;
						var y_down = e_mousedown.pageY;
						var m_offset = $moveObj.offset();
						var m_left = m_offset.left;
						var m_top = m_offset.top;
						var x_cha = x_down - m_left;
						var y_cha = y_down - m_top;
						if(isWin){
							var c_left = 0;
							var c_top = 0;
						}else{
							var c_offset = $container.offset();
							var c_left = c_offset.left;
							var c_top = c_offset.top;
						}
						//鼠标移动事件
						$doc.on(STR_MOUSEMOVE,function(e_mousemove){
							var x_move = e_mousemove.pageX;
							var y_move = e_mousemove.pageY;
							var left = x_move - c_left - x_cha;
							left < 0 && (left = 0);
							left + m_width > c_width && (left = c_width - m_width);

							var top = y_move - c_top - y_cha;
							top < 0 && (top = 0);
							top + m_height > c_height && (top = c_height - m_height);
							var _offset = {'left': left,'top': top};
							e_mousemove.target = $this;//reset e.target
							_this.emit(EVENT_MOVE,$.extend({'w':m_width,'h':m_height,'cw':c_width,'ch': c_height,'cl':c_left,'ct':c_top,'e':e_mousemove},_offset));
							$moveObj.css(_offset);
						});
						//鼠标抬起时清除事件
						$doc.on(STR_MOUSEUP,function(){
							$doc.off(STR_MOUSEMOVE);
							$doc.off(STR_MOUSEUP);
							$moveObj.removeClass('on');
							_this.emit(EVENT_END_MOVE);
						});
					});
					return _this;
				}
				/*布局*/
				,'layout': function(){
					var _this = this;
					var config = _this.config;
					var data = _this.data;
					var $dragHandles = data['dragHandle'];
					var getMoveHandle = config.getMoveHandle;
					var _getLayoutContainer = config.getLayoutContainer;
					var currentMoveHandle,placeholderMoveHandle,currentPlaceholderIndex,oldPlaceholderIndex,newPlaceholderIndex;
					/*设置索引*/
					var _resetIndex = function($obj){
						oldPlaceholderIndex = currentPlaceholderIndex = $dragHandles.index($obj);
					}
					var ttChange;
					/*重置点位*/
					var _resetPlaceholder = function(method,$relativeObj){
						clearTimeout(ttChange);
						ttChange = setTimeout(function(){
							if(oldPlaceholderIndex != newPlaceholderIndex || 
								//从另一个容器过来时，可以索引是一样的
								!$relativeObj.is(_getLayoutContainer($dragHandles.eq(newPlaceholderIndex)))
							){
								$dragHandles.splice(newPlaceholderIndex,0,$dragHandles.splice(oldPlaceholderIndex,1).shift());
								placeholderMoveHandle[method]($relativeObj);
							}
						},10);//防止操作过快，出现抖动现象
					}
					//开始拖动
					_this.on(EVENT_START_MOVE,function(e){
						currentMoveHandle && currentMoveHandle.stop(true,true);
						var dragHandle = $(e.target);;
						_resetIndex(dragHandle);
						currentMoveHandle = getMoveHandle(dragHandle);
						currentMoveHandle.css(currentMoveHandle.position()).addClass(DRAG_OPACITY_CLASS);//reset position
						//添加点位符
						placeholderMoveHandle = currentMoveHandle.clone(true).addClass(DRAG_PLACEHOLDER_CLASS).insertAfter(currentMoveHandle);
					})
					//拖动时，点位符处理
					.on(EVENT_MOVE,function(data){
						var dragHandle = $(data.e.target);
						_resetIndex(dragHandle);
						var left = data.left;
						var top = data.top;
						var width = data.w;
						var height = data.h;
						var middle_left = left+width/2,
							middle_top = top+height/2;
						//寻找最合适的点位符
						for(var i = $dragHandles.length-1;i>=0;i--){
							var $dragHandle = $dragHandles.eq(i);
							var moveObj = getMoveHandle($dragHandle);
							var offset = moveObj.position();
							var m_left = offset.left;
							var m_top = offset.top;
							var m_width = _width(moveObj);
							var m_height = _height(moveObj);
							//根据拖动元素的中心点，找到合适的占位符位置
							if(m_left < middle_left && m_left + m_width > middle_left && m_top < middle_top && m_top + m_height > middle_top){
								if(i != currentPlaceholderIndex){
									newPlaceholderIndex = i;
									var method = 'insertBefore';
									var _child = _getLayoutContainer($dragHandle).children();
									var _index = _child.index(getMoveHandle($dragHandle));
									if(_index == 0){
										newPlaceholderIndex = i - 1;
									}
									//向靠右元素靠近并且此元素可以布局
									if((i > currentPlaceholderIndex || _index == _child.length-1) && !_isnotLayout(moveObj)){
										if(_index > 0){
											method = 'insertAfter';
										}
									}
									_resetPlaceholder(method,moveObj);
									return
								}
							}
						}
						
						// return;
						//if not suitable,insertAfter the last child of layout container or appendTo the layout container						 
						var layoutContainer = _getLayoutContainer();

						var first = $(layoutContainer.splice(0,1));
						var fn = function($obj){
							var lc_offset = $obj.offset();
							var lc_left = lc_offset.left;
							var lc_top = lc_offset.top;
							var lc_width = _width($obj);
							var lc_height = _height($obj);
							var arr = [
									Math.min(Math.abs(middle_left - lc_left),Math.abs(middle_left - lc_left - lc_width)),
									Math.min(Math.abs(middle_top - lc_top),Math.abs(middle_top - lc_top - lc_height))
									,lc_left,lc_top];
							return arr;
						}
						var arr = fn(first);
						var min_left = arr[0];
						var min_top = arr[1];
						var min_left_container = arr[2];
						var min_top_container = arr[3];

						//得到最近的一个容器
						var closestContainer = first;
						layoutContainer.each(function(){
							var $this = $(this);
							arr = fn($this);
							//在右方
							if(arr[2] > min_left_container){
								if(arr[0] < min_left){
									min_left = arr[0];
									min_top = arr[1];
									closestContainer = $this;
									return;
								}
							}
							//在下方
							if(arr[3] > min_top_container){
								if(arr[1] < min_top){
									min_left = arr[0];
									min_top = arr[1];
									closestContainer = $this;
									return;
								}
							}
						});
						//正在拖动的元素或占位元素在最近的容器内，直接返回
						if(closestContainer.is(_getLayoutContainer(dragHandle)) || closestContainer.is(_getLayoutContainer(placeholderMoveHandle))){
							return;
						}
						var _last = closestContainer.children().last();
						
						//容器内没有元素时，直接追加占位符
						if(_last.length == 0){
							placeholderMoveHandle.appendTo(closestContainer);
						}else{
							//占位符已经在容器内，直接返回
							if(_last.is(placeholderMoveHandle)){
								return;
							}
							//计算新的点位符的索引
							var num = 0;
							layoutContainer.splice(0,0,first.get(0));
							for(var i = 0,j=layoutContainer.length;i<j;i++){
								var layoutC = layoutContainer.eq(i);
								num += layoutC.children().length;
								if(layoutC.is(closestContainer)){
									break;
								}
							}
							newPlaceholderIndex = num;
							_resetPlaceholder(_isnotLayout(_last)?'insertBefore':'insertAfter',_last);
						}
					})
					//拖动结束时，处理点位符及拖动元素
					.on(EVENT_END_MOVE,function(){
						var fn = function(){
							placeholderMoveHandle.replaceWith(currentMoveHandle.removeClass(DRAG_MOVE_CLASS).removeClass(DRAG_OPACITY_CLASS));
						}
						if(config.animal !== false){
							currentMoveHandle.animate(placeholderMoveHandle.position(),config.animal||'fast',fn);
						}else{
							fn();
						}		
					});
					//开启拖动
					return _this.drag.call(_this);
				}
				/*临时添加布局*/
				,'addLayout': function($layoutContainer){
					this.data['container'].children().first().append($layoutContainer);
				}
				/*删除布局及子元素，包括拖动元素*/
				,'removeLayout': function($layoutContainer){
					var _this = this;
					var _getMoveHandle = _this.config.getMoveHandle;
					var removeLayoutChild = $layoutContainer.remove().children();
					for(var dhs = _this.data['dragHandle'],i = 0;i<dhs.length;i++){
						if(removeLayoutChild.index(_getMoveHandle(dhs.eq(i))) > -1){
							dhs.splice(i,1);
						}
					}
				}
				/*添加拖动元素*/
				,'addDrag': function($dragHandle){
					var _this = this;
					var config = _this.config;
					var data = _this.data;
					var layoutContainer = config.getLayoutContainer();
					var num = 0;
					var tempMoveHandle = config.getMoveHandle($dragHandle);
					for(var i = 0,j=layoutContainer.length;i<j;i++){
						var layoutC = layoutContainer.eq(i).children();
						var _index = layoutC.index(tempMoveHandle);
						if(_index > -1){
							num += _index;
							break;
						}else{
							num += layoutC.length;	
						}
					}
					_this._initDragEvent($dragHandle);//给新添加的拖动元素添加事件
					data['dragHandle'].splice(num,0,$dragHandle.get(0));//get(0)保持jquery数组中原始元素
				}
				/*删除拖动元素*/
				,'removeDrag': function($dragHandle){
					var _this = this;
					var config = _this.config;
					var data = _this.data;
					var $dragHandles = data['dragHandle'];
					$dragHandles.splice($dragHandles.index($dragHandle),1);
					config.getMoveHandle($dragHandle).remove();
				}
			}
		});
		return Drag;
	}
	define(function(require){
		var Event = require('j/m_event');
		require('jquery');
		require('j/global');
		require('c/m_drag.css');
		return init(Event);
	});
})();