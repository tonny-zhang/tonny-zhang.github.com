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
		var index = Math.floor(imgArr.length * Math.random());
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
	    function addImg(){
	    	var num = Math.ceil(Math.random() * 2);
			for(var i = 1;i<=num;i++){
				var _src = randArr(imgArr);
				var $lastLi = $('.yt ul li:last');
				var $lastImg = $lastLi.find('img')
				var offset = $lastLi.offset();
				// offset = {left: 300,top: 400}
				(function(src,index){
					var $img = $('<img>').css({width:$lastImg.width(),height:$lastImg.height()}).attr('src',src).addClass('move'+index).appendTo($body)
					.animate(offset,function(){
						if(getImgArr.indexOf(src) == -1){
							getImgArr.unshift(src);
							checkImgNum();
							var showImgs = getImgArr.slice(0,3);
							var $li = $('.yt ul li')
							showImgs.forEach(function(v,_i){
								$li.eq(_i).html('<img src="'+v+'">');
							})
						}
						$img.remove();
						setTimeout(adImg,1000);
					});
				})(_src,i);
			}
	    }
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
	    	if(isBig){
	    		var award = 'images/award_0.png';
	    	}else{
	    		var award = randArr(awards);
	    	}
			$('.box').hide();
			$('.content').show().find('h1 img').attr('src',award);
			var cont=$(".content h1 img").attr('src');
			//alert(cont);
			$('#btn_share').click(function(){
				share(location.href,'我正参加摇一摇活动，我获得了',cont);
			});
	    }
		if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            alert('not support mobile event');
        }	
		
		setTimeout(function(){
			checkImgNum(getAwards);
		},1000*60);
	}
	function share(url,title,pic){
		window.location = 'http://service.t.sina.com.cn/share/share.php?url='+url+'&title='+title+'&pic='+pic;
	}
})