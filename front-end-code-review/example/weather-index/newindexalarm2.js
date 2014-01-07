// JavaScript Document

function getScriptArgs() {
	var scripts = document.getElementsByTagName("script");
	script = scripts[scripts.length - 1];
	src = script.src;
	reg = /(?:\?|&)(.*?)=(.*?)(?=&|$)/g;
	var temp = {};
	var res = {};
	while ((temp = reg.exec(src)) != null) res[temp[1]] = decodeURIComponent(temp[2]);
	return res;
};

function alarmflip() {
	try {
		clearTimeout($vv);
	} catch (e) {}
	$v = $(".gjalarmflip dl:visible");
	$vi = $(".gjalarmflip dl").index($v);
	//var len=$(".gjalarmflip dl").length;
	if ($vi == $(".gjalarmflip dl").length - 1) {
		$vi = 0;
	} else {
		$vi = $vi + 1;
	}
	$nextv = $(".gjalarmflip dl").eq($vi);

	// $(".gjalarmflip").flip({
	// 	color: '#FEF1AB',
	// 	direction: 'tb',
	// 	speed: 150,
	// 	onAnimation: function() {
	// 		$v.hide();
	// 		$nextv.show();

	// 	}
	// });

	$vv = setTimeout("alarmflip()", 4000);
}


var attrs = getScriptArgs();
var alarmcount = attrs.count == undefined ? '4' : attrs.count;
var alarmdivid = attrs.divid == undefined ? 'alarm-' + new Date().getTime() : 'alarm-' + attrs.divid;
$('#clarmContainer').html("<div class=\"alarm\" id=" + alarmdivid + "></div>");
$yjlb = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰'];
$gdlb = ['寒冷', '灰霾', '雷雨大风', '森林火险', '降温', '道路冰雪'];
$yjyc = ['蓝色', '黄色', '橙色', '红色'];
$gdyc = ['白色'];
$URL = 'http://product.weather.com.cn/alarm/newIndexalarm.php?count=' + alarmcount;
alarmindex($URL);
alarmindexzz = setInterval("alarmindex($URL)", 91000);

function alarmindex($ifurl) {
	try {
		clearTimeout($vv);
	} catch (e) {}

	$.ajax({
		type: "GET",
		url: $ifurl,
		dataType: "script",
		cache: false,
		async: false,
		success: function() {
			$appparent = $('#' + alarmdivid);
			$appparent.empty();
			$('<h1>气象灾害警报与预警信号<span><a target="_blank" href="http://www.weather.com.cn/alarm/newalarmlist.shtml">正在预警中' + alarminfo.count + '个</a></span></h1>').appendTo($appparent);
			$gjdiv = $("<div class='gjalarmflip'></div>");
			$allj = 0;
			$.each(alarminfo.gj, function(i, k) {
				$display = $allj == 0 ? 'block' : 'none';
				$('<dl style="display:' + $display + '"><dt><a target="_blank" href="' + k.http + '"><img src="http://www.weather.com.cn/m2/i/alarm/cma_weather.jpg"></a></dt><dd><h2><a target="_blank" href="' + k.http + '">中央气象台发布' + k.name + '</a></h2>状态：<b>预警中</b><a target="_blank" class="detail" href="' + k.http + '">详情</a></dd></dl>').appendTo($gjdiv);
				$allj++;
			});

			$.each(alarminfo.pr, function(i, k) {
				$display = $allj == 0 ? 'block' : 'none';
				$filename = k[1];
				$pos = $filename.lastIndexOf('-');
				//alert($pos);
				$lb = $filename.substr($pos + 1, 2);
				$jb = $filename.substr($pos + 3, 2);
				$img = $lb + $jb;
				$textlb = $yjlb[parseInt($lb, 10) - 1];
				$textyc = $yjyc[parseInt($jb, 10) - 1];
				if ($lb > 90 || $jb > 90) $img = '0000';
				if ($lb > 90) $textlb = $gdlb[parseInt($lb, 10) - 91];
				if ($jb > 90) $textyc = $gdyc[parseInt($jb, 10) - 91];
				$('<dl style="display:' + $display + '"><dt><a target="_blank" href="http://www.weather.com.cn/alarm/newalarmcontent.shtml?file=' + $filename + '"><img src="http://www.weather.com.cn/m/i/alarm_s/' + $img + '.gif"></a></dt><dd><h2><a target="_blank" href="http://www.weather.com.cn/alarm/newalarmcontent.shtml?file=' + $filename + '">' + k[0] + '气象台发布' + $textlb + $textyc + '预警</a></h2>状态：<b>预警中</b><a target="_blank" class="detail" href="http://www.weather.com.cn/alarm/newalarmcontent.shtml?file=' + $filename + '">详情</a></dd></dl>').appendTo($gjdiv);
				$allj++;
			});
			$gjdiv.appendTo($appparent);

			if ($(".gjalarmflip dl").length > 1) {
				$vv = setTimeout("alarmflip()", 4000);
				//  $(".gjalarmflip").find("dl").die("mouseover");
				$(".gjalarmflip").find("dl").live("mouseover", function() {
					try {
						clearTimeout($vv);
					} catch (e) {}
				});
				//$(".gjalarmflip").find("dl").die("mouseout");
				$(".gjalarmflip").find("dl").live("mouseout", function() {
					try {
						clearTimeout($vv);
					} catch (e) {}
					$vv = setTimeout("alarmflip()", 4000);
				});
			}


		}
	});
}