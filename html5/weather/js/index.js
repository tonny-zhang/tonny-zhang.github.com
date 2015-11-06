$(function(){
	var $doc = $(document),
		$win = $(window),
		$body = $('body');
	var win_width = $win.width(),
		win_height = $win.height();
	$body.height(win_height).width(win_width);
	var $move_item = $('.move_item').width(win_width);
	var $main = $('#main').width($move_item.length * win_width);
	$('.item').width(win_width - 10);
	var $yb_hour = $('.yb_hour').each(function(){
		var $this = $(this);
		var $ul = $this.find('ul');
		var $yb_hour_items = $ul.find('li');
		var w_item = $yb_hour_items.width();
		var len = $yb_hour_items.length
		$ul.width(w_item * len);
		var min_left = -w_item * (len - 1),
			max_left = 0;
		var current_left = 0;
		var move = function(distance){
			var to_left = current_left + distance;
			if(to_left > max_left){
				to_left = max_left;
			}else if(to_left < min_left){
				to_left = min_left;
			}
			$ul.stop(true).animate({
				'margin-left': to_left
			},function(){
				current_left = to_left;
			});
		}
		$this.on('scroll',function(){
			console.log('scroll');
		});
		// $this.swipe({
		// 	swipeLeft: function(e, phase, direction, distance, fingerCount){
		// 		e.stopPropagation();
		// 		console.log(phase, direction, distance, fingerCount);
		// 		move(-distance);
		// 		return false;
		// 	},
		// 	swipeRight: function(e, phase, direction, distance, fingerCount){
		// 		console.log(phase, direction, distance, fingerCount);
		// 		e.stopPropagation();
		// 		move(distance);
		// 		return false;
		// 	},
		// 	threshold: 10
		// });
	});
	var current_index = 0,
		min_index = 0,
		max_index = $move_item.length-1;
	function moveMain(direc){
		var to_index = current_index + direc;
		//alert(to_index+' '+min_index+' '+max_index);
		if(to_index < min_index || to_index > max_index){
			return;
		}
		$main.animate({
			'margin-left': -to_index * win_width
		},function(){
			current_index = to_index;
		});
	}
	// $doc.swipe({
	// 	swipeStatus: function(){
	// 		console.log(arguments);
	// 		return false;
	// 	}
	// });
	$('.swipe_event').swipe({
		
		swipeLeft: function(e){
			// e.returnValue = true;
			moveMain(1);
		},
		swipeRight: function(){
			moveMain(-1);
		}
	});
})