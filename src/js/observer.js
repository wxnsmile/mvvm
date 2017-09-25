/**
 * 劫持监听所有的data属性
 * @param {Object} data 
 */
export default function Observer(data) {
    Object.keys(data).forEach((prop, index) => {
        defineReactive(data, prop, data[prop]);
    })
}
/**
 * 
 * @param {*} prop 
 * @param {*} value 
 */
function defineReactive(data, prop, value) {
    let dep = new Dep();
    Object.defineProperty(data, prop, {
        get: function() {
            if (Dep.target) {
                dep.depend();
            }
            return value;
        },
        set: function(newValue) {
            if (value === newValue) return;
            value = newValue;
            dep.notify(); // 通知所有订阅者  发布消息
        }
    })
}

/**
 * 属性订阅器，缓存订阅信息的列表
 */
export function Dep() {
    this.watchers = []; // 
}
Dep.prototype = {
    addWatcher: function(watcher) {
       this.watchers.push(watcher);
    },
    depend: function() {
        Dep.target.addDep(this);
    },
    notify: function() {
        this.watchers.forEach((watcher) => {
            watcher.update();
        });
    },
    remove: function(watcher) {

    }
}
Dep.target = null;
// Dap.addWatcher(new Watch()); // 订阅信息  

