$(function(){
	var $sub_nav = $('.sub_nav div');
		var $items = $('.item');
		var currentItemIndex = 0,
			maxItemIndex = $items.length-1;
		function showItem(){
			isAnimating = true;
			$body.animate({
				scrollTop: $items.eq(currentItemIndex).offset().top
			},function(){
				isAnimating = false;
			});
		}
		var wheelTT;
		var isAnimating = false;
		var $body = $('body,html').on('mousewheel',function(e){
			var wheelDelta = window.event.detail?-(window.event.detail||0)/3:window.event.wheelDelta/120;
			clearTimeout(wheelTT);
			wheelTT = setTimeout(function(){
				wheelDelta<0? currentItemIndex++:currentItemIndex--;
				currentItemIndex < 0 && (currentItemIndex = 0);
				currentItemIndex > maxItemIndex && (currentItemIndex = maxItemIndex);
				showItem();
			},300);
			e.preventDefault();
		});
		$('.btn_next').click(function(){
			currentItemIndex++;
			showItem();
		});
		var scrollTT,resizeTT;
		var $win = $(window);
		var height_win = $win.height();
		$win.on('resize',function(){
			clearTimeout(resizeTT);
			resizeTT = setTimeout(function(){
				height_win = $win.height();
			},100);
		}).on('scroll',function(){
			clearTimeout(scrollTT);
			scrollTT = setTimeout(function(){
				var scrollTop = $win.scrollTop();
				var index = scrollTop/height_win;
				var select_index = index%1 > 0?Math.ceil(index):Math.floor(index);
				$sub_nav.removeClass('on').eq(select_index).addClass('on');
				currentItemIndex = select_index;
			},200);
		}).on('keydown',function(e){
			var code = e.which;
            if (code == 40) {
            	if(currentItemIndex+1 > maxItemIndex){
            		return;
            	}
                currentItemIndex++;
                showItem();
            } else if (code == 38) {
            	if(currentItemIndex == 0){
            		return;
            	}
                currentItemIndex--;
                showItem();
            }
		});
		$win.resize();
});