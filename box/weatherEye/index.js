!function(){
		var play_delay = 60000;
		var $win = $(window);
		// $('body').css({'width': $win.width(),'height': $win.height()});

		var video_info = [];
		video_info.push({'poster':'11.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESCZ02_24H_201405131014.mp4','text': '渤海新区海洋观测点'});
		video_info.push({'poster':'22.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESCZ01_24H_201405131017.mp4','text': '沧州市运河区九河西路，颐和庄园北实景观测'});
		video_info.push({'poster':'44.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESBJ02_24H_201403182258.mp4','text': '北京市朝阳区天鹅湾'});
		video_info.push({'poster':'55.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESCZ01_24H_201405131017.mp4','text': '沧州市运河区九河西路，颐和庄园北实景观测'});
		video_info.push({'poster':'333.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESBJ01_24H_201403201259.mp4','text': '中国气象局华风影视大楼建筑区'});
		video_info.push({'poster':'66.jpg','video':'http://61.4.185.122/webcam/v/SWEEYESCZ02_24H_201405131014.mp4','text': '渤海新区海洋观测点'});


		var $selected_border = $('<em>');
		var $video_list = $('.video-list').html('');
		
		var list_item = [];
		$.each(video_info,function(i,v){
			var $item = $('<div class="fl"><img src="'+v.poster+'"/><span>'+v.text+'</span></div>')
							// .css({'left': startX,'top': startY,'width': imgWidth,'height': imgHeight})
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
			
		});
		var currentIndex = 0;
		var resetTT;
		function reset(){
			clearTimeout(resetTT);
			resetTT = setTimeout(function(){
				$.each(list_item,function(i,v){
					$(v).css({
						'position': 'relative',
						left: 'auto',
						top: 'auto'
					});
				});
				var _w = list_item[0].width(),
					_h = list_item[0].height();
				$selected_border.css({
					width: _w - 10,
					height: _h - 10
				});
				// 倒序处理，防止前面元素CSS改变对后续元素影响
				for(var i = list_item.length-1;i>=0;i--){
					var $item = list_item[i];
					var offset = $item.position();
					$item.css({
						'position': 'absolute',
						left: offset.left,
						top: offset.top
					})
				}
			},20);
		}
		reset();
		$win.on('reset',reset);
		var _orientation_old = window.orientation;
		$win.on('orientationchange',function(){
			var _orientation_new = window.orientation
			if(_orientation_new != _orientation_old){
				_orientation_old = _orientation_new;
				reset();
			}
		});
		var isPlayEnd = true;
		$video = $('#vodeo-dom').on('ended',function(){
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
				$video.attr('poster',video_info[currentIndex]['poster']);
				_video.load();
				_video.play();
			}
		}
		
		
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
			$.each(list_item,function(i,v){
				var toIndex = i + 1;
				if(toIndex > imgNum - 1){
					toIndex = 0;
				}
				var toPos = list_item[toIndex].position();
				toPosArr.push(toPos);

				if(toPos.left == 0 && toPos.top == 0 && currentIndex != toIndex){
					changeIndex = i;
				}
			});
			if(changeIndex != -1){
				var temp = toPosArr[currentIndex];
				toPosArr[currentIndex] = toPosArr[changeIndex];
				toPosArr[changeIndex] = temp;
			}
			
			$.each(list_item,function(i,v){
				var toPos = toPosArr[i];
				if(toPos.left  == 0 && toPos.top == 0){
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