$(window).load(function(){
	var audio = $('audio').get(0);
	$('body').click(function(){
		audio.play();
	});
	setTimeout(function(){
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
							$item.eq(index++).fadeIn(1500,run);
						}
						run();
					});
				});
			},300);
		});
	},2500);
});