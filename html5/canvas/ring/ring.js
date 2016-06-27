function Ring(option) {
	option = $.extend({
		percent: 0,
		circleOuter: {
			width: 2,
			color: '#ccc'
		},
		circlePercent: {
			width: 2,
			color: 'red'
		},
		animate: true
	}, option);

	if (!option.container) {
		throw new Error('no container!');
	}
	var PI = Math.PI;
	var R_START = -PI/2;

	var $container = $(option.container);
	var width = $container.width(),
		height = $container.height();

	var width_circle = Math.min(width, height);
	var center = width_circle/2;
	var $tpl = $('<div style="position:relative;width:100%;height:100%;"><canvas width="'+width_circle+'" height="'+width_circle+'" style="position:absolute;left:50%;top:50%;margin-left:'+(-center)+'px;margin-top:'+(-center)+'px;"></canvas></div>');
	$tpl.appendTo($container);
	var $canvas = $tpl.find('canvas');
	var ctx = $canvas.get(0).getContext('2d');

	ctx.save();
	ctx.beginPath();
	var w_outer = option.circleOuter.width;
	var r_outer = center - w_outer;
	ctx.lineWidth = w_outer;
	ctx.strokeStyle = option.circleOuter.color;
	ctx.arc(center, center, r_outer, R_START, 2 * PI+R_START);
	ctx.stroke();

	var to_r = - option.percent * 2 * PI;
	if (to_r != 0) {
		ctx.restore();
		var w_percent = option.circlePercent.width;
		var r_percent = center - w_percent - (w_outer - w_percent);
		ctx.lineWidth = w_percent;
		ctx.strokeStyle = option.circlePercent.color;

		var animate = option.animate;
		var r_current = R_START,
			r_end = R_START + to_r;
		var R_PER = -PI/180*10;
		if (!animate) {
			R_PER = -Math.abs(r_end - r_current);
		}
		function run() {
			ctx.beginPath();
			var r_next = r_current + R_PER;
			ctx.arc(center, center, r_percent, r_current, r_next, true);
			ctx.stroke();
			r_current = r_next;
			if (r_current > r_end) {
				requestAnimationFrame(run);
			}
		}
		run();
	}
}