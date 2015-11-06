/*单独初始化可引用的module再对外提供service,在另个的module里把这个module引入就可以直接使用这里的service*/
angular.module('myService', []).service('One', ['Two', function(Two){
	return {
		get: function(){
			return 'One service2;'+Two.get();
		}
	}
}]);