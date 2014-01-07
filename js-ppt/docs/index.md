# javascript学习

------------

### 历史
### 基本用法
引用外部脚本

`<script src="1.js"></script>`

内联脚本
```
<script>
// jscode
</script>
```

### 变量及数据类型
变量定义
```
//var 定义
var val1;
var v1,v2,v3;
var v1 = 1,v2 = 2,v3;
var v1 = v2 = v3 = 1;
//不加val定义(全局变量[window属性])
v1 = 1;
v1 = v2 = v3 = 2;
window['v1'] = 1;
```
* Boolean
* Number
* String
* Undefined
> Undefined类型只有一个值，即undefined，使用var声明变量，但是未对初始化的

* Null (Null类型也只有一个值：null。null表示一个空对象的指针。)
* Object (Array/Date/Math/RegExp)
* Function

检测变量类型函数
```
!function(){
	function getDataType(data){
		console.log(data,'=>', ({}).toString.call(data).slice(8,-1) );
	}
	getDataType(true);
	getDataType(1);
	getDataType('hello');
	getDataType(undefined);
	getDataType(null);
	getDataType({name:'hello'});
	getDataType(new Object());
	getDataType([1]);
	getDataType(new Date());
	getDataType(function(){});
}();
```

### 解析及运行原理

* [预解析](./pre-parse.md)
* [执行过程](./exec.md)

### 运算符及表达式
```
// 短路计算规则（java/php等语言里好像没有此用法）
false || (flag = true); 
//=>
if(false){
	
}else{
	flag = true;
}
true && (flag = true);
//=>
if(true){
	flag = true;
}
```

### 流程控制，函数

### 作用域 [>>](./scope.md)

函数作用域（区别于java/c等语言的块作用域）

### [关键字this](http://www.swordair.com/blog/2013/06/715/)

### 闭包 [>>](./closure.md)
* 什么是闭包
* 闭包的作用和效果
* 闭包的使用注意事项
* 应用场景 
* [用法示例](../examples/closure.md)

### 继承探究 [>>](./extend.md)

* 概念
* 和java/php等语言继承的对比

### setTimeout和setInterval详解

### 事件 [>>](./event.md)
### 垃圾回收及内存溢出
### 压缩及合并

### 好的前端网站分享
