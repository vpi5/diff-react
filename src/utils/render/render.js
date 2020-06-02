const {
    CREATE, // 新建一个节点,
    REMOVE,  // 删除原节点
    REPLACE,  // 替换原节点
    REMOVE_PROP, // 删除属性
    SET_PROP, // 新增或替换属性
    UPDATE, // 检查属性或子节点是否有变化
} = require('./ut');


class Render {
    constructor(props) {
        this.config = {
            view : null
        };
    }

    render = ({ view, dom }) => {
        if(!this.config['view']){
            // 创建
            dom.appendChild(Render.prototype.createElement(view));
        }
        if(this.config['view']){
            // 更新  ==> dom元素 newView新的 oldView 旧的
            Render.prototype.up_render({dom, newView : view, oldView : this.config['view']});
        }
        this.config['view'] = JSON.parse(JSON.stringify(view));
    };

    removeRender = ({dom}) => {
        // 移除 全部元素
        if(this.config['view'] && dom){
            dom.innerHTML = '';
            this.config['view'] = null;
        }
    };

    h = (type, props, ...children) => {
        return {
            type,
            props: props || {},
            children: Render.prototype.flatten(children)
        };
    }

}

Render.prototype.createElement = function (node){
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    let { type, props, children } = node;
    const el = document.createElement(type);
    Render.prototype.setProps(el, props);
    children.map(Render.prototype.createElement).forEach(el.appendChild.bind(el));

    return el;
};

Render.prototype.setProps = function (target, props) {
    if(!props){
        return;
    }
    Object.keys(props).forEach(key => {
        Render.prototype.setProp(target, key, props[key]);
    });
};

Render.prototype.setProp = function (dom, attr, value) {
    if (attr === 'className') {
        return dom.setAttribute('class', value);
    }
    // 处理事件
    if (/on\w+/.test(attr)) {
        attr = attr.toLowerCase();
        dom[attr] = value || ""
    } else if (attr === "style" && value) {
        // 处理 style 样式，可以是个字符串或者对象
        if (typeof value === "string") {
            dom.style.cssText = value
        } else if (typeof value === "object") {
            for (let styleName in value) {
                dom.style[styleName] =
                    typeof value[styleName] === "number"
                        ? value[styleName] + "px"
                        : value[styleName]
            }
        }
    } else {
        // 其他属性
        dom.setAttribute(attr, value)
    }
};

Render.prototype.h = function (type, props, ...children) {
    return {
        type,
        props: props || {},
        children: Render.prototype.flatten(children)
    };
};

Render.prototype.flatten = function (arr) {
    return [].concat(...arr);
};

Render.prototype.diff = function (newNode, oldNode) {
    if (!oldNode) {
        return { type: CREATE, newNode };
    }

    if (!newNode) {
        return { type: REMOVE };
    }

    if (Render.prototype.changed(newNode, oldNode)) {
        return { type: REPLACE, newNode };
    }

    // 判断新节点是否是VDOM（根据type是否存在来判断的，因为type不存在的话，newNode要么是空节点，要么是字符串）。
    // 假如新节点是VDOM，则返回一个patches对象，类型是UPDATE，同时对props和children分别进行diffProps和diffChildren操作。
    if (newNode.type) {
        return {
            type: UPDATE,
            props: Render.prototype.diffProps(newNode, oldNode),
            children: Render.prototype.diffChildren(newNode, oldNode)
        };
    }
};

Render.prototype.diffProps = function (newNode, oldNode) {
    let patches = [];

    let props = Object.assign({}, newNode.props, oldNode.props);
    Object.keys(props).forEach(key => {
        const newVal = newNode.props[key];
        const oldVal = oldNode.props[key];
        // 假如新值不存在，表示这个属性被删除了
        if (!newVal) {
            patches.push({ type: REMOVE_PROP, key, value: oldVal });
        }

        // 假如旧值不存在，或者新旧值不同，则表示我们需要重新设置这个属性
        if (!oldVal || newVal !== oldVal) {
            patches.push({ type: SET_PROP, key, value: newVal });
        }
    });

    return patches;
};

Render.prototype.diffChildren = function (newNode, oldNode) {
    let patches = [];

    const maxLen = Math.max(newNode.children.length, oldNode.children.length);

    for (let i = 0; i < maxLen; i++) {
        patches[i] = Render.prototype.diff(newNode.children[i], oldNode.children[i]);
    }

    return patches;
};

Render.prototype.changed = function (node1, node2) {
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
};

Render.prototype.patch = function (parent, patches, index = 0) {
    if (!patches) return;

    const el = parent.childNodes[index];
    switch (patches.type) {
        case CREATE: {
            const { newNode } = patches;
            const newEl = Render.prototype.createElement(newNode);
            parent.appendChild(newEl);
            break;
        }
        case REMOVE: {
            parent.removeChild(el);
            break;
        }
        case REPLACE: {
            const { newNode } = patches;
            const newEl = Render.prototype.createElement(newNode);
            return parent.replaceChild(newEl, el);
        }
        case UPDATE: {
            const { props, children } = patches;
            Render.prototype.patchProps(el, props);
            for (let i = 0; i < children.length; i++) {
                Render.prototype.patch(el, children[i], i);
            }
        }
    }
};

Render.prototype.patchProps = function (parent, patches) {
    patches.forEach(patch => {
        const { type, key, value } = patch;
        if (type === 'SET_PROP') {
            if(value){
                Render.prototype.setProp(parent, key, value);
            }
        }
        if (type === 'REMOVE_PROP') {
            Render.prototype.removeProp(parent, key);
        }
    });
};

Render.prototype.removeProp = function (target, name) {
    console.log(name, 'removeProp')
    if (name === 'className') {
        return target.removeAttribute('class');
    }

    target.removeAttribute(name);
};

Render.prototype.up_render = function ({dom, newView, oldView}) {
    const patches = Render.prototype.diff(newView, oldView);
    Render.prototype.patch(dom, patches);
};

module.exports = {
    Render : new Render()
};
