$(function(){
	$(".hdxq h1 span img").click(function(){
		$("#show_info").hide();
	});
	$(".xq a").click(function(){
		$("#show_info").show();
	});	

	// 格式化数字
	function fixNum(num,digit){
		digit = digit || 2;
		var biggerNum = Math.pow(10,digit-1);
		if(num < biggerNum){
			var str = '';
			for(var i = 0;i<digit-(num+'').length;i++){
				str += '0';
			}
			num = str+num;
		}
		return num;
	}
	// 得到总数
	$.getJSON('http://www.html5cn.com.cn/webview/php/counter.php',function(num){
		$('.yiyou').html(fixNum(num,5).split('').map(function(v){
			return '<span>'+v+'</span>';
		}).join(''));
	});

	// 到计时
	function countdown(){
		var currentTime = new Date();
		var remainMinutes = 59 - currentTime.getMinutes();
		var remainSeconds = 60 - currentTime.getSeconds();

		$('.time').html('00:'+fixNum(remainMinutes)+':'+fixNum(remainSeconds));

		checkAction();
	}
	var countdown_tt = setInterval(countdown);

	function checkAction(){
		if(new Date().getMinutes() <= 3 || true){
			clearInterval(countdown_tt);
			// 可以摇一摇
			$('.main').hide();
			var $step2 = $('.mains').show().click(function(){
				$step2.hide();
				$('.box').show();
				runYao();
			});
		}else{
			// 不可以摇
			$('.main').show();
		}
	}

	var imgArr = [];
	for(var i = 1;i<=18;i++){
		imgArr.push('images/'+i+'.png')
	}
	function randArr(arr){
		var index = Math.floor(arr.length * Math.random());
		return arr[index];
	}


	function runYao(){
		var $body = $('body');
		var getImgArr = [];
		var SHAKE_THRESHOLD = 3000;
	    var last_update = 0;
	    var x = y = z = last_x = last_y = last_z = 0;
	    
	    function deviceMotionHandler(eventData) {
	        var acceleration = eventData.accelerationIncludingGravity;
	        var curTime = new Date().getTime();
	        if ((curTime - last_update) > 100) {
	            var diffTime = curTime - last_update;
	            last_update = curTime;
	            x = acceleration.x;
	            y = acceleration.y;
	            z = acceleration.z;
	            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

	            if (speed > SHAKE_THRESHOLD) {
	               	addImg()
	            }
	            last_x = x;
	            last_y = y;
	            last_z = z;
	        }
	    }
	    var win_width = $(window).width();
	    var per_width = win_width * 0.21;
	    var margin_size = win_width * 0.02;
	    var li_css = {width: per_width,margin: '0 '+margin_size+'px'};
	    function addImg(){
	    	var show_award_index = 0;
	    	var num = Math.ceil(Math.random() * 2);
			for(var i = 1;i<=num;i++){
				var _src = randArr(imgArr);
				var $img_list = $('.yt ul').width(win_width);
				var $lastLi = $img_list.find('li').css(li_css);
				var $lastImg = $lastLi.find('img');
				// offset = {left: 300,top: 400}
				(function(src,index){
					show_award_index = show_award_index > 3?0:show_award_index+1;
					var offset = $lastLi.eq(show_award_index).offset();
					var $img = $('<img>').css({width:$lastImg.width(),height:$lastImg.height()}).attr('src',src).addClass('move'+index).appendTo($body)
					.animate(offset,function(){
						if(getImgArr.indexOf(src) == -1){
							getImgArr.unshift(src);
							var len = getImgArr.length;
							var $li = $('.yt ul li');
							if(len <= 4){
								$li.eq(len-1).html('<img src="'+src+'">');
							}else{
								$img_list.append($('<li><img src="'+src+'"</li>').css(li_css));
							}
							$img_list.width($img_list.find('li').length * win_width / 4)
							checkImgNum();
						}
						$img.remove();
					});
				})(_src,i);
			}
	    }
		window.addImg = addImg;
	    var awards = ['http://www.html5cn.com.cn/webview/images/award_1.png','http://www.html5cn.com.cn/webview/images/award_2.png','http://www.html5cn.com.cn/webview/images/award_3.png','http://www.html5cn.com.cn/webview/images/award_4.png'];
	  
	    var $img_num = $('#img_num');
	    function checkImgNum(noNumCB){
	    	var num = getImgArr.length;;
	    	$img_num.html("您已经摇出"+num+"/18,继续努力！");
	    	if(num >= 18){
	    		getAwards(true);
				window.removeEventListener('devicemotion', deviceMotionHandler, false);
			}else{
				noNumCB && noNumCB();
			}
	    }
	    function getAwards(isBig){
			$.getJSON('./php/counter.php?add=1');
			var $big_small = $('.big_small');
	    	if(isBig){
	    		var text = '恭喜您获得TEMPUR体验大奖';
	    	}else{
	    		var text = '恭喜您获得TEMPUR鼓励奖';
	    		var $p_arr = $big_small.find('p');
				var $rand_p = $(randArr($p_arr));
				$rand_p.html($rand_p.html().replace(/^\d、?/,''));
				$p_arr.remove();
				$rand_p.appendTo($big_small);
	    	}
			$('.box').hide();
			var $content = $('.content').show();
			$content.find('h1').text(text);
			$content.find('h2').click(function(){
				$content.hide();
				$big_small.show();
			});
			// 查看奖项时的关闭按钮
			$('#btn_close_award').click(function(){
				$content.show();
				$big_small.hide();
			});
			// var cont=$(".content h1 img").attr('src');
			//alert(cont);
			$('#btn_share').click(function(){
				share(location.href,'我在Tempur泰普尔微信摇一摇“享睡十八式”游戏中获得Tempur专享礼券，参与即可获奖，集齐18种睡姿更多奖品等着你！赶快来参加吧~~','http://html5cn.com.cn/webview/images/yao.jpg');
			});
	    }
		if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            alert('not support mobile event');
        }	
		
		setTimeout(function(){
			checkImgNum(getAwards);
		},1000*60*5);
	}
	function share(url,title,pic){
		window.location = 'http://service.t.sina.com.cn/share/share.php?url='+url+'&title='+title+'&pic='+pic;
	}
})