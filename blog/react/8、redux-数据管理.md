### 状态管理框架：Redux
#### 是什么
基于flux的状态管理框架
创建了全局唯一的数据管理树：store，组件的所有数据都可以添加到store上，并在父子组件进行通讯的时候直接从store上读取

[Redux源码](https://github.com/reduxjs/redux/tree/master/src)

#### 特性：
    1、唯一状态来源、所有数据都来源于store
    2、可预测性： state + action = new state
    3、纯函数更新： Store
#### Store
    存储数据
        获取数据
        1、getState()
        派发action
        2、dispatch(action)
        订阅变更
        3、subscribe（listener）
### Reducer
    定义修改规则
#### Action

### 实际使用场景、

### react中使用redux


#### 异步action 与redux中间件

action的dispatch结果要通过中间件判断执行结果，根据执行结果来判断修改对应的reducer 
    redux中间件
        1、截获action
        2、发出action

#### react中组织action与reducer的优点
    1、集中管理
    2、分组件管理
        1）易于开发
        2）易于维护
        3）易于测试
        4）易于理解
#### 不可变数据 immutable data
    修改不可变数据
        1）原生写法：解构操作符、Object.assign
        2) immer
        3）immutability-helper

### redux API
    combineReducers：

    Store：
        维持应用的state
        提供getState方法获取state
        提供dispatch方法更新state
        通过subscribe方法注册监听器
        通过subscribe方法返回的函数注销监听器
    createStore：
        第二个参数可选，初始化state的值
        createStore(reducers, {},)
    applyMiddleware：
    bindActionCreators
    compose

### redux的设计模式-发布订阅

### 中间件的洋葱模型
    为什么需要中间件；
    中间件的实现；

### 常用中间件
[Redux-thunk](https://github.com/reduxjs/redux-thunk)：

[redux-saga](https://github.com/LogRocket/redux-logger)：

[redux-promise](https://github.com/redux-utilities/redux-promise)：

[redux-logger](https://github.com/LogRocket/redux-logger):
### 与redux的store有关的扩展
    redux是产生新的state
    那么记录旧的state可以做时光机返回功能；
[redux-undo](https://github.com/omnidan/redux-undo)
### react-redux
    Provider
    connect()

### 其他状态管理的库
    mobx
