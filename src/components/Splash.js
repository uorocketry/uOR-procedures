import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Splash.css';
class Splash extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            "teams": ["Unable to connect to Server"],
            "connected": false,
            "client": new WebSocket('ws://localhost:4040')
        };
        this.connect();
        this.keepalive();
    }
    
    connect(){
        console.log("attemtping connection");
        this.setState({"client": new WebSocket('ws://localhost:4040')});
    }
    keepalive(){
        setInterval(
            () => {
                console.log(window.performance.now());
                if (this.state.client.readyState == 0 || this.state.client.readyState == 1) {
                    console.log("WS State:" + this.state.client.readyState);
                }
                else {
                    console.log("WS State:" + this.state.client.readyState);
                    console.log("No Connection, retrying.");
                    this.connect();
                }
            }, 
            5000
          );
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
        this.state.client.addEventListener("open", () => {this.setState({"connected": true});});
        this.state.client.addEventListener("close", () => {this.setState({"connected": false});});
        this.state.client.addEventListener("error", () => {this.setState({"connected": false});});
        this.state.client.addEventListener('message', (this.messageHandler));
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
    render = () => {
        return (
        
        
        <div className="Background">
            <form className="Login" onSubmit={this.submit}>
                {this.state.client.readyState!=1 ? (<i className="fas fa-exclamation-circle"> Unable to Connnect to the Server!</i>) :(null)}
                <div className="break"/>
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