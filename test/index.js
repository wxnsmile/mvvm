console.log('start');
import observer from '../src/observer/index.js';
import Watch from '../src/observer/watcher.js';

let data = {
    a: 1,
    b: {
        c: 2
    }
}

observer(data);

new Watch('a', () => {
    alert(9)
})
new Watch('a', () => {
    alert(90)
})
new Watch('b.c', () => {
    alert(80)
})
console.log('end');