define(function(require){
	var ModuleB = require('./m_b');
	require.async('./m_b',function(){
		console.log(arguments);
	})
	return {
		name: 'A',
		mods: [
			ModuleB
		]
	}
});