(function(global){
	var doc = document;
	var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
	var baseElement = head.getElementsByTagName("base")[0];
	var interactive = doc.attachEvent && !window['opera']
	
	var index = 0;
	var getRandomId = function(){
		return 'dw_'+(new Date().getTime())+'_'+(index++);
	}
	var getPlaceholder = function(randomId){
		return '<span id="'+(randomId || getRandomId())+'"></span>';
	}
	var currentlyAddingScript,interactiveScript;
	function getCurrentScript(){
		var cs = doc.currentScript;
		if(cs){
			return cs;
		}
		if (currentlyAddingScript) {
			return currentlyAddingScript
		}
		// For IE6-9 browsers, the script onload event may not fire right
		// after the the script is evaluated. Kris Zyp found that it
		// could query the script nodes and the one that is in "interactive"
		// mode indicates the current script
		// ref: http://goo.gl/JHfFW
		if (interactiveScript && interactiveScript.readyState === "interactive") {
			return interactiveScript
		}

		var scripts = head.getElementsByTagName("script")

		for (var i = scripts.length - 1; i >= 0; i--) {
			var script = scripts[i]
			if (script.readyState === "interactive") {
				interactiveScript = script
				return interactiveScript
			}
		}
	}
	function getPlaceholderId(node){
		node = node || getCurrentScript();
		if(node){
			return node.getAttribute('pid');
		}
	}
	// 百度浏览器和360浏览器，isCanGetCurrentScript为null
	var isCanGetCurrentScript = !!getCurrentScript();
	doc['__write'] = doc.write;
	/*重写document.write
	!!当页面直接使用document.write时，需要把最后一个参数设置成true
	*/
	doc.writeln = doc.write = function(){
		var args = [].slice.call(arguments,0);
		if(args[args.length-1] === true){
			args.pop();
			var isFromDocument = true;
		}
		
		for(var i = 0,j=args.length;i<j;i++){
			var str = _parse(args[i],isFromDocument);
			// doc.__write(+new Date()+' '+str);
		}
	}
	var SCRIPT_REG = /<script([^>]*)>(.*?)<\/script>/g;//不考虑 type!="text/javascript"
	var SCRIPT_SRC_REG = /src\s*=\s*(['"])([^'"]+)\1/;
	var READY_STATE_RE = /^(?:loaded|complete|undefined)$/;
	var DOCUMENT_WRITE_RE = /document\.write(?:ln)?\s*\((['"]?)(.*?)\1\)\s*;?/g;
	var TYPE_CODE = 1;
	var TYPE_SCRIPT = 2;
	var dataCache = {};//缓存数据
	var anonymousMeta = [];
	function _parse(str,isFromDocument){
		var tempStr = str;
		var match;
		var scriptArr = [];
		var pid = getPlaceholderId();
		var randomId = getRandomId();
		var codeArr = [];
		while((match = SCRIPT_REG.exec(tempStr))){
			var rId = getRandomId();
			str = str.replace(match[0],getPlaceholder(rId));
			var type,content;
			var code = match[2];
			if(code){
				type = TYPE_CODE;
				content = code;
				var newCode = code;
				var tempMatch;//console.log(DOCUMENT_WRITE_RE.exec(content));console.log(DOCUMENT_WRITE_RE.exec(content));
				while((tempMatch = DOCUMENT_WRITE_RE.exec(code))){
					var dCode = tempMatch[2];
					// _write(rId,dCode);
					codeArr.push([type,dCode,rId]);
					newCode = newCode.replace(tempMatch[0],'');
				}

				newCode && eval(newCode);
			}else{
				type = TYPE_SCRIPT;
				var attrs = match[1];
				if(attrs){
					var m = SCRIPT_SRC_REG.exec(attrs);
					if(m){
						var src = m[2];
						codeArr.push([type,src,rId]);
					}
				}
			}
		}
		// console.log(scriptArr);
		if(isFromDocument){
			doc.__write(getPlaceholder(randomId));
			dataCache[randomId] = str;
		}else{
			if(pid){
				_write(pid,str);
			}else{
				anonymousMeta.push(str);
			}
		}
		setTimeout(function(){
			for(var i = 0,j=codeArr.length;i<j;i++){
				var item = codeArr[i];
				var type = item[0];
				var content = item[1];
				var pid = item[2];
				if(type == TYPE_CODE){
					_write(pid,content);
				}else if(type == TYPE_SCRIPT){
					_loadScript(rId,src,function(){
						// console.log(rId,anonymousMeta);
						for(var i = 0,j=anonymousMeta.length;i<j;i++){
							_write(pid,anonymousMeta[i]);
						}
						anonymousMeta = [];
					});
				}
			}
		},13)
		
		return str;
	}
	var _write = function(placeholderId,str){//console.log(str,placeholderId);
		document.getElementById(placeholderId).innerHTML += str;
	}
	function _loadScript(pid,src,callback){
		var script = document.createElement('script');
		script.onload = script.onerror = script.onreadystatechange = function(){
			if (READY_STATE_RE.test(script.readyState)) {
				// Ensure only run once and handle memory leak in IE
				script.onload = script.onerror = script.onreadystatechange = null;
				interactiveScript = script;
				script = null;
				callback && callback();
		  	}
		}
		
		script.setAttribute('pid',pid);
		script.src = src+'?'+Math.random();
		currentlyAddingScript = script;
		baseElement ? head.insertBefore(script, baseElement) : head.appendChild(script);
		currentlyAddingScript = null;
	}
	//经测试$回调晚于页面上同步的document.write
	$(function(){
		// console.log(dataCache);
		for(var i in dataCache){
			_write(i,dataCache[i]);
		}
	})
})(this);