(function(global){
	/*
	重写document.write(ln)实现广告代码的异步载入，可能调用document.write(ln)的情况如下：
	1.页面直接调用
		1) 直接document.write
		2) 调用外部文件调用document.write
	2.在某回调函数中输出页面代码
		1) 直接输出内连脚本
		2) 输出外部脚本,同步加载完成后再调用document.write(ln)
	
	解决方案：先调用真实的document.write(ln)输出点位符
	1. 直接输出点位符
	2. 1) 直接输出点位符
	   2) 把当前的<script src=""></script>替换成点位符

	!!此实现方案弊端：当页面直接document.write时，需要将第二个参数写成true
	*/
	var doc = document;
	var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
	var baseElement = head.getElementsByTagName("base")[0];
	var interactive = document.attachEvent && !window['opera']
	
	var index = 0;
	var getRandomId = function(){
		return 'doc_'+(new Date().getTime())+'_'+(index++);
	}
	var getPlaceholder = function(randomId){
		return '<span id="'+(randomId || getRandomId())+'"></span>';
	}
	function getCurrentScript(){
		var cs = document.currentScript;
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
	var isCanGetCurrentScript = !!getCurrentScript();//console.log(isCanGetCurrentScript);
	function getPlaceholderId(node){
		var currentScript = node || getCurrentScript();
		if(currentScript){
		//console.log(currentScript.src,currentScript.getAttribute('pid'));
			return currentScript.getAttribute('pid');
		}
	}
	var SCRIPT_REG = /<script([^>]*)>(.*?)<\/script>/g;
	var SCRIPT_SRC_REG = /src\s*=\s*(['"])([^'"]+)\1/;
	var READY_STATE_RE = /^(?:loaded|complete|undefined)$/
	var DOCUMENT_WRITE_RE = /document\.write(?:ln)?\s*\((['"]?)(.*?)\1\)\s*;?/g;
	doc['__write'] = document.write;
	var dataCache = {};
	var currentlyAddingScript,interactiveScript;
	var anonymousMeta = [];
	document.write = document.writeln = function(str,isFromDocument){
		var placeholderId = getPlaceholderId();//console.log(str,placeholderId);
		var scriptArr = [];
		var TYPE_CODE = 1;
		var TYPE_SCRIPT = 2;
		var match;
		var oldStr = str;
		while((match = SCRIPT_REG.exec(oldStr))){
			var code = match[2];
			if(code){//内部脚本
				var rId = getRandomId();
				scriptArr.push([TYPE_CODE,code,rId]);
				str = str.replace(match[0],getPlaceholder(rId));
			}
			var attrs = match[1];
			if(attrs){
				var m = SCRIPT_SRC_REG.exec(attrs);
				if(m){
					var rId = getRandomId();
					str = str.replace(match[0],getPlaceholder(rId));
					scriptArr.push([TYPE_SCRIPT,m[2],rId]);
				}
			}
		}
		//外部脚本加载完成
		if(placeholderId){
			_write(placeholderId,str);
		}else{
			if(isFromDocument || isCanGetCurrentScript){
				var randomId = getRandomId();
				dataCache[randomId] = str;
				doc.__write(getPlaceholder(randomId));
			}else{
				anonymousMeta.push(str);
			}
		}
		console.log(placeholderId,isFromDocument,isCanGetCurrentScript,scriptArr,str);
		for(var i = 0,j=scriptArr.length;i<j;i++){
			var item = scriptArr[i];
			var type = item[0];
			var content = item[1];
			var pid = item[2];
			if(type == TYPE_CODE){
				//这时是否考虑再写document.write
				var newContent = content;
				var tempMatch;//console.log(DOCUMENT_WRITE_RE.exec(content));console.log(DOCUMENT_WRITE_RE.exec(content));
				while((tempMatch = DOCUMENT_WRITE_RE.exec(content))){
					var dCode = tempMatch[2];
					_write(pid,dCode);
					newContent = newContent.replace(tempMatch[0],'');
				}

				newContent && eval(newContent);
			}else if(type == TYPE_SCRIPT){
				var script = document.createElement('script');
				if(!isCanGetCurrentScript){
					script.onload = script.onerror = script.onreadystatechange = function(){
						if (READY_STATE_RE.test(script.readyState)) {
							var placeholderId = getPlaceholderId(script);
							// Ensure only run once and handle memory leak in IE
							script.onload = script.onerror = script.onreadystatechange = null;
							interactiveScript = script;
							script = null;
							var temp;console.log(placeholderId,content, anonymousMeta);
							while((temp = anonymousMeta.shift())){
								_write(placeholderId,temp);
							}
							anonymousMeta = [];
					  	}
					}
				}
				
				script.setAttribute('pid',pid);
				script.src = content+'?'+Math.random();
				currentlyAddingScript = script;
				baseElement ? head.insertBefore(script, baseElement) : head.appendChild(script);
				currentlyAddingScript = null;
			}
		}
	}
	
	var _write = function(placeholderId,str){console.log(document.getElementById('doc_1379484343367_3').innerHTML,'_'+placeholderId+'_',str,document.getElementById(placeholderId));
		document.getElementById(placeholderId).innerHTML += str;
	}
	global.docWriteDown = function(){
		for(var i in dataCache){
			_write(i,dataCache[i]);
		}
	}
})(this);