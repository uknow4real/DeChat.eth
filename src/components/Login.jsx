import React, { Component } from "react";
export default class Login extends Component {
  componentDidMount() {
    this.getAccounts();
  }

  componentWillUnmount() {
    this.state.formState = null;
    this.state.messages = null;
    ethereum.disconnect;
  }

  constructor(props) {
    super(props);
    this.state = {
      formState: {
        room: "",
      },
      accounts: null,
      username: null,
      connected: false,
    };
  }

  async connect() {
    if (window.ethereum && ethereum._state.isUnlocked) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("accounts registered...");
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getAccounts() {
    ethereum.on("accountsChanged", () => {
      this.connect();
    });
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length != 0) {
      this.setState({
        accounts: accounts,
        connected: true,
      });
      console.log("connected...");
      this.get_username(accounts[0]);
    }
  }

  async get_username(account) {
    const username = await this.props.contract.methods
      .getUsername(account)
      .call({ from: account });
    if (username != "") {
      this.setState({
        username: username,
      });
    }
  }

  render() {
    const { formState, accounts, connected, username } = this.state;
    const { contract } = this.props;
    async function set_username() {
      await contract.methods
        .createUser(formState.name)
        .send({ from: accounts[0] });
    }
    async function joinRoom() {
      if (web3.utils.isAddress(formState.room)) {
        let roomID = await contract.methods
          .checkRoom(web3.utils.toHex(formState.room))
          .call({ from: accounts[0] });
        if (roomID) {
          localStorage.setItem("room", formState.room);
          window.location.replace(`/chat`);
          return roomID;
        }
      }
      alert("Room does not exist");
    }
    async function createRoom() {
      await contract.methods.createRoom().send({ from: accounts[0] });
      let roomID = await contract.methods
        .getOwnRooms(accounts[0])
        .call({ from: accounts[0] });
      console.log(roomID[roomID.length - 1]);
      //document.getElementById('rooms').append(<p>{web3.utils.hexToAscii(roomID[roomID.length-1])}</p>);
      alert(
        "Your Room ID: " +
          roomID[roomID.length - 1] +
          "\n\nPlease keep it safe and share this ID with your friends to join the room!"
      );
    }
    if (!ethereum._state.isUnlocked) {
      return (
        <div>
          <h1 style={{ padding: 30, textAlign: "center" }}>
            Please login on Metamask!
          </h1>
          <h3 style={{ padding: 30, textAlign: "center" }}>
            Or install it to proceed :){" "}
          </h3>
        </div>
      );
    } else {
      if (connected == false) {
        return (
          <div style={{ padding: 30, textAlign: "center" }}>
            <h1></h1>
            <button
              className="btn btn-primary"
              onClick={this.connect.bind(this)}
            >
              CONNECT
            </button>
          </div>
        );
      }
      if (connected == true) {
        return (
          <div style={{ padding: 30, textAlign: "center" }}>
            <h2>User Settings</h2>
            <h4>User Address: {accounts[0]}</h4>
            {username != null ? <h4>Username: {username}</h4> : ""}
            <div className="input-group">
              <input
                onChange={(e) =>
                  this.setState({
                    formState: { ...formState, name: e.target.value },
                  })
                }
                placeholder="Username"
                className="form-control"
                name="name"
                value={formState.name}
              />
              <button className="btn btn-primary" onClick={set_username}>
                Set Username
              </button>
            </div>
            <div id="rooms"></div>
            <hr></hr>
            <button className="btn btn-primary" onClick={createRoom}>
              Create Room
            </button>
            <br></br>
            <br></br>
            <div className="input-group">
              <input
                onChange={(e) =>
                  this.setState({
                    formState: { ...formState, room: e.target.value },
                  })
                }
                placeholder="Room ID"
                className="form-control"
                name="room"
                value={formState.room}
              />
              <button className="btn btn-primary" onClick={joinRoom}>
                Join
              </button>
            </div>
          </div>
        );
      }
    }
    return null;
  }
}