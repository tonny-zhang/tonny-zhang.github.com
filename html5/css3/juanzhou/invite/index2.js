$(function(){
	// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    	var appid = '';
    	var shareTitle = '环球旅行家发布会';
    	var imgUrl = 'http://tonny-zhang.github.io/html5/css3/juanzhou/invite/img/logo.png';
        share = function(){
        	lineLink = location.href;
        	descContent = '豪华精选酒店及度假村品牌“环球旅行家”发布会暨杭州尊蓝钱江豪华精选酒店开业典礼';
        }
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
        	share();
            WeixinJSBridge.invoke('sendAppMessage',{
                "appid": appid,
                "img_url": imgUrl,
                "img_width": "200",
                "img_height": "200",
                "link": lineLink,
                "desc": descContent,
                "title": shareTitle
            }, function(res) {
                //_report('send_msg', res.err_msg);
            })
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv){
        	share();
            WeixinJSBridge.invoke('shareTimeline',{
                "img_url": imgUrl,
                "img_width": "200",
                "img_height": "200",
                "link": lineLink,
                "desc": descContent,
                "title": descContent
            }, function(res) {
                
            });
        });
        // 分享到微博
        WeixinJSBridge.on('menu:share:weibo', function(argv){
        	share();
            WeixinJSBridge.invoke('shareWeibo',{
                "content": descContent,
                "url": lineLink,
            }, function(res) {
                //_report('weibo', res.err_msg);
            });
        });
        share();
    }, false);
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
		});
		$('#audio_source').attr('src','./bg_music.mp3');
		function preload(img,callback){
			var image = new Image();
			image.onload = image.onerror = callback;
			image.src = img;
		}
		var preload_url = ['./img/bg3.png','./img/corner.png','./img/wxb.jpg'];
		var loadingNum = preload_url.length;
		function preloadCallback(){
			loadingNum--;
		}
		function callback(){
			if(isCanPlay && loadingNum == 0){
				
				loadingNum = -1;
				$('.bg_img').addClass('enlarge');
				run_con_tt = setTimeout(run_con,5000);
			}else{
				setTimeout(callback,100);
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
								$item.eq(index++).fadeIn(2000,run);
							}
							run();
						});
					});
				},300);
			});
		}
		
		$(document).on('ontouchstart' in document?'touchstart':'click',function(){
			audio.play();
			var $arrow = $('.arrow');
			var top = $arrow.position().top;
			$arrow.css({
				top: top
			}).animate({
				top: -100
			},function(){
				isCanPlay = true;
				callback();
			});
		});
	// });
});
