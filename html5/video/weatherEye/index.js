!function(){
		var play_delay = 4000;
		var $win = $(window);
		$('body').css({'width': screen.width,'height': screen.height});

		var video_info = [];
		video_info.push({'poster':'11.jpg','video':'http://61.4.185.122/webcam/v/SWEeyes04_24H_201403181638.mp4','text': '文字一'});
		video_info.push({'poster':'22.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESBJ02_24H_201403182258.mp4','text': '文字二'});
		video_info.push({'poster':'44.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESBJ01_24H_201403201259.mp4','text': '文字三'});
		video_info.push({'poster':'55.jpg','video':'ttp://61.4.185.122/webcam/v/SWEEYESBJ03_24H_201403211404.mp4','text': '文字四'});
		video_info.push({'poster':'333.jpg','video':'http://61.4.185.122/webcam/v/SWEeyes04_24H_201403181638.mp4','text': '文字五'});
		video_info.push({'poster':'66.jpg','video':'http://61.4.185.122/webcam/v/SWEeyes04_24H_201403181638.mp4','text': '文字六'});


		var $selected_border = $('<em>');
		var $video_list = $('.video-list');
		var video_list_width = $video_list.width(),
			video_list_height = $video_list.height();
		var startX = 0,
			startY = 0,
			marginLeft = marginTop = 0,
			imgWidth = video_list_width * 0.5,
			imgHeight = video_list_height / 3;
		var list_item = [];
		video_info.forEach(function(v,i){
			var $item = $('<div class="fl"><img src="'+v.poster+'"/><span>'+v.text+'</span></div>')
							.css({'left': startX,'top': startY,'width': imgWidth,'height': imgHeight})
							.data('v',v.video)
							.data('i',i)
							.appendTo($video_list)
							.on('click',function(){
								var $this = $(this);
								var index = $this.data('i');
								if(currentIndex != index){
									currentIndex = index;
									changePos(true);
								}
							})
			list_item.push($item);
			var tempX = startX + imgWidth + marginLeft;
			if(video_list_width - tempX < imgWidth){
				startX = 0;
				startY += imgHeight + marginTop;
			}else{
				startX += imgWidth + marginLeft;
			}
		})
		var isPlayEnd = true;
		var $video = $('#vodeo-dom').on('ended',function(){
			isPlayEnd = true;
		}).on('play',function(){
			isPlayEnd = false;
		});
		var video_width = $video.width(),
			video_height = $video.height();

		var $video_source = $video.find('source');
		function showVideo(isFromClick){
			if(isPlayEnd || isFromClick){
				var _video = $video.get(0);
				$video_source.attr('src',video_info[currentIndex]['video']);
				_video.load();
				_video.play();
				// _video.pause();
				// $video.stop(true,true).animate({'width': 0,'height': 0},function(){
				// 	$video_source.attr('src',video_info[currentIndex]['video']);
				// 	$video.animate({'width': video_width,'height': video_height},function(){
				// 		_video.load();
				// 		_video.play();
				// 	});
				// })
			}
		}
		var currentIndex = 0;
		var changingNum = 0;
		var play_tt;
		$selected_border.appendTo(list_item[currentIndex]);
		showVideo();
		function changePos(isFromClick){
			if(changingNum != 0){
				return;
			}

			var toPosArr = [];
			
			var imgNum = list_item.length;
			changingNum = imgNum;
			var changeIndex = -1;
			list_item.forEach(function(v,i){
				var toIndex = i + 1;
				if(toIndex > imgNum - 1){
					toIndex = 0;
				}
				var toPos = list_item[toIndex].position();
				toPosArr.push(toPos);

				if(toPos.left < imgWidth && toPos.top < imgHeight && currentIndex != toIndex){
					changeIndex = i;
				}
			});
			if(changeIndex != -1){
				var temp = toPosArr[currentIndex];
				toPosArr[currentIndex] = toPosArr[changeIndex];
				toPosArr[changeIndex] = temp;
			}
			
			list_item.forEach(function(v,i){
				var toPos = toPosArr[i];
				if(toPos.left < imgWidth && toPos.top < imgHeight){
					currentIndex = i;
				}
				v.stop(true,true).animate(toPos,function(){
					changingNum--;
					if(changingNum == 0){
						$selected_border.appendTo(list_item[currentIndex]);
						showVideo(isFromClick);
						clearTimeout(play_tt);
						play_tt = setTimeout(changePos,play_delay);
					}
				});
			});
		}

		play_tt = setTimeout(changePos,play_delay);
	}();