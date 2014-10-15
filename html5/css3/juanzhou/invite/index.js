$(function(){
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
				var height_corner = $corner.height();
				$content.animate({
					height: toHeight - height_corner
				},900,function(){
					$corner.animate({
						height: 0
					},100);
					$content.animate({
						height: toHeight
					},100,function(){
						var $item = $('.item.hide');
						var index = 0;
						function run(){
							$item.eq(index++).fadeIn(1500,run);
						}
						run();
						console.log('down');
					});
				});
			},300);
		});
	},2500);
});