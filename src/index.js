/*
let {render, h, removeRender} = require('./utils/render');

const rd = (
    <div onClick={() => {console.log(11)}} className={'one'}>
        <div>
            Lorem ipsum dolor.
        </div>
        <div>
            789
        </div>
    </div>
);

const rn = (
    <div className={'123'}>
        123
    </div>
);


rd.children.push(rn);

let a = {
    "type":"div",
    "props":{"className":"one"},
    "children":[
        {
            "type":"div","props":{},"children":["Lorem ipsum dolor."]
        },
        {
            "type":"div","props":{},"children":["3"]
        },
        {
            "type":"div","props":{"className":"123"},"children":["123"]
        }
    ]
};

render({
    dom : document.getElementById('app'),
    'renderID' : 'test_diff_div_app',
    view : rd
});

setTimeout(() => {
    render({
        dom : document.getElementById('app'),
        'renderID' : 'test_diff_div_app',
        view : a
    });
}, 5000);

module.exports = {
    render
};

*/

import DiyReact, {render, Component, createElement} from './utils/demo';


class Demo extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>
                Lorem ipsum dolor.
            </div>
        )
    }
}

export default class Test extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '789',
            isShow : true
        };
    }

    componentWillMount() {
        console.log('execute componentWillMount');

    }

    componentDidMount() {
        console.log('execute componentDidMount');
        setTimeout(() => {
            this.setState({
                isShow : false
            })
        }, 5000)
    }

    componentWillUnmount() {
        console.log('execute componentWillUnmount');
    }

    handle_click = () => {
        this.setState({
            name: '123'
        })
    };

    render(){
        let {name} = this.state;
        return (
            <div onClick={this.handle_click}>
                {name}
                <Demo/>
            </div>
        )
    }
}
render(<Test />, document.getElementById("app"));
