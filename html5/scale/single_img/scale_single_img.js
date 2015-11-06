$(function(){
	var $img_move_mask;
	var $img_move;
	var $body = $('body'),
		$win = $(window);
	var w_width = $win.width(),
		w_height = $win.height(),
		w_bi = w_width/w_height;
	function closeScale(){
		$img_move_mask && $img_move_mask.hide();
		initEvent.un();
	}
	function initScale($img){
		if(!$img_move_mask){
			$img_move_mask = $('<div>').addClass('img_move_mask').css({
				width: w_width,
				height: w_height
			}).appendTo($body);
			$img_move = $('<img>')
						.addClass('img_move')
						// .appendTo($body);
						.appendTo($img_move_mask);
			
		}
		$img_move_mask.css({
			top: $body.scrollTop()
		});
		$img_move_mask.fadeIn();
		// $img_move.show();
		var src = $img.attr('src');
		var img = new Image();
		img.onload = function(){
			if(!$img_move){
				
			}
			var w = this.width,
				h = this.height;
			var to_w,to_h;
			if(w > w_width || h > w_height){
				if(w_bi > w/h){
					to_h = w_height;
					to_w = to_h/h*w;
				}else{
					to_w = w_width;
					to_h = to_w/w*h;
				}
			}else{
				to_w = w;
				to_h = h;
			}
			var to_left = (w_width - to_w)/2,
				to_top = (w_height - to_h)/2;
			
			$img_move.attr('src',src).css({
				width: to_w,
				height: to_h,
				left: to_left,
				top: to_top
			}).show();
			initEvent($img_move,to_w,to_h,to_left,to_top);
		}
		img.src = src;
	}
	var initEvent = (function(){
		var oldX, oldY, startX, startY, startWidth, startHeight;
		var moveD;
		var isMove = false;
		var isZoom = false;
		var lastClickTime = 0;
		var $img_move;
		var clickTT;
		var initCss,initCssDouble;
		var isBig = false;
		var clickNum = 0;
		// 获取两点之间的距离
		function get_distance(x1, y1, x2, y2){
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 2);
		}
		
		function img_mousedown(e){
			if (!$(e.target).is('.img_move')) return;
			// clickNum = 0;
			if (e.touches.length == 1)
			{
				
			}
			else if (e.touches.length >= 2)
			{
				isMove = false;
				isZoom = true;
				x1 = e.touches[0].pageX;
				y1 = e.touches[0].pageY;
				x2 = e.touches[1].pageX;
				y2 = e.touches[1].pageY;

				startX = $img_move.position().left;
				startY = $img_move.position().top;
				startWidth = $img_move.width();
				startHeight = $img_move.height();

				moveD = get_distance(x1, y1, x2, y2);

				return;
			}

			isMove = true;
			oldX = e.touches[0].pageX;
			oldY = e.touches[0].pageY;
			startX = $img_move.position().left;
			startY = $img_move.position().top; 
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		function img_mouseup(e){
			if (!$(e.target).is('.img_move')) return;
			x = $img_move.position().left;
			y = $img_move.position().top;
			if(Math.abs(x - startX) < 20 && Math.abs(y - startY) < 20){
				clickNum = clickNum+1;
			}
			isZoom = false;
			isMove = false;
			setTimeout(function(){
				if(clickNum == 1){
					clearTimeout(clickTT);
					clickTT = setTimeout(function(){
						clickNum = 0;
						closeScale();
					},250);
				}else if(clickNum == 2){
					clearTimeout(clickTT);
					clickNum = 0;
					if(isBig){
						$img_move.animate(initCss);
						startX = initCss.left;
						startY = initCss.top; 
						isBig = false;
					}else{
						$img_move.animate(initCssDouble);
						startX = initCssDouble.left;
						startY = initCssDouble.top; 
						isBig = true;
					}
				}else{
					clickNum = 0;
				}
			},100);
		}

		function img_mousemove(e){console.log('img_mousemove');
			if (isZoom)
			{
				//targetTouches changedTouches touches
				if (e.touches.length >= 2)
				{
					var x1, y1, x2, y2, d1;
					x1 = e.touches[0].pageX;
					y1 = e.touches[0].pageY;
					x2 = e.touches[1].pageX;
					y2 = e.touches[1].pageY;
					d1 = get_distance(x1, y1, x2, y2);
					var rate = d1 / moveD;
					var w = startWidth * rate;
					var h = startHeight * rate;

					$img_move.width(w);
					$img_move.height(h);
					$img_move.css('left', (startWidth - w) / 2 + startX + 'px');
					$img_move.css('top', (startHeight - h) / 2 + startY + 'px');
				}

				return;
			}

			if (!isMove) return;

			x = e.changedTouches[0].pageX - oldX;
			y = e.changedTouches[0].pageY - oldY;

			$img_move.css('top', y + startY + 'px');
			$img_move.css('left', x + startX + 'px');
		}

		var doc = document;
		function _onmousemove(e){console.log('_onmousemove');
			var e = e || event;
			e.cancelBubble = true;
			e.returnValue = false;
		}
		function _touchmove(e){console.log('_touchmove');
			e.preventDefault();
		}
		function bind(){
			doc.onmousemove = _onmousemove
			// 防止触发浏览器的整体拖动
			doc.body.addEventListener('touchmove', _touchmove, false); 

			doc.addEventListener('touchstart', img_mousedown, false);
			doc.addEventListener('touchend', img_mouseup, false);
			doc.addEventListener('touchmove', img_mousemove, false);
		}
		function unbind(){ console.log('unbind');
			doc.onmousemove = null;
			doc.body.removeEventListener('touchmove', _touchmove, false); 
			doc.removeEventListener('touchstart', img_mousedown, false);
			doc.removeEventListener('touchend', img_mouseup, false);
			doc.removeEventListener('touchmove', img_mousemove, false);
		}		
		function init($img,w,h,left,top){
			$img_move = $img;
			startX = left,
			startY = top;
			initCss = {
				left: left,
				top: top,
				width: w,
				height: h
			};
			initCssDouble = {
				left: left - w/2,
				top: top - h/2,
				width: w*2,
				height: h*2
			}
			bind();
		}
		init.un = unbind;
		return init;
	})();
	

	window.Scale = {
		init: initScale,
		close: closeScale
	};
});