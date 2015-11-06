先看下这段代码的结果
```
<script type="text/javascript">
      alert(num);
      var num = 1;
</script>
```
这个函数执行时会弹出什么呢？
思考一下，结果是‍undefined；因为在解释到 var num= 1; 这句之前就打印了num的值，此时尚未给num赋值。
为什么不输出“未定义”呢?
通俗点说就是因为在一个javascript块加载未执行时，程序会先看一遍有什么东东，并把它放在一个地方！

下面就说函数预解析：

1、javascript在执行前会进行类似“预解析”的操作：首先会创建一个在当前执行环境下的活动对象，并将那些用var 声明的变量、定义的函数设置为活动对象的属性，但是此时这些变量的赋值都是undefined。

2、在javascript解释执行阶段，遇到变量需要解析时，会首先从当前执行环境的活动对象中查找，如果没有找到‍而且该执行环境的拥有者有prototype属性时则会从prototype链中查找，否则将会按照作用域链查找。遇到var a = …这样的语句时会给相应的变量进行赋值（注意：变量的赋值是在解释执行阶段完成的，如果在这之前使用变量，它的值会是undefined）。

### 例一：
```
<script type="text/javascript">
    alert(val1);
	var val1 = "test"
</script>
<script type="text/javascript">
	try{
	    alert(val2);
		var val1 = "test"
	}catch(e){alert(e)}
</script>
<script type="text/javascript">
    handle();
	var handle = function (){
		alert("输出");
	}
</script>
```
结果：handle is not a function.因为在执行handle（）这句时并没有给handle赋值-也就是函数未定义

### 例二：
```
<script type="text/javascript">
    handle();
	function handle(){
		alert("输出");
	}
</script>
```
这里的结果和上面的截然不同的，因为： **javascript 在预解析时function的声明优先级高**

### 例三：
```
<script type="text/javascript">
    handle();
	function handle(){
		alert("输出");
	}
	var handle;
</script>
```
结果和例二是一样的，原因也一样

### 例四：
```
<script type="text/javascript">
    handle();
	function handle(){
		alert("输出");
	}
	function handle(){
		alert("输出1");
	}
</script>
```
第二个会把第一个的定义覆盖掉

### 例五：
```
<script type="text/javascript">
    handle();
	function handle(){
		alert("输出");
	}
</script>
<script type="text/javascript">
	function handle(){
		alert("输出1");
	}
</script>
<script type="text/javascript">
	alert(handle);//这里的结果为最后一个的定义
</script>
```
这个例子可以看出不在同个`<script>`标签里的重定义函数在预解析时不会覆盖同名函数