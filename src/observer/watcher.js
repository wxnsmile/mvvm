// /**
//  * 监听简单数据的变化
//  * @param {*} data 
//  * @param {*} prop 
//  * @param {*} value 
//  */
// function monitorBindingData(data, prop, value) {
//     let initializtion = value;
//     Object.defineProperty(data, prop, {
//         get: () => {
//             return initializtion;
//         },
//         set: (value) => {
//             initializtion = value;
//         }
//     })
// }

// /**
//  * 监听数组的变化
//  * @param {*} array 
//  * @param {*} callback 
//  */
// function observeArray(array, callback) {
//     const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

// }

// 不足点：只做了直接子属性的求值
// 没有处理对数组的观测

import { pushTarget } from './dep';
export default class Watch {
    constructor(exp, fn) {
        this.exp = exp;
        this.fn = fn;
        pushTarget(this);
        // data[exp]; // 将watch和observe连接起来
    }
}
