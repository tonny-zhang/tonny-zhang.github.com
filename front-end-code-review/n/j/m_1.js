showResult('m_1 loaded');
define(function(require){
	var m_2 = require('./m_2');//require可以用相对路径
	W(function(){
		showResult('m_1 run,m_2:'+m_2.name);
	})
});