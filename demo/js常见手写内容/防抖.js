// 连续多次点击，只会相应最后的一次请求
const debounce = (fn, await)=>{
  // 缓存的定时器id
  let timer = 0;
  // 返回的函数实际上是用户每次调用的函数
  // 如果已经设置了定时器，就清空之前的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      fn.apply(this, args);
    }, await);
  }
}