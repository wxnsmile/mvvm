import Watcher from './watcher.js';
 
// 
export default function Compile (el, vm) {
    this.$vm = vm;  // mvvm
    this.$el = (typeof el === 'string') ? document.querySelector(el) : el;
    if (this.$el) {
        this.init();
    }
}
Compile.prototype = {
    init: function() {
        this.compile(this.$el);
    },
    /**
     * 编译节点
     */
    compile: function(el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach((node) => {
            let reg = /\{\{(.*)\}\}/;
            let text = node.textContent;
            if (node.nodeType === 1) { // Element
                this.compileElement(node);
            }
            if (node.nodeType === 3 && reg.test(text)) { // Text
                this.compileText(node, RegExp.$1);
            }
            if (node.hasChildNodes()) {
                this.compile(node);
            }

        }) 
    },
    /**
     * 编译Element元素节点
     */
    compileElement: function(node) {
        let nodeAttrs = node.attributes; // 获取节点的属性集合
        Array.from(nodeAttrs).forEach((attr) => {
            if (attr.name.indexOf('v-') === 0) { // 是指令
                // 
                let name = attr.name; // 指令表达式
                let prop = attr.value; // 指令表达式的值
                let directive = name.substring(2);  // 具体的指令
                if (directive.indexOf('on') === 0 || directive.indexOf('bind') === 0) {
                    // 事件指令
                    let eventName = directive.split(':')[1],
                        fn = this.$vm.methods && this.$vm.methods[prop];
                    compileUtil.eventHandler(node, this.$vm, prop, directive);
                    // node.addEventListener(eventName, fn, false);
                } else {
                    // 普通指令
                    // updater[attrsMap[directive]](node, name, this.$vm.data[prop]);
                    compileUtil[directive] && compileUtil[directive](node, this.$vm, prop);
                }
            }
        })
        

    },
    /**
     * 编译Text文本节点
     */
    compileText: function(node, exp) {
        compileUtil.text(node, this.$vm, exp);
        // let regexp = /{{(.+?)}}/g;
        // let textContent = node.textContent;
        // node.textContent = textContent.replace(regexp, (match, p1, offset, string) => {
        //     return this.$vm.data[p1];
        // })
    }

}
let compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    if: function(node, vm, exp) {
        this.bind(node, vm, exp, 'if');
    },

    show: function(node, vm, exp) {
        this.bind(node, vm, exp, 'show');
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    bind: function(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        }); 
    },
     // 事件处理
    eventHandler: function(node, vm, exp, dir) {
        let eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function(vm, exp) {
        let val = vm.data;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm.data;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }

}

let updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }, 
    ifUpdater: function(node, value) {
        node.style.display = value === false ? 'none' : '';
    },
    showUpdater: function(node, value) {
        node.style.display = value === false ? 'none' : ''
    }
};