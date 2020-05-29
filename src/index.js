import LikeReact, { render, Component } from './utils/likeReact';

export default class DemoIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '123',
            className : {
                className : '123'
            }
        };
    }

    componentDidMount() {
        console.log(this.demoDom)
        setTimeout(() => {
            this.setState({
                className : {}
            })
        }, 10000);
    }

    render(){
        let {name, className} = this.state;
        return (
            <div {...className} ref={dom => this.demoDom = dom}>{name}</div>
        )
    }
}


render(<DemoIndex/>, document.getElementById('app'));
