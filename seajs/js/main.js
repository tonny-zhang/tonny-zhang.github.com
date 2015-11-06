define(function(require){
	var ModuleA = require('../lib/m_a');
	var ModuleB = require('../lib/m_b');
	console.log(ModuleA,ModuleB);
	require.async('../lib/m_a',function(){
		console.log(arguments);
	})
});