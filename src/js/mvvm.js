import Observer from './observer.js';
import Compile from './compile.js';

export default function MVVM (options){
    this.$options = options || {};
    return this.init(options);
}
MVVM.prototype = {
    init: function(options) {
        // this.el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.data = options.data;
        this.methods = options.methods;
        new Observer(options.data);
        new Compile(options.el, this);
    }
}
