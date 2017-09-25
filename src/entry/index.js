let mv = function(options) {
    return mv.prototype.init(options);
}
mv.prototype = {
    init: function(options) {
        // this.el = options.el;
        this.el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.data = options.data;
        this.methods = options.methods;
        this.iteratorNodes();
        return options;
    },
    iteratorNodes: function(node) {
        node = node || this.el;
        Array.from(node.childNodes).forEach((v, i) => {
            this.nodeType( v );
            if( v.childNodes.length >= 0 ) this.iteratorNodes( v );
        });
    },
    nodeType: function(node) {
        if (node.nodeType === 1) { // 元素节点
            this.simpleDirective(node);
            this.removeDomDirective(node);
        }
        if (node.nodeType === 3) { // Element或者Attr中实际的文字
            this.mustache( node );
        }
    },
    /**
     * 处理简单指令
     */
    simpleDirective: function(node) {
       const arrtsMap = {
            text: 'textDirective',
            html: 'htmlDirective',
            show: 'showDirective',
            if: 'ifDirective',
            model: 'modelDirective'
        };

        Object.keys(arrtsMap).forEach((item, index) => {
            let attr = node.hasAttribute('v-' + item) ? 'v-' + item : '';
            if (attr.length === 0 ) return;
            this.simpleDomDirective[arrtsMap[item]].call(this, node, node.getAttribute(attr), this.getAttribute(node, item, attr), attr )
        })
    },
    simpleDomDirective: {
        'textDirective': function(node, prop, value, attr) {
            node.textContent = value;
            this.coupling(prop, node);
        },
        'htmlDirective': function(node, prop, value) {
            node.innerHTML = value;
            // this.coupling(prop, node);
        },
        'showDirective': function(node, prop, value) {
            // node.style.display = value === 'true' ? 'block' : 'none';
            node.style.display = value === 'false' || !value ? 'none' : '';
            this.coupling(prop, node);
        },
        'ifDirective': function(node, prop, value) {
            if (value === 'false' || !value) node.parentNode.removeChild(node);
            this.coupling(prop, node);
        },
        'modelDirective': function(node, prop, value) {
            const tagName = node.tagName.toLowerCase();
            if (!['input', 'textarea', 'select'].includes(tagName)) return;
            node.value = value;
            this.coupling(prop, node);
            let callback = function( node, prop ){ 
                this.data[prop] = node.value; 
            };
            node.addEventListener('input', callback.bind( this, node, prop ), false);
        }
    },
    getAttribute: function(node, attr) {
        attr = node.getAttribute('v-' + attr);
        return this.data[attr];
    },
    monitorBindingData: function( data, prop, value ){  
        let initializtion = value;
        Object.defineProperty( data, prop, {
            get: function(){ 
                return initializtion; 
            },
            set: function( value ){ 
                initializtion = value;
                this.model2view(prop);
            }.bind(this)
        })
    },
    dep: {},
    /**
     * 记录属性与dom的对应关系，目的是在属性改变时及时更新dom的状态 例如：age: [input, text]
     */
    coupling: function(prop, node) {
        if (this.dep[prop] === undefined) {
            this.dep[prop] = [];
            this.monitorBindingData(this.data, prop, this.data[prop]);
        }
        this.dep[prop].push(node);
        console.log('this.dep:', this.dep);
        return this.dep;
    },
    /**
     * 数据改变及时更新dom
     */
    model2view: function(prop) {
        if (this.dep[prop] === undefined || this.dep[prop].length === 0) return;
        this.dep[prop].forEach((v, i) => {
            if (v.nodeType === 3) {
                let handleTextReg = /{{(.+?)}}/g;
                let replaceCallback = function(match, p1, offset, string) {
                    return this.data[p1];
                };
                // v.template  输入的年龄为：{{age}}
                v.textContent = v.template.replace(handleTextReg, replaceCallback.bind( this ));
            }
            if (v.nodeType === 1 && v.type !== undefined) {
                let nodeName = v.nodeName.toLowerCase();
                switch(nodeName) {
                    case 'input': 
                        v.value = this.data[prop];
                        break;
                    case 'span':
                        v.textContent= this.data[prop];
                        break;
                    case 'li':
                         v.style.display = this.data[prop] === 'false' || !this.data[prop] ? 'none' : ''
                }
            }
        })
    },
    /**
     * 处理文本节点的语法问题
     */
    mustache: function(node, data) {
        let handleTextReg = /{{(.+?)}}/g;
        let replaceCallback = function(match, p1, offset, string) {
            return this.data[p1];
        };
        // 筛选出带有{{}}的内容，并将其保存到dep的template属性中。 
        if( handleTextReg.test( node.textContent ) === false ) return; 
        node.template = node.textContent; // 保留原始的 dom 模板
        this.coupling( node.textContent.split(/{{(.+?)}}/g)[1], node ); // 给dep添加了个template属性，用来保留原始的 dom 模板
        // if( handleTextReg.test( node.textContent ) === false ) return; 顺序不对 
        node.textContent = node.textContent.replace(handleTextReg, replaceCallback.bind( this ));
    },
    /**
     *  
     */
    removeDomDirective: function(node) {
         var attributes = Array.from(node.attributes), directives = ['text', 'html', 'show', 'if', 'model', 'on', 'bind'];
        attributes.forEach(function(v, i){
            if( v.name.startsWith( 'v-' ) && directives.includes( v.name.split(/v-([^:]+)/g)[1] ) )
            node.removeAttribute( v.name );
        });
    }

}

export default mv;