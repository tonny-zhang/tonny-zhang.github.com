(function(){
  W(function(){
    $('script').each(function(){
      var $this = $(this);
      //处理caoyu的广告
      if($this.attr('type') == 'text/caoyu_ad'){
        var s = $this.get(0);
        var code = s.innerText||s.text;
        var container = $this.parent();
        var fnName = 'iframe'+(+new Date());
        window[fnName] = function(){
          setTimeout(function(){
            try{
              delete window[fnName];
            }catch(e){
              window[fnName] = null;
            }            
          },10);
          return code;
        }
        $('<iframe class="bgLoading" frameborder="0" scrolling="no" src="./ad-caoyu.html#'+fnName+'" style="background-color: transparent;">').attr('width',container.width()).attr('height',container.height()).appendTo(container);
      }
    })
  });
})();