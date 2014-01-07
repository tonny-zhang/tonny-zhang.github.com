(function(){
	var searchNotice = "输入城市名、全拼、简拼、电话区号、邮编查询";
	var noDataNotice = "对不起，未找到您查询的城市天气!";
	var by = function(name) {
		return function(o, p) {
			var a, b;
			if (typeof o === "object" && typeof p === "object" && o && p) {
				a = o[name];
				b = p[name];
				if (a === b) {
					return 0;
				}
				if (typeof a === typeof b) {
					return a < b ? -1 : 1;
				}
				return typeof a < typeof b ? -1 : 1;
			} else {
				throw ("error");
			}
		}
	}
	var requestCount2 = 0;
	var requestCount = 0;
	var occurTime = new Array();
	occurTime[0] = new Date().getTime();
	occurTime[0] = occurTime[0];
	var occurTimeNum = 0;
	var keyvalueOld = "";
	var regNum = new RegExp("^[0-9]*[0-9][0-9]*$");
	var regEn = new RegExp("^[A-Za-z]+$");
	var regCn = new RegExp("[\u4e00-\u9fa5]");

	function searchJudge(key) {
		if (key.length > 0 && key != searchNotice) {
			readData(key);
		} else {
			hide();
		}
	}
	var $searchBox;
	$(function() {
		$searchBox = $("#txtZip");
		
		$(document.body).click(function(event) {
			if ($searchBox.val() == "") {
				$("#show").hide();
				$searchBox.val(searchNotice);
			} else {
				$("#show").hide();
				$(".suggest-additions").hide();
			}
		})
		$searchBox.add("#selectsionTabs").click(function(event) {
			event.stopPropagation();
			return false;
		})
		
		$("#btnZip").bind("click", function(event) {
			event.stopPropagation();
			//var s=$("#Zipresult").html('');
			var keyvalue = $searchBox.val();
			if (keyvalue == "") {
				window.location = "http://www.weather.com.cn/forecast/index.shtml";
				return false;

			}
			if ($.trim(keyvalue) == searchNotice) {
				window.location = "http://www.weather.com.cn/forecast/index.shtml";
				return false;
			} else {
				readData(keyvalue);
				areaid = $("#show li.select").attr("num");
				//alert(areaid);
				if (regEn.test(areaid)) {
					window.location = "http://www.weather.com.cn/html/province/" + areaid + '.shtml';
				}

				if (regNum.test(areaid)) {
					window.location = "http://www.weather.com.cn/weather/" + areaid + '.shtml';

				}
			}


		})
		$searchBox.keyup(function(e) {
			var obj = $searchBox;
			var offset = obj.offset();
			var topvalue = offset.top + obj.height() + 5;
			var leftvalue = offset.left;
			occurTimeNum += 1;
			occurTime[occurTimeNum] = new Date().getTime();
			if ($searchBox.val() == "") {
				keyvalueOld = "";
			}
			keysearch(e);
		});
	});
	$(function(){
		$searchBox.focus(function() {
			if ($searchBox.val() == "" || $searchBox.val() == searchNotice) {
				// $(".suggest-additions").show();
				showSuggest();
			}
			if ($(this).val() == this.defaultValue) {
				$(this).val("");
			} else if ($searchBox.val() != "" && $searchBox.val() != searchNotice) {
				$("#show").show();
			}
			setInterval(function() {
				var keyvalueX = $searchBox.val();
				if (keyvalueX == "") {
					hide();
				}

				if (keyvalueX != keyvalueOld) {
					hideSuggest();
					searchJudge(keyvalueX);
				}
			}, 300);
		});
		var isInited = false;
		var $suggest;
		var cityCodeReg = /\d{9}/;
		var showSuggest = function(){
			if(!isInited){
				isInited = true;
				var html = '<div class="suggest-additions"><div id="selectsionTabs"></div><div id="selectsionGroups"><div style="text-align:center;height:30px;line-height:30px;">loading....</div></div><div id="selectsionNotice">输入城市名、全拼、简拼、电话区号、邮编查询</div><div>';
				$suggest = $(html).appendTo($('#Zip')).show();
				var cityUrl = '/data/citydata/search/city.html';
				var newsUrl = '/data/citydata/search/news.html';
				var base = location.href.replace('index.html','');
				cityUrl = base+'city.html';
				newsUrl = base+'news.html';
				var $groups = $('#selectsionGroups');
				var tabClick = function(e){
					e.stopPropagation();
					var $this = $(this);
					var index = $tabItems.index($this);
					$groupItems.hide().eq(index).show();
					$tabItems.removeClass('active');
					$this.addClass("active");
					return false;
				}
				var $tabs = $('#selectsionTabs');
				var $tabItems,$groupItems;
				$.getJSON(cityUrl,function(data){
					if($.isArray(data)){
						var tabHtml = '';
						var groupHtml = '';
						var readerData = function(items){
							for(var _i=0,_j=items.length;_i<_j;_i++){
								var _d = items[_i];
								var href;
								var isSpecial = false;
								if(cityCodeReg.test(_d[1])){
									href = "http://www.weather.com.cn/weather/"+_d[1]+".shtml";
								}else{
									href = "http://"+_d[1]+".weather.com.cn";
									isSpecial = true;
								}
								groupHtml += '<li><span><a href="'+href+'"'+(isSpecial?' style="font-weight:bold;"':'')+'>'+_d[0]+'</a></span></li>';
							}
						}
						var isProvince = false;
						for(var i = 0,j=data.length;i<j;i++){
							var d = data[i];
							var tabName = d[0];
							isProvince = tabName == '省级站';
							tabHtml += '<span class="tab'+(i==0?' active':'')+'">'+tabName+'</span>';
							var tabData = d[1];
							groupHtml += '<ul>'
							$.each(tabData,function(i,v){
								var name = v[0];
								var items = v[1];
								if(name){
									groupHtml += '<li style="width:100%;">';
										groupHtml += '<ul style="display:block" class="special">';
											groupHtml += '<li style="font-weight:bold;">'+name+':</li>';
										readerData(items);
										groupHtml += '</ul>';
									groupHtml += '</li>'
								}else{
									readerData(items);
								}
							});
							if(isProvince){
								groupHtml += '<li><span><a href="http://www.weather.com.cn/textFC/hd.shtml">更多</a></span></li>';
							}
							groupHtml += '</ul>';
							$groups.html(groupHtml).find('ul:first').show();
							$tabs.html(tabHtml).find('ul:first').show();
						}

						$groupItems = $('#selectsionGroups > ul');
						$tabItems = $tabs.find('span').click(tabClick);
					}
					$.getJSON(newsUrl,function(data){
						if($.isArray(data)){
							var valArr = [5,-20,-45,-68,-92,-116,-139,-162,-186,-211];
							var $tab = $('<span class="tab" style="color:#f00;">资讯</span>')
							$tabItems = $tabItems.add($tab);
							$tabs.append($tab);
							var html = '<ul class="dWeatherRankingBox zxbg" style="padding-top: 10px; padding-left: 20px;">';
							for(var i = 0,j=data.length;i<j;i++){
								var d = data[i];
								html += '<li style="background:url(/m2/i/topTen.jpg) no-repeat scroll 0 '+valArr[i]+'px;"><a target="_blank" href="'+d[0]+'">'+d[1]+'</a></li>';
							}
							html += '</ul>';
							$groups.append($(html));
							$tab.click(tabClick);
							$groupItems = $('#selectsionGroups > ul');
						}
					});
				});
			}else{
				$suggest.show();
			}
		}
		// showSuggest();
		var hideSuggest = function(){
			$suggest.hide();
		}
	});
	function readData(keyvalueX) {
		var cityname = keyvalueX;
		keyvalueOld = cityname;
		$.ajax({
			type: "GET",
			url: "http://localhost:8010/search?cityname=" + cityname + "",
			requestCount: ++requestCount,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "success_jsonpCallback",
			async: false,
			success: function(result) {
				if (requestCount !== this.requestCount) return;
				if (result == "") {
					$("#show ul").html("<span style='color:#f00;'>"+noDataNotice+"</span>");
					$("#show").show();
				} else {
					displayData(cityname, result);
				}
			}
		});
	}



	function displayData(cityname, content) {
		var temp = new Array();
		$.each(content, function(i, v) {
			temp[i] = v.ref.split("~");
		})
		var idSort = temp.sort(by('0'));
		var areaid = "";
		var contentHtml = "";
		var contentHtmlFinal = "";
		if (regNum.test(cityname)) {
			$.each(idSort, function(i, v) {
				var content3 = v[2] + "-" + v[9];
				var recontent = new RegExp(cityname, "ig");
				if (recontent.test(v[6])) {
					content3 += "-" + v[6];
				}
				if (recontent.test(v[7])) {
					content3 += "-" + v[7];
				}
				content3 = content3.replace(recontent, '<b>' + cityname + '</b>');
				if (i == 0) {
					contentHtml += '<li class="select" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i < 10 && i > 0) {
					contentHtml += '<li class="unselect" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i == 9) {
					return false;
				}
			})
		};
		if (regEn.test(cityname)) {
			$.each(idSort, function(i, v) {
				if (v[9] != "") {
					var content3 = v[2] + "-" + v[9];
				} else {
					var content3 = v[2];
				}
				var recontent = new RegExp(cityname, "ig");
				if (recontent.test(v[3])) {
					content3 += "-" + v[3];
				}
				if (recontent.test(v[5])) {
					content3 = v[2] + "-" + v[9] + "-" + v[5];
				}
				content3 = content3.replace(recontent, '<b>' + cityname + '</b>');
				if (recontent.test(v[8])) {
					content3 += "-<b>" + v[8].toUpperCase() + "</b>";
				}
				if (i == 0) {
					contentHtml += '<li class="select" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i < 10 && i > 0) {
					contentHtml += '<li class="unselect" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i == 9) {
					return false;
				};
			})
		};
		if (regCn.test(cityname)) {
			$.each(idSort, function(i, v) {
				if (v[9] != "") {
					var content3 = v[2] + "-" + v[9];
				} else {
					var content3 = v[2];
				}
				var recontent = new RegExp(cityname, "ig");
				content3 = content3.replace(recontent, '<b>' + cityname + '</b>');
				if (i == 0) {
					contentHtml += '<li class="select" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i < 10 && i > 0) {
					contentHtml += '<li class="unselect" num=' + v[0] + '>' + content3 + '</li>';
				}
				if (i == 9) {
					return false;
				};
			})
		};
		$("#show ul").html(contentHtml);
		$("#show").show();
		$("#show li").mouseover(function() {
			$("#show li.select").removeClass("select").addClass("unselct");
			$(this).removeClass("unselect").addClass("select");
		}).mouseout(function() {
			$(this).removeClass("select").addClass("unselect");
		}).click(function() {
			var value = $("#show li.select").text();
			var value = value.split("-");
			areaid = $("#show li.select").attr("num");
			if (regEn.test(areaid)) {
				window.location = "http://www.weather.com.cn/" + areaid + '/index.shtml';
			}
			if (regNum.test(areaid)) {
				window.location = "http://www.weather.com.cn/weather/" + areaid + '.shtml';
			}
			if (value.length > 1)
				$searchBox.val(value[0]);
			hide();
		})
	}

	function hide() {
		$("#show").hide();
	}

	function keysearch(e) {
		if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 9) {
			if (e.keyCode == 40) {
				if ($("#show li.select").next().text() != "") {
					$("#show li.select").removeClass("select").addClass("unselect").next().removeClass("unselect").addClass("select");
				} else {
					$("#show li.select").removeClass("select").addClass("unselect");
					$("#show li:first").removeClass("unselect").addClass("select");
				}
			}
			if (e.keyCode == 38) {
				if ($("#show li.select").prev().text() != "") {
					$("#show li.select").removeClass("select").addClass("unselect").prev().removeClass("unselect").addClass("select");
				} else {
					$("#show li.select").removeClass("select").addClass("unselect");
					$("#show li:last").removeClass("unselect").addClass("select");
				}
			}
			if (e.keyCode == 13) {
				var value = $("#show li.select").text();
				value = value.split("-");
				areaid = $("#show li.select").attr("num");
				if (regEn.test(areaid)) {
					window.location = "http://www.weather.com.cn/" + areaid + '/index.shtml';
				}
				if (regNum.test(areaid)) {
					window.location = "http://www.weather.com.cn/weather/" + areaid + '.shtml';
				}
				if (value.length > 1)
					$("#txtZip").val(value[0]);
				hide();
			}
		} else {
			var cityname = $("#txtZip").val();
		}
	}
})()