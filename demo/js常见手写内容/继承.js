console.log('继承相关demo');

// 原型

// js声明一个构造函数的时候会在内存中创建一个对象，这个对象就是原函数的原型；
// 构造函数有一个prototype属性指向该函数的原型
var Person = function (name, age) {
    this.name = name;
    this.age = age;
};

var b = new Person('hanmeimei', 25);
