// 需要一个标记，用来标记属性与dom的对应关系，方便数据改变时，修改页面的状态
// data 下的每一个属性都有一个唯一的 Dep 对象，在 get 中收集仅针对该属性的依赖，然后在 set 方法中触发所有收集的依赖，这样就搞定了，看如下代码：

export default class Dep {
    constructor() {
        this.subs = [];
    }
    addSub() {
        this.subs.push(Dep.target);
    }
    notify() {
        console.log('notify', this.subs.length);
        for(let i = 0; i < this.subs.length; i++){
            this.subs[i].fn();
        }
    }
}
Dep.target = null;
export function pushTarget(watch) {
    Dep.target = watch;
    // console.log('dep', Dep.target);
}

