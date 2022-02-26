import React, { Component } from 'react'
import Chat from './Chat'

export default class Login extends Component {
    componentDidMount() {
        this.getAccounts();
    }

    constructor(props) {
        super(props);
        this.state = {
            formState: {
                room: '',
            },
            accounts: null,
            connected: null
        };
    }

    async connect() {
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('accounts registered...')
          } catch (error) {
            console.error(error);
          }
        }
    }

    async getAccounts() {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length != 0) {
            this.setState({
                accounts: accounts,
                connected: true
            });
            console.log('connected!')
        }
    }
    

    render() {
        const { formState, accounts, connected} = this.state;
        const { contract } = this.props;
        async function joinRoom() {
            // 0x25EA4343d773Ef9442Fd62A98f25980E56FC9944
            window.location.replace(`/chat/${formState.room}`);
        }
        async function createRoom() {
            await contract.methods.createRoom().send({ from: accounts[0] });
            let roomID = await contract.methods.getRoom(accounts[0]).call({ from: accounts[0]});
            console.log(roomID);
            alert('Your Room ID: '+roomID+'\n\nPlease keep it safe and share this ID with your friends to join the room!');
        }
        if (connected == false) {
            return (
                <div style={{ padding: 30, textAlign: 'center'}}>
                    <h1>Login</h1>
                    <button onClick={this.connect.bind(this)}>CONNECT</button>
                </div>
            )
        }
        if (connected == true) {
            return (
            <div style={{ padding: 30, textAlign: 'center'}}>
                <img src='Dechat-eth.png' style={{ width: '20rem'}}></img>
                <br></br>
                <input
                onChange={e => this.setState({ formState: { ...formState, room: e.target.value } })}
                placeholder="Room ID"
                name="room"
                value={formState.room}
                />
                <button onClick={joinRoom}>Join</button>
                <br></br>
                <button onClick={createRoom}>Create Room</button>
            </div>
            )
        }  
        return null; 
    }
}