## 作用域

### 1.作用域
JavaScript的作用域与C、Java等语言不同，它不是以花括号包围的块级作用域，这个特性经常被大多数人忽视。例如下面代码，在大多数类C的语言中会出现变量未定义的错误，但在JavaScript中却完全合法：
```
if (true) {
    var msg = 'msg';
}
console.log(msg); // 输出 msg;
```
这是因为JavaScript的作用域完全是由函数来决定的，if、for语句中的花括号不是独立的作用域。

### 2.函数作用域
不同于大多数类C的语言，由一对花括号封闭的代码块就是一个作用域，JavaScript的作用域是通过函数来定义的，在一个函数中定义的变量只对这个函数内部可见，我们称为函数作用域。在函数中引用一个变量时，JavaScript会先搜索当前函数作用域，如果没有找到则搜索其上层作用域，一直到全局作用域。下面是一个简单的例子：
```
var scope = 'global';
var f1 = function() {
    console.log(scope);
}
f1(); // 输出 global

var f2 = function() {
    var scope = 'f2';
    console.log(scope);
}
f2(); // 输出 f2
```
以上示例十分明了，JavaScript的函数定义是可以嵌套的，每一层是一个作用域，变量搜索顺序是从内到外，按照作用域搜索顺序，在console.log函数访问scope变量时，JavaScript会先搜索函数f2的作用域，恰巧在f2的作用域里搜索到了scope变量，所以上层作用域中定义的scope就被屏蔽了。但下面这个例子可能就有些让人困惑：
```
var scope = 'global';
var f3 = function() {
    console.log(scope);
    var scope = 'f3';
}
f3(); // 输出 undefined
```
上面的代码可能和你的预想不一样，并没有输出global，而是undefined，这是为什么呐？这是JavaScript的一个特性，就是变量声明语句永远在该作用域里最先被执行，所以上面的例子形同如下：
```
var scope = 'global';
var f4 = function() {
    var scope; // 变量声明最先被执行
    console.log(scope);
    scope = 'f4'; //变量被赋予值
}
f4(); // 输出 undefined
```
这样就不难理解运行f3()函数为什么没输出global，而是undefined了。

### 3.函数作用域的嵌套
一个作用域嵌套的例子：
```
var f5 = function() {
    var scope = 'first';
    (function() {
        var scope = 'second';
        (function() {
            console.log(scope);
        }());
    }());
}
f5(); // 输出 second
```
我们在最内层函数中引用到了scope变量，通过作用域搜索，找到了其父作用域中定义的scope变量。
有一点要注意：函数作用域的嵌套关系是在定义时决定的，而不是在调用时决定的，下面是一个简单的例子：
```
var scope = 'global';
var f6 = function() {
    console.log(scope);
}
var f7 = function() {
    var scope = 'f7';
    f6();
}
f7(); // 输出 global
```
这个例子中，通过f7调用的f6在搜索scope时，找到的是f6函数的父作用域中定义的scope变量，而不是f7中定义的scope变量。这说明了函数作用域的嵌套关系是在定义时决定的，而不是在调用时决定的。