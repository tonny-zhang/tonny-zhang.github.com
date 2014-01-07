结合闭包的应用场景分析闭包的具体用法

[参考一](http://www.w3ctech.com/p/763)
[参考二](http://www.w3ctech.com/p/864)

##保护变量安全性

#### 模块化或功能分离时，减小对全局变量的污染
```
(function(){
	var name = 'init';
	console.log(name);
})();
!function(){
	var name = 'init';
	console.log(name);
}()
```
#### 回调函数也是闭包的一种常见应用
```
!function(){
	var isRun = false;
	function run(afterRunCallback){
		isRun = true;
		afterRunCallback && afterRunCallback(isRun);
	}
	run(function(){
		console.log(arguments);
	});
}();
```

##共享内存
```
var count = (function(){
	var counter = 0;
	return function(){
		counter++;
		console.log(counter);
	}
})();
count();
count();
count();
```

##保护变量的安全实现JS私有属性和私有方法
> 和第一种用法相似，但这里的用法更具体，常见的用法就是**面向对象**编程时用

```
function Person(){
	var _name;					//这里更像其它语言里的private
	this.name = 'no named';		//public
	this.setName = function(name){
		_name = name;
		this.name = name;
	}
	this.getName = function(){
		return _name;
	}
}
var person = new Person();
person.setName('tonny');
console.log('My name is '+person.getName());
console.log('My name is '+person.name);
```
