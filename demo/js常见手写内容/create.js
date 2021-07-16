
// 继承的实现方式；手写object.create(); 
function create (obj) {
    function Fn () {}
    Fn.prototype = obj;
    return new Fn();
}

// 手写instance方法；
// Object.getPrototypeof()返回的是__proto__属性，前者是后者的标准实现

function myinstanceof (left, right) {
    let proto = Object.getPrototypeOf(left);
    let prototype = right.prototype;
    while (true) {
        if (!proto) {
            return false;
        }

        if (prototype === proto) { return true}
        proto = Object.getPrototypeOf(proto);
    }
}

// 手写new方法
/**
 * new一个对象的过程
 * 1、创建一个空的对象
 * 2、修改对象的原型为构造函数的prototype属性
 * 3、让函数的this指向这个新的对象，执行构造函数的代码
 * 4、判断函数的返回值类型：如果是值类型，返回创建的对象；如果是引用类型，返回这个引用类型的对象
 */

function objectFactory () {
    let newObject = null;
    let constructor = Array.prototype.shift.call(arguments);
    let result = null;

    if (typeof constructor !== 'function') {
        return;
    }

    newObject = Object.create(constructor.prototype);
    result = constructor.apply(newObject, arguments);
    let flag = result && (typeof result === "object" || typeof result === "function");
    return flag ? result : newObject
}


/**
 * 手写promise.all
 * 1、返回的对象是一个promise
 * 2、promise的value是一个数组
 * 3、参数promise中的每一项都是resolve的时候才返回promise
 */
function promiseAll(promises) {
    return new Promise((resolve,reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError(`argument must be a array`);
        }
        let resolveCount = 0;
        let promiseCount = promise.length;
        let resolvedPromise= [];
        for (let i = 0; i < promiseCount.length; i++) {
            Promise.resolve(promise[i]).then(
                value=>{
                    resolveCount++
                    resolvedPromise[i] = value;
                    if (resolveCount === promiseCount) {
                        return resolve(resolvedPromise);
                    }
                },
                err=>{
                    return reject(err);
                })
        }
    })
}

/**
 * 防抖
 * 闭包、如果存在未执行的任务就清除任务
 */

function debounce (fn, wait) {
    let timer;
    return function () {
        let context = this;
        let args = arguments;

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, wait)
    }
}

/**
 * 节流
 */
function throttle (fn, wait) {
    let curTime = 0;
    return function () {
        let context = this;
        let args = arguments;
        let date = new Date();
        if (date - curTime > wait) {
            curTime = date;
            fn.apply(context, args);
        }
    }
}

/**
 * reduce 求和
 * arr=[1,2,3,4,5,6,7,8,9,10]，求和
 */

 function sum (arr) {
    if (!Array.isArray(arr)) {
        new TypeError(`argument must be a array`); 
    }

    let sum = arr.reduce( (pre, next) => {
        return  pre + next;
    },0)
    return sum;
}
console.log(sum([1,2,3,4,5,6,7,8,9,10]));

/**
 * 数组的扁平化
 * let arr = [1, [2, [3, 4, 5]]];
 */
 function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

/**
 * 数组去重
 */
 const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

console.log(Array.from(new Set(array)));

function uniqueArr (arr) {
    let map = {};
    let res = [];
    arr.forEach(item => {
        if (!map.hasOwnProperty(item)) {
            map[item] = 1;
            res.push(item);
        }
    })
    return res;
}

/**
 * 将数字转换为千分位
 */

function formateN  (n) {
    let num = n.toString() // 转成字符串
    let decimals = '';
    num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals;
    console.log(num);
    let len = num.length;

    if (len <= 3) {
        return num
    } else {
        let temp = ''
        let remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') + temp 
        }
    }
}
console.log('*************add **************');
/**
 * 实现add(3)(4,5)(6)()
 * 思路：借助闭包的方法
 */
function add () {
    if (arguments.length === 0) {
        let num = 0;
        add.args.forEach(item => {
            num += item;
        })
        add.args = null;
        return num
    }
    else {
        // 重复赋值一下，以防首次进入没有args属性
        add.args =  add.args  ? add.args : [];
        add.args = add.args.concat([...arguments])
        console.log( add.args );

        return add;
    }
}
console.log(add(6,8)(3,6,9)(6)());

/**
 * 打印红黄绿
 * 红灯3s打印一次
 * 黄灯2s打印一次
 * 绿灯1s打印一次
 */
function red () {
    console.log('红灯');
}
function yellow () {
    console.log('黄灯');
}
function green () {
    console.log('绿灯');
}
function task (color, wait, callback) {
    setTimeout(function () {
        if (color === 'red') {
            red()
        }
        else if (color === 'green') {
            green()
        }
        else if (color === 'yellow') {
            yellow()
        }
        callback();
    }, wait)
}
function step () {
    task ('red', 3000, () => {
        task('yellow', 2000, () => {
            task('green', 1000, step)
        })
    });
}
step();

/**
 *
 * // 转换前：
source = [{
            id: 1,
            pid: 0,
            name: 'body'
          }, {
            id: 2,
            pid: 1,
            name: 'title'
          }, {
            id: 3,
            pid: 2,
            name: 'div'
          }]
// 转换为: 
tree = [{
          id: 1,
          pid: 0,
          name: 'body',
          children: [{
            id: 2,
            pid: 1,
            name: 'title',
            children: [{
              id: 3,
              pid: 1,
              name: 'div'
            }]
          }
        }]
 */

const source = [{
    id: 1,
    pid: 0,
    name: 'body'
  }, {
    id: 2,
    pid: 1,
    name: 'title'
  }, {
    id: 3,
    pid: 2,
    name: 'div'
}];
// 借助的是引用对象类型修改内容会引起所有相关变量的修改

function jsonToTree (json) {
    let result = [];
    if (!Array.isArray(json)) {
        return result;
    }
    let map = {};
    json.forEach(item => {
        map[item.id] = item;
    });
    json.forEach(item=>{
        let parent = map[item.pid];
        if (parent) {
            (parent.child || (parent.child = [])).push(item);
        }
        else {
            result.push(item)
        }
    });
    return result;
}
console.log(jsonToTree(source));


// 打印1、2、3、4

for (var i = 0; i < 5; i++) {
    (function (i) {
        setTimeout(function () {console.log(i);}, 0)
    })(i)
}

for (let i = 0; i < 5; i++) {
    setTimeout(()=>{console.log(i);}, 0)
}