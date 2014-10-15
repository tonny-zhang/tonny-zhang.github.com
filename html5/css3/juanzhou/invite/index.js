$(function(){
	// var $win = $(window).load(function(){
		var $audio = $('audio');
		var audio = $audio.get(0);
		var isCanPlay = false;
		var isPlaying = false;
		$audio.on('playing',function(){
			isPlaying = true;
		});
		$audio.on('canplay',function(){
			isCanPlay = true;
			setTimeout(function(){
				if(!isPlaying){
					alert('点击屏幕播放背景音乐');
				}
			},2000);
			callback();
		});
		function preload(img,callback){
			var image = new Image();
			image.onload = image.onerror = callback;
			image.src = img;
		}
		var preload_url = ['./img/bg.png','./img/corner.png','./img/wxb.jpg'];
		var loadingNum = preload_url.length;
		function preloadCallback(){
			loadingNum--;
			if(loadingNum == 0){
				callback();
			}
		}
		function callback(){
			if(isCanPlay && loadingNum == 0){
				$('.bg_img').addClass('enlarge');
				run_con_tt = setTimeout(run_con,5000);
			}
		}
		for(var i = 0;i<loadingNum;i++){
			preload(preload_url[i],preloadCallback);
		}
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
						delay_hide = 400;
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
		
		$('#main').click(function(){
			audio.play();
		});
	// });
});
