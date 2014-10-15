$(function(){
	var $win = $(window).load(function(){
		var $audio = $('audio');
		var audio = $audio.get(0);
		var isCanPlay = false;
		$audio.on('playing',function(){
			isCanPlay = true;
		});
		setTimeout(function(){
			if(!isCanPlay){
				alert('点击屏幕播放背景音乐');
			}
		},2000);
		
		var run_con_tt;
		var is_runned = false;
		function run_con(){
			clearTimeout(run_con_tt);
			if(is_runned){
				return;
			}
			is_runned = true;
			var $content = $('.content');
			$content.fadeIn(function(){
				setTimeout(function(){
					var toHeight = 1250;
					var $corner = $('.corner');
					var delay_slide = 3000,
						delay_hide = 200;
					var height_corner = $corner.height();
					$content.animate({
						height: toHeight - height_corner
					},delay_slide,function(){
						$corner.animate({
							height: 0
						},delay_hide);
						$content.animate({
							height: toHeight
						},delay_hide,function(){
							var $item = $('.item.hide');
							var index = 0;
							function run(){
								$item.eq(index++).fadeIn(2500,run);
							}
							run();
						});
					});
				},300);
			});
		}
		$('.bg_img').addClass('enlarge');
		run_con_tt = setTimeout(run_con,5000);
		$('#main').click(function(){
			audio.play();
		});
	});
});
