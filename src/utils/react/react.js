const {Render} = require('../render/render');

class Component {
    constructor(props) {
        this.props = null;
        this.state = null;
    }

    // 还未执行 render 时调用 只执行一次 在 实例constructor后
    componentWillMount () {}

    // 执行完第一次 render 后调用 只执行一次
    componentDidMount () {}

    // 监听 props 或 state 将要更新前执行  会执行多次
    componentWillUpdate (props, state) {}

    // 监听 props 或者 state 已经更新完 render 后执行 会执行多次
    componentDidUpdate () {}

    setState = (next, callback) => {
        if(!next || next.toString.call(next) !== '[object Object]'){
            console.error('setState next参数必须是一个 object 类型！');
        }
        // 合并开始
        let state = this.state || {};
        let compat = Object.assign({}, state, next); // 深拷贝
        // 合并结束 更新开始

        // 发送 WillUpdate 更新前的信息
        this.componentWillUpdate(this.props, compat);
        // 更新 start
        return new Promise((resolve) => {
            resolve(compat)
        }).then(res => {
            this.state = res;
            // 更新 render
            Component.render(this.render(), this.parent);
            // 返回 更新后的回调函数
            if(callback){
                callback(res);
            }
            // 完成更新后回调
            this.componentDidUpdate()
        });
    };

    static render(vDom, parent = null) {
        const props = Object.assign({}, vDom.props, { children: vDom.children });
        // 判断这个组件是函数组件还是类组件
        if (Object.prototype.isPrototypeOf.call(Component, vDom.type)) {
            const instance = new (vDom.type)(props);
            // 加载前 调用 WillMount 周期
            instance.componentWillMount();

            // 调用 DidMount 周期
            instance.componentDidMount();

            // 存储 parent 信息
            instance.parent = parent;

            // 完成第一次渲染
            Render.render({ dom : parent, view : instance.render() });
            return;
        }
        // 完成 通过 state 更新的 render
        Render.render({ dom : parent, view : vDom })
    }
}

const _render = (vDom, parent = null) => {
    if (typeof vDom === 'object' && typeof vDom.type === 'function') {
        return Component.render(vDom, parent);
    }
};

module.exports = {
    //Render,
    Component,
    _render
};
