继承是OO语言（如java/php)的一个最为人人津津乐道的概念。许多OO语言都支持两种继承方式：接口继承和实现继承。接口继承只继承方法签名，而实现继承则继承实际方法。由于ＪＳ里函数没有签名，在ECMAScript中无法实现接口继承，只支持实现继承，而且实现继承主要是依靠原型链来实现的.

## 1.原型链
```javascript
!function(){
	function SuperClass(){
		this.color = ["red","black"];
	}
	function SubClass(){

	}
	SubClass.prototype = new SuperClass();

	var instance1 = new SubClass();
	instance1.color.push("blue");
	console.log(instance1.color);

	var instance2 = new SubClass();
	console.log(instance2.color);
}()
```
！！这是原型链的问题所在，很多时候我们不会单独用原型链去继承

## 2.借用构造函数
```javascript
!function(){
	function SuperClass(){
		this.color = ["red","black"];
	}
	function SubClass(){
		//继承SuperClass
		SuperClass.call(this);//拥有了SuperClass属性的副本
	}

	var instance1 = new SubClass();
	instance1.color.push("blue");
	console.log(instance1.color);

	var instance2 = new SubClass();
	console.log(instance2.color);
}()
```

## 3.组合继承
```javascript
!function(){
	function SuperClass(name){
		this.name = name;
		this.color = ["red","black"];
	}
	SuperClass.prototype.sayName = function(){
		console.log(this.name);
	}
	function SubClass(name,age){
		//继承SuperClass
		SuperClass.call(this,name);//拥有了SuperClass属性的副本
		this.age = age;
	}
	SubClass.prototype = new SuperClass();
	SubClass.prototype.sayAge = function(){
		console.log(this.age);
	}

	var instance1 = new SubClass("one",10);
	instance1.color.push("blue");
	console.log(instance1.color);
	instance1.sayName();
	instance1.sayAge();

	var instance2 = new SubClass("two",20);
	instance2.color.push("black");
	console.log(instance2.color);
	instance2.sayName();
	instance2.sayAge();
}()
```
## 4.原型式继承
```javascript
!function(){
	function object(o){
		function F(){}
		F.prototype = o;
		return new F();
	}
	var Person = {
		name: 'Tonny',
		friends: ['Mike','Tom']
	}
	var anotherPerson = object(Person);
	anotherPerson.name = "anotherPerson";
	anotherPerson.friends.push("Lili");

	var yetAnotherPerson = object(Person);
	yetAnotherPerson.name = "yetAnotherPerson";
	yetAnotherPerson.friends.push("adidas");

	/*由于几个对象共享了Person的属性(引用传递)*/
	console.log(Person.friends);
}()
```
这种形式适用于不用创建构建构造函数，而只想让一个对象与另一个对象保持类型的情况。
!!但这形式包含引用类型值的属性始终都会共享相应的值，就和使用原型模式一样。

## 5.寄生式继承
```javascript
!function(){
	function object(o){
		function F(){}
		F.prototype = o;
		return new F();
	}
	function createAnother(o){
		var clone = object(o);
		clone.say = function(){
			console.log(this.name);
		}
		return clone;
	}
	var Person = {
		name: 'Tonny',
		friends: ['Mike','Tom']
	}
	var anotherPerson = createAnother(Person);
	anotherPerson.name = 'anotherPerson';
	anotherPerson.say();

	console.log(Person.name);
}()
```
使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降效率；这一点和构造函数模式类似。

## 6.寄生组合继承
前面说过，组合继承是javascript最常用的继承模式，但它也有自己的不足（在什么情况下，都会调用再次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部）

```javascript
!function(){
	function object(o){
		function F(){}
		F.prototype = o;
		return new F();
	}
	function inheritPrototype(subClass,superClass){
		var prototype = object(superClass.prototype); //创建对象
		prototype.constructor = subClass; //增强对象
		subClass.prototype = prototype;	//指定对象
	}
	function SuperClass(name){
		this.name = name;
		this.color = ["red","black"];
	}
	SuperClass.prototype.sayName = function(){
		console.log(this.name);
	}
	function SubClass(name,age){
		//继承SuperClass
		SuperClass.call(this,name);//拥有了SuperClass属性的副本
		this.age = age;
	}
	inheritPrototype(SubClass,SuperClass);
	SubClass.prototype.sayAge = function(){
		console.log(this.age);
	}

	var instance1 = new SubClass("one",10);
	instance1.color.push("blue");
	console.log(instance1.color);
	instance1.sayName();
	instance1.sayAge();

	var instance2 = new SubClass("two",20);
	instance2.color.push("black");
	console.log(instance2.color);
	instance2.sayName();
	instance2.sayAge();
}()
```
这里的运行结果和上面的组合继承得到的结果是一样的，但它的高效体现在它只调用了一次SuperClass的构造函数，并且因此避免了在SubClas.prototype上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；国此还能正常使用instanceof和isPrototypeof。
可以看出寄生组合式继承是引用类型最现想的继承方式。

******
现用到的继承封闭`global.js`

```javascript
!function(){
	var inherits = function (Parent,properties){
            var Child = function(){
                    Parent.apply(this,arguments);//继承对像作用域属性及方法
                    properties && properties.init && properties.init.apply(this,arguments);
            };

            //减小作用域链长度,继承原型链属性及方法
            Child.prototype = Parent.prototype;
            Child.constructor = Child;//重置构造函数,否则会通过作用域链找到，parent.constructor
            var extraProp = properties && properties.prototype;
            if(extraProp){
                    for(var i in extraProp){
                            Child.prototype[i] = extraProp[i];
                    }
            }
            return Child;
    }

    function Person(name){
    	this.name = name;
    }
    Person.prototype.say = function(){
    	console.log('My name is :'+this.name);
    }

    var Child = inherits(Person,{
    	init: function(name,age){
    		this.age = age;
    	},
    	prototype: {
    		sayAge: function(){
    			console.log(this.name + ' is '+this.age);
    		}
    	}
    });

    var man = new Person("person");
    man.say();
    console.log('man instanceof Person:',man instanceof Person);
    console.log('Person.prototype.isPrototypeOf(man):',Person.prototype.isPrototypeOf(man));

    var child = new Child("Tonny",26);
    child.say();
    child.sayAge();
    console.log('child instanceof Person:',child instanceof Person);
    console.log('Person.prototype.isPrototypeOf(child):',Person.prototype.isPrototypeOf(child));
    console.log('child instanceof Child:',child instanceof Child);
    console.log('Child.prototype.isPrototypeOf(child):',Child.prototype.isPrototypeOf(child));
}()
```
