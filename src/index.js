import {Component, _render} from './utils/react/react';

const typeA = <div>qqqqqqqq</div>;

function dataRn(name) {
    return (
        <div>{name} --!</div>
    )
}


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name : {
                a : '张三',
                b : '999'
            },
            a : '888'
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                name : {
                    a : '123'
                }
            });
        }, 5000);
    }

    handle_click = () => {
        console.log(123)
    };

    handle_change = (e) => {
        console.log(e)
    };

    render() {
        let {name} = this.state;
        return(
            <div onClick={this.handle_click}>
                <div>
                    {name.a}
                </div>
                <div>
                    Lorem ipsum dolor.
                    <h2>666666</h2>
                </div>
                {typeA}
                {
                    dataRn(name.a)
                }
                <input type="text" onBlur={this.handle_change}/>
            </div>
        )
    }
}

_render(<App/>, document.getElementById('app'));

