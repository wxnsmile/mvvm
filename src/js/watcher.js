import { Dep } from './observer';
/**
 * 订阅者，作为Observer和Compiler之间通信的桥梁
 */
export default function Watch(vm, prop, callbackFuntion) {
    this.depIds = {};
    this.vm = vm;
    this.callbackFuntion = callbackFuntion;
    this.prop = prop;
    if (typeof prop === 'function') {
        this.getter = prop;
    } else {
        this.getter = this.parseGetter(prop);
    }

    this.value = this.get();
};

Watch.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        let value = this.get();
        let oldValue = this.value;
        if (value !== oldValue) {
            this.value = value;
            this.callbackFuntion(value, oldValue);
        }
    },
    addDep: function(dep) {
         dep.addWatcher(this);
        //  this.depIds[dep.id] = dep;
    },
    get: function() {
        Dep.target = this;
        let value = this.getter(this.vm.data);
        Dep.target = null;
        let oldValue = this.value;
        this.callbackFuntion(value, oldValue);
        return value;
    },
    // 根据prop得到对应的值
    parseGetter: function(exp) {
        // if (/[^\w.$]/.test(exp)) return; 

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];  // 这里会调用observe中的get方法
            }
            return obj;
        }
    }

}