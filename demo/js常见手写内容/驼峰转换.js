var s1 = "get-element-by-id"

var f = function(s) {
    return s.replace(/-\w/g, function(x) {
        return x.slice(1).toUpperCase();
    })
}

var f2 = function (s) {
  var sArr = s.split('-');
  for (let i = 1; i < sArr.length; i++) {
    sArr[i] = sArr[i].charAt(0).toUpperCase() + sArr[i].slice(1);
  }
  return sArr.join('');
}
console.log(f(s1));
console.log(f2(s1));