	var obj1 = {a: {name: '小红'}, b: 2, arr:[1,2]}
	var obj2 = {}		
  //参数：初始值，完成值
  function deepClone(initalObj, finalObj) {    
    var obj = finalObj || {};    
    for (var i in initalObj) {       
    //判断是否引用类型，object,Array 的typeof检测 都是object
      if (typeof initalObj[i] === 'object') {
        //递归前，判断是对象还是数字，初始化
        obj[i] = (initalObj[i].constructor === Array) ? [] : {};            
        //递归自己
        arguments.callee(initalObj[i], obj[i]);
      } else {
      //基础类型值 直接复制
        obj[i] = initalObj[i];
      }
    }    
    return obj;
  }
		
		deepClone(obj1, obj2)
		console.log(obj2)  //{a: {name: '小红'}, b: 2, arr:[1,2]}