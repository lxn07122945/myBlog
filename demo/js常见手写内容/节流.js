const throttle = (fns, wait = 50) {
  let lastTime= 0;
  return function (...args) {
    let now = new Date();
    if (now - lastTime > wait){
      lastTime = now;
      fns.apply(this, args);
    }
  }
}  