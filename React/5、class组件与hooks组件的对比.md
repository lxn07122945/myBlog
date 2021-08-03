
### hooks解决的问题
  1、函数组件不能拥有自己的state；hooks之前react中的函数组件都是无状态的，通过props从父组件上获取状态；hooks提供的state可以在function组件中维护状态
  2、函数组件中不能监听组件的生命周期；useEffect聚合了多个生命周期
  3、class的生命周期比较复杂
  4、class组件的逻辑难以复用（HOC、render props）来实现逻辑复用

### hooks对比class的好处

  1、语法上更加简单
  2、业务代码更加聚合
  3、逻辑复用更加方便
  