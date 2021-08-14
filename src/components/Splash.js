import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './Splash.css';

var client = new WebSocket('ws://localhost:4040')
class Splash extends React.Component {

    constructor(props) {
        super(props);
        this.state={"teams": []};
    }
    messageHandler = (event) => {
        let message = JSON.parse(event.data);
        if (message.type === 'handshake') {
            console.log(message);
            let teams = message.message;
            console.log(teams);
            this.setState({"teams": teams});
        }
    }
    componentDidMount() {
        client.addEventListener("open", () => {console.log("Open WS")});
        client.addEventListener('message', (this.messageHandler));
    }
    submit = (event) => {
        event.preventDefault();
        localStorage.setItem('name', this.state.name);
        localStorage.setItem('team', this.state.team);
        <Link to='/tasks'>Go Back</Link>
    }
    setName = (event) => {
        this.setState({"name": event.target.value});
    }
    setTeam = (event) => {
        this.setState({"team": event.target.value});
    }
    render() {
        return (
        <div className="Background">
            <form className="Login" onSubmit={this.submit}>
                <img src="https://uorocketry.ca/images/icon.png" className="logo" alt="logo" />
                <p>Name</p>
                <input className="nameField" onChange={this.setName}/>
                <p>Role</p>
                <select className="roleList" onChange={this.setTeam}>{this.state.teams.map((team) => <option>{team}</option>)}
                </select>
                <div className="break"/>
                <button className="loginButton" type="submit">Login</button>
            </form>
        </div>
        );
    }
}
export default Splash;