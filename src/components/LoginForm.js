import React, {Component} from 'react';
import Events from "../Events";

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            error: ''
        };
    }

    setUser = ({user, isUser}) => {
        console.log(user, isUser);
        if (isUser) {
            this.setError('Username is already in use')
        } else {
            this.props.setUser(user);
            this.setError('')
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const {socket} = this.props;
        const {nickname} = this.state;
        socket.emit(Events.VERIFY_USER, nickname, this.setUser)
    };

    handleChange = (event) => {
        this.setState({nickname: event.target.value});
    };


    setError = (error) => {
        this.setState({error})
    };

    render() {
        const {nickname, error} = this.state;
        return (
            <div className='login'>
                <form onSubmit={this.handleSubmit} className='login-form'>
                    <label htmlFor='nickname'>
                        <h2>Enter your nickname</h2>
                    </label>
                    <input
                        ref={(input) => {
                            this.textInput = input
                        }}
                        type="text"
                        id='nickname'
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'MyUserName'}
                    />
                    <div className='error'>{error ? error : null}</div>

                </form>
            </div>
        );
    }
}

export default LoginForm;