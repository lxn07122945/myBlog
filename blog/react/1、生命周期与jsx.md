### 受控组件与非受控组件
受控组件：状态和数据由使用者决定
非受控组件： 状态和数据由使用者自己决定

### 组件构建原则
    1、单一数据原则
    2、数据状态管理DRY原则
        1） 计算得到的状态就不要单独存储
        2）组件尽量无状态，所需数据通过props获取

### JSX
    一、JSX并不是一种模板语法，而是一种动态创建组件的语语法糖

    二、jsx中使用表达式
        1、jsx本身也是表达式
        2、在属性中使用表达式
        3、延展操作符（解构赋值）
        4、使用表达式
    三、约定自定义组件以大写字母开头
### 组件的生命周期以及使用场景
    getDerivedStateFromProps
        1）当state需要从props初始化时使用
        2）尽量不要使用
        3）每次render都会调用
        4）典型场景：表单控件获取默认值
    componentDidMount
        1）ui渲染完成后调用
        2）整个生命周期只调用一次
    getSnapsshotBeforeUpdate
        1）取render之前的DOM状态
        2）场景：虽然更新了组件的数据，但是想DOM保持原来状态，比如滚动条位置
    componentDidUpdate
    shouldcomponentUpdate
        1、决定虚拟DOm是否需要重绘
        2、react内部自动实现
        3、一般用作性能优化场景
    componentWillUnmount
        卸载组件

    
    
