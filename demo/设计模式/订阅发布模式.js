// 调度中心
let eventEmitter = {};

// 订阅列表
eventEmitter.list = {};


// 订阅者
eventEmitter.on = function (Event, fn) {
    let _this = this;
    // 未订阅过的事件，创建订阅
    !_this.list[Event]? _this.list[Event]= [] : null;
    // 已经创建过相关事件的时候就把新的事件添加到订阅列表中
    (_this.list[Event] || (_this.list[Event] === [])).push(fn);
}

// 发布者
eventEmitter.emit = function () {
    let _this = this;
    let event = [].shift.call(arguments);
    let fns = [..._this.list[event]];

    if (!fns || fns.length === 0) {
        return false;
    }

    fns.forEach(fn  => {
        console.log(fn);
        fn.apply(_this,arguments)
    });
    return _this;
}

// 取消订阅
eventEmitter.off = function (event, fn) {
    let _this = this;
    let fns = _this.list[event];
    if (!fns) return false;

    // 当没有传入fn的时候就把所有订阅都给清空了
    if (!fn) {
        fns && (fns.length = 0);
    }
    else {
        let callback;
        // 将订阅列表中与当前方法相同的移除
        for (let i = 0; i < fns.length; i++) {
            callback = fns[i];
            if (callback === fn || callback.fn === fn) {
                fns.splice(i,1);
                break;
            }
        }
    }
}

// 只订阅一次；即在事件派发的时候立即执行，然后执行取消订阅处理
eventEmitter.once = function (event, fn) {
    let _this = this;
    function on () {
        _this.off(event, on);
        fn.apply(_this, arguments);
    }
    on.fn = fn;
    _this.on(event, on);
    return _this;
}


function user1 (content) {
    console.log('用户1订阅了:', content);
};

function user2 (content) {
    console.log('用户2订阅了:', content);
};

// 订阅
eventEmitter.on('article', user1);
eventEmitter.once('article', user2);

// 发布
eventEmitter.emit('article', 'Javascript 发布-订阅模式');
eventEmitter.emit('article', 'Javascript2 发布-订阅模式');
