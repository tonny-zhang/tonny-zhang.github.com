(function(){
	var REG_FUNCTION = /^function\s*\([^)]*\)\s*{([\s\S]*)}\s*$/;
	var code = [];
	W.__adCallback = function(fn){
		var match = REG_FUNCTION.exec(fn.toString());
		if(match){
			code.push(match[1]);
		}
	}
	var isIE = !-[1,];
	var _seajs = W.getSeajs();
	var _resolve = _seajs.resolve;
	var _base = _seajs.data.base+'j/ad/';
	W.use(['j/ad/caoyu-min.js','j/ad/ex2.js'],function(){
		W.__adCallback = null;
		code = code.join(';');
		W(function(){
			$('script').each(function(){
			  var $this = $(this);
			  //处理caoyu的广告
			  if($this.attr('type') == 'caoyu_ad'){
				var s = $this.get(0);
		        var adCode = s.innerText||s.text;
		        var container = $this.parent();
		        var ifrm = $('<iframe class="bgLoading" frameborder="0" scrolling="no">').attr('width',container.width()).attr('height',container.height()).appendTo(container).get(0);
		        var doc = null;
				if(ifrm.contentDocument) { // Firefox, Opera
					doc = ifrm.contentDocument;
				} else if(ifrm.contentWindow) { // Internet Explorer
					doc = ifrm.contentWindow.document;
				} else if(ifrm.document) { // Others?
					doc = ifrm.document;
				}
				doc.open();
				doc.write('<html><head><script>'+code+'</'+'script></head><body style="background-color: transparent;padding:0;margin:0;"><script>'+adCode+'</'+'script></body></html>');
				//thanks to http://antalpha.blogspot.com/2009/02/add-dynamic-content-to-iframe-ie-issues.html
				if (!isIE) {
					doc.close();
				}
			  }
			});
		});
	});
})();