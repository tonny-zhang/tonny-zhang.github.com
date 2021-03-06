!function () {
	var _hideLoading = function(){
        try{
            window.android.hideLoading();
        }catch(e){}
    }
    _hideLoading();
	var holiday = [
		"20130919","20130920","20130921","20131001","20131002","20131003","20131004","20131005","20131006","20131007",
		"20140101",//元旦
		"20140131","20140201","20140202","20140203","20140204","20140205","20140206",//春节
		"20140405","20140406","20140407",//清明节
		"20140501","20140502","20140503",//劳动节
		"20140531","20140601","20140602",//端午节
		"20140906","20140907","20140908",//中秋节
		"20141001","20141002","20141003","20141004","20141005","20141006","20141007",//国庆节
		"20150101","20150102","20150103",// 元旦
        "20150218", "20150219", "20150220", "20150221", "20150222",
        "20150223",
        "20150224",// 春节
        "20150405", "20150406",
        "20150407",// 清明节
        "20150501",// 劳动节
        "20150620", "20150621","20150622",// 端午节
        "20150927",// 中秋节
        "20151001", "20151002", "20151003", "20151004", "20151005",
        "20151006", "20151007"// 国庆节
	];
	var paidleave = {
		"20130922": "2013-09-20", //日期: 对应调休至的工作日日期
		"20130929": "2013-10-04",
		"20131012": "2013-10-07",
		"20150104": "20140102",
		"20150215": "20150223",
		"20150228": "20150224"
	};
	var city = {
		"10101": "getLimitLine_BJ",
		"10103": "getLimitLine_BJ", //天津2014年3月1日执行限行规定，限行规定和北京一样，所以使用函数getLimitLine_BJ
		"1010601": "getLimitLine_CC",
		"1012101": "getLimitLine_HZ",
		"1011601": "getLimitLine_LZ",
		"1012701": "getLimitLine_CD",
		"1012401": "getLimitLine_NCGY",
		"1012601": "getLimitLine_NCGY",
	};
	function getDateStr(date){
		var dateStr = date.getFullYear();
		var m = date.getMonth()+1;
		dateStr += (m < 10?'0':'')+m;
		var d = date.getDate();
		dateStr += (d < 10?'0':'')+d;
		return dateStr;
	}
	function getBJWeekLimit(date){
		var week = date.getDay();
		var cTime = date.getTime();
		var arr = [];
		for(var i = week-1;i>=0;i--){
			var nextDate = new Date(cTime);
			nextDate.setDate(nextDate.getDate()-i);
			arr.push(getLimitLine_BJ(nextDate));
		}
		arr.push(getLimitLine_BJ(date));
		for(var i = week+1;i<=5;i++){
			var nextDate = new Date(cTime);
			nextDate.setDate(nextDate.getDate()+i);
			arr.push(getLimitLine_BJ(nextDate));
		}
	}
	function isHoliday(date){
		return $.inArray(getDateStr(date),holiday) > -1;
	}
	function getAPEC(date){
		var date_str = getDateStr(date);
		if(date_str >=20141103 &&  date_str <=20141112){
			return date_str%2 == 1?'双号':'单号';
		}		
	}
	var fn = {
		/*
			获取北京汽车限尾号限行
			公休/节假日不限行
		*/
		getLimitLine_BJ: function(date,isReturnWeek){
			var date_str = getDateStr(date);
			if(isHoliday(date)){
				if(isReturnWeek){
					while(true){
						var toDate = new Date(date.getTime());
						toDate.setDate(toDate.getDate()+Math.ceil(Math.random()*20));
						if(!isHoliday(toDate)){
							break;
						}
					}
					var result = fn.getLimitLine_BJ(toDate,true);
					result[0] = '';
					return result;
				}
				
				return '';
			}
			var array = [
				"1,6","2,7","3,8","4,9","5,0"
			];
			//顺序为周日到周六
			var startTime = new Date("2014-01-12 00:00:00"); //星期日
			var currentTime = date;
			
			var week = currentTime.getDay();
			if(week == 0 || week == 6){
				if(isReturnWeek){
					var d = week == 0?-2:week == 6?-1:0;
					var toDate = new Date(currentTime.getTime());
					toDate.setDate(toDate.getDate()+d);
					var result = fn.getLimitLine_BJ(toDate,true);
					result[0] = getAPEC(currentTime)||'';
					return result;
				}else{
					return getAPEC(currentTime)||'';
				}
			}

			var chaDay = Math.floor((currentTime - startTime) / 1000 / 24 / 3600 );
			var chaWeek = Math.ceil(chaDay/7);
			var currentPos = Math.ceil(chaWeek/13) - 1;
			currentPos = currentPos<0?0:currentPos;
			currentPos = currentPos%5;
			var arrkey = week - 1 - currentPos;
			arrkey = arrkey>0?arrkey:arrkey+5;
			if(arrkey > 4){
				arrkey = arrkey % 5;
			}
			var a = array.splice(arrkey - week + 1);
			array = a.concat(array);
			var firstDate = new Date(currentTime.getTime());
			firstDate.setDate(firstDate.getDate()-(currentTime.getDay()-1));
			for(var i = 0;i<7;i++){
				if(i > 0){
					firstDate.setDate(firstDate.getDate()+1);
				}
				
				var apec = getAPEC(firstDate);
				if(apec){
					array[i] = apec;
				}
			}
			// var startArr = array.splice(5 - week + 1 + arrkey);
			// array = startArr.concat(array);
			if(isReturnWeek){
				return [array[week-1],array];
			}
			var apec = getAPEC(currentTime);
			return array[week-1];
		}
		/*
			获取南昌和贵阳汽车限尾号限行
			公休/节假日不限行
		*/
		,getLimitLine_NCGY: function(date,isReturnWeek){
			var array = [
				"","1,6","2,7","3,8","4,9","5,0",""
			];
			var weekArr = array.slice(1,6);
			if(isHoliday(date)){
				if(isReturnWeek){
					return ['',weekArr];
				}
				return '';
			}
			var week = date.getDay();
			var val = array[week];
			if(isReturnWeek){
				return [val,weekArr];
			}
			return val;
		}
		/*
			获取成都汽车限尾号限行
			调休按对应工作日(周几)限行
		*/
		,getLimitLine_CD: function(date,isReturnWeek){
			var array = [
				"","1,6","2,7","3,8","4,9","5,0",""
			];
			var weekArr = array.slice(1,6);
			if(isHoliday(date)){
				if(isReturnWeek){
					return ['',weekArr];
				}
				return '';
			}
			var toDate = paidleave[getDateStr(date)];
			date = toDate?toDate: date;
			var week = date.getDay();
			var val = array[week];
			if(isReturnWeek){
				return [val,weekArr];
			}
			return val;
		}
		/*
			获取兰州汽车限尾号限行
			所有日期都限行
		*/
		,getLimitLine_LZ: function(date,isReturnWeek){
			var array = [
				"5,0","1,6","2,7","3,8","4,9","5,0","1,6","2,7","3,8","4,9"
			];
			var val = array[date.getDate()%10];
			if(isReturnWeek){
				return [val,array]
			}
			return val;
		}
		/*
			获取杭州汽车限尾号限行
			调休按对应工作日(周几)限行
		*/
		,getLimitLine_HZ: function(date,isReturnWeek){
			var array = [
				"","1,9","2,8","3,7","4,6","5,0",""
			];
			var weekArr = array.slice(1,6);
			if(isHoliday(date)){
				if(isReturnWeek){
					return ['',weekArr];
				}
				return '';
			}
			var toDate = paidleave[getDateStr(date)];
			date = toDate?toDate: date;
			var week = date.getDay();
			var val = array[week];
			if(isReturnWeek){
				return [val,weekArr];
			}
			return val;
		}
		/*
			获取长春汽车限尾号限行
			每日
		*/
		,getLimitLine_CC: function(date,isReturnWeek){
			var d = date.getDate();
			if(d == 31){
				return '';
			}
			return d%10;
		}
	};
	function getLimitLine(date,areaid,isReturnWeek){
		var provid = areaid.substr(0,5);
		var cityid = areaid.substr(0,7);
		var fnName = city[areaid] || city[provid] || city[cityid];
		if(fnName){
			return fn[fnName](date,isReturnWeek);
		}
		return false;
	}
	window['getLimitLine'] = getLimitLine;
}();
