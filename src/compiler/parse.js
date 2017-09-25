/**
 * 枚举所有的node
 * @param {String} node [模板字符串]
 */

function iteratorNodes(node) {
    let node = node || this.el;
    Array.from(node.childNodes).forEach(function(v, i){
        this.nodeType( v );
        if( v.childNodes.length >= 0 ) this.iteratorNodes( v );
    }, this);
} 

/** 
 * 处理文本节点的引号
 * @param {String} node [模板字符串]
 * @param {String} data []
 */
function mustache(node, data) {

}

const simpleDomDirective = {
    'textDirective': function(node, prop, value) {
        node.textContent = value;
    },
    'htmlDirective': function(node, prop, value) {
        node.innerHTML = value;
    },
    'showDirective': function(node, prop, value) {
        // node.style.display = value === 'true' ? 'block' : 'none';
        node.style.display = value === 'false' ? 'none' : '';
    },
    'ifDirective': (node, prop, value) => {
        if (value === 'false') node.parentNode.removeChild(node);
    },
    'modelDirective': (node, prop, value) => {
        const tagName = node.tagName.toLowerCase();
        if (!['input', 'textarea', 'select'].includes(tagName)) return;
        node.value = value;
    }
}

function getAttribute(node, attr, data) {
    const attr = node.getAttribute('v-' + attr);
    return data[attr];
}

/**
 * 处理简单指令，像v-text、v-html、v-show、v-if、v-model v-for
 * @param {String} node []
 */
function simpleDirective(node) {
    const arrtsMap = {
        text: 'textDirective',
        html: 'htmlDirective',
        show: 'showDirective',
        if: 'ifDirective',
        model: 'modelDirective'
    };

    Object.keys(arrtsMap).forEach((item, index) => {
        const attr = node.hasAttribute('v-' + item) ? 'v-' + item : '';
        if (attr.length === 0 ) return;
        simpleDomDirective[arrtsMap[item]](node, node.getAttribute(attr), getAttribute(node, item) )
    })
}

/**
 * 处理复杂指令，像v-bind:xxx="xxx"、v-on:xxx="xxx"
 * @param {*} node 
 * @param {*} data 
 * @param {*} methods 
 */
function complexDirective(node, data, methods) {
    
}
