// import mv from './entry/index.js'
import mv from './js/mvvm.js';

let vm = new mv({
    el: '#app',
    data: {
        name: 'wxn',
        age: 18,
        stature: 180,
        html: '<div style="display: inline-block;vertical-align: middle;border: 1px dotted #ccc;color: red;"><b>HTML 片段</b></div>',
        style: 'color: red;',
        password: 123456,
        isShow: false,
        isHide: false
    },
    computed: {
        getHelloWord: function() {
            return 'computed';
        }
    },
    methods: {
        clickBtn: function(e) {
            alert(1);
        }
    }
});
// console.log("daata", vm); // vm指向mv中的this
vm.data.stature = '190';
vm.data.isShow = true;
vm.data.isHide = true;