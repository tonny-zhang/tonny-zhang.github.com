(function(global){
	var ABSOLUTE_RE = /^\/\/.|:\//
	var DOT_RE = /\/\.\//g
	var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//

	var doc = document;
	var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
	var baseElement = head.getElementsByTagName("base")[0];

	var cacheCallback = global.cache = {};
	var addCallback = function(url,callback){
		cacheCallback[url] = function(data){
			cacheCallback[url] = null;
			callback && callback(data);
		}
	}
	var execCallback = function(url,data){
		var callback = cacheCallback[url];
		callback && callback(data);
	}
	var currentJs;
	var interactiveScript;
	
	var getCbid = (function(){
		var cbid = 0;
		return function(){
			return cbid++;
		}
	})();
	//
	var resolve = function(url){
		url = normailize(url);
		if(ABSOLUTE_RE.test(url)){
			return url;
		}else{
			if(url.charAt(0) == '/'){
				return root + url.substring(1);
			}else{
				url = base + url;
			}
			url = url.replace(DOT_RE,'/');
			while (url.match(DOUBLE_DOT_RE)) {
				url = url.replace(DOUBLE_DOT_RE, "/")
			}
			return url;
		}
	}
	var DOUBLE_SEP_RE = /\/{2,}/g;
	var PROTOCOL_RE = /.*:\/+/;
	var normailize = function(url){
		url = url.replace(/\\/g,'/');
		var m = url.match(PROTOCOL_RE);
		if(m){
			url = url.replace(PROTOCOL_RE,'___');
		}
		url = url.replace(DOUBLE_SEP_RE,'/');
		if(m){
			url = url.replace('___',m[0]);
		}
		return url;
	}
	var base = normailize(location.href).replace(/(\/)[^\/]*?$/,'$1');
	var root = (function(){
		var ROOT_DIR_RE = /(^.*?\/{2,}.*?)\//
		var m = base.match(ROOT_DIR_RE);
		if(m){
			return m[0]
		}
	})();
	// console.log(resolve('http://www.baidu.com////'));
	// console.log(resolve('http://www.baidu.com////1.html'));
	// console.log(resolve('./1.html'));
	// console.log(resolve('.///a///1.html'));
	// console.log(resolve('../1.html'));
	// console.log(resolve('..////1.html'));
	// console.log(resolve('../../1.html'));
	global.jsonp = function(url,callback){
		var js = doc.createElement('script');
		url = resolve(url);
		js.onload = function(){
			execCallback(url,anonymousMeta);
			anonymousMeta = null;
		}
		// For some cache cases in IE 6-8, the script executes IMMEDIATELY after
		// the end of the insert execution, so use `currentJs` to
		// hold current node, for deriving url in `callback` call
		currentJs = js;
		addCallback(url,callback);
		js.src = url;
		// ref: #185 & http://dev.jquery.com/ticket/2709
		baseElement ? head.insertBefore(js, baseElement) : head.appendChild(js);
		currentJs = null;
	}
	var getCurrentJs = function(){
		if(currentJs){
			return currentJs;
		}else{
			// For IE6-9 browsers, the script onload event may not fire right
			// after the script is evaluated. Kris Zyp found that it
			// could query the script nodes and the one that is in "interactive"
			// mode indicates the current script
			// ref: http://goo.gl/JHfFW
			if (interactiveScript && interactiveScript.readyState === "interactive") {
				return interactiveScript
			}
			var scripts = head.getElementsByTagName("script")

			for (var i = scripts.length - 1; i >= 0; i--) {
				var script = scripts[i];
				if (script.readyState === "interactive") {
					interactiveScript = script;
					return interactiveScript
				}
			}
		}
	}
	var getAbsoluteSrc = function(node){
		// see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
		return node && resolve(node.hasAttribute/* non-IE6/7*/ ? node.src : node.getAttribute('src',4));
	}
	var anonymousMeta;
	global.callback = function(data){
		var currentSrc = getCurrentJs();
		if(currentSrc){
			currentSrc = getAbsoluteSrc(currentSrc);
			execCallback(currentSrc,data);
		}else{
			anonymousMeta = data;
		}
	}
})(this.W || (this.W = {}));