var $win = $(window).load(function(){
	var audio = $('audio').get(0);
	$('body').click(function(){
		audio.play();
	});
	$('.bg_img').animate({
		'transform': 'scale(2.5,2.5)'
	},5000,function(){
		var $content = $('.content');alert(1);
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
	});
});