### 状态管理框架：Redux
#### 是什么
基于flux的状态管理框架
创建了全局唯一的数据管理树：store，组件的所有数据都可以添加到store上，并在父子组件进行通讯的时候直接从store上读取

#### 特性：
    1、唯一状态来源、所有数据都来源于store
    2、可预测性： state+action = new state
    3、纯函数更新： Store

#### Store
    1、getState()
    2、dispatch(action)
    3、subscribe（listener）
### Reducer
    更新数据方法
#### Action


### 实际使用场景、
    1、combineReducers： 将多个reducer封装成同一个reducer

    2、bindActionCreators：

### react中使用reducer

使用connect绑定stroe、action到当前组件

    function mapStateToprops(store) {
        return {
            data1 :state.data1
        }
    }
为了组件性能，只将本身需要的数据绑定过来；将数据绑定到当前组件


    function mapDispatchToProps（dispatch）{
        return bindActionCreators(
            {},dispatch)
    }
    connect(mapStateToprops, mapDispatchToProps, commoonent)


#### 异步action 与redux中间件

action的dispatch结果要通过中间件判断执行结果，根据执行结果来判断修改对应的reducer 
    redux中间件
        1、截获action
        2、发出action

#### react中组织action与reducer
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
    