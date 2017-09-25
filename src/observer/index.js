/**
 * 将数据对象data的属性转化为访问器属性
 */
import Dep from './dep';
class Observer {
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        let keys = Object.keys(data);
        // console.log('key: ', keys);
        for (let i = 0; i < keys.length; i++) {
            // defineReactive(data, keys[i], data[keys[i]]);
            monitorBindingData(data, keys[i], data[keys[i]]);
        }
    }
}

// observer 方法首先判断data是不是纯JavaScript对象，如果是，调用 Observer 类进行观测
export default function observer(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
        return
    }
    new Observer(data);
}

// function defineReactive(data, key, val) {
//     // 递归观测子属性
//     // console.log('data:', data, 'key:',key, 'val:', val);
//     observer(val);
//     let dep = new Dep(); 
//     Object.defineProperty(data, key, {
//         enumerable: true,
//         configurable: true,
//         get: function() {
//             dep.addSub();
//             console.log('get data:', val);
//             return val;
//         },
//         set: function(newVal) {
//             if (val === newVal) {
//                 return;
//             } else {
//                 console.log('set data:', newVal);
//                 observer(newVal); 
//                 dep.notify();

//             }
//         }
//     }) 
// } 

function monitorBindingData( data, prop, value ){  
  var initializtion = value;
  Object.defineProperty( data, prop, {
    get: function(){ return initializtion; },
    set: function( value ){ 
      initializtion = value; 
    }
  });
}
