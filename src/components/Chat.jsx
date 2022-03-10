import React, { Component } from "react";
import { sha512 } from "crypto-hash";
const aws_access = require("../secrets.json");
const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-2",
  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: aws_access.access_key,
  secretAccessKey: aws_access.secret_key,
});
const db = new aws.DynamoDB.DocumentClient();
const message_table = "dechat.eth";
// 0x4a9cD320e8a1EEa8fD39748a10833555CB9bafD9

export default class Chat extends Component {
  componentDidMount() {
    if (this.initRoom()) {
      this.get_messages();
      ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
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
        name: "",
        message: "",
      },
      messages: [],
      username: null,
      room: null,
      accounts: null,
      connected: null,
    };
  }

  async initRoom() {
    let contract = this.props.contract;
    let accounts = await this.getAccounts();
    let room = localStorage.getItem("room");
    if (web3.utils.isAddress(room)) {
      let roomID = await contract.methods
        .checkRoom(web3.utils.toHex(room))
        .call({ from: accounts[0] });
      if (roomID) {
        this.state.room = room;
        return roomID;
      }
    }
  }

  async getAccounts() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length != 0) {
      this.setState({
        accounts: accounts,
        connected: true,
      });
      console.log("connected!");
      this.get_username(accounts[0]);
    }
    return accounts;
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

  async get_messages() {
    try {
      const params = {
        TableName: message_table,
        FilterExpression: "room = :room",
        ExpressionAttributeValues: {
          ":room": localStorage.getItem("room"),
        },
      };
      let allMessages = await db.scan(params).promise();
      this.setState({
        messages: allMessages.Items,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { formState, messages, accounts, connected, username } = this.state;
    const { contract } = this.props;
    async function set_username() {
      await contract.methods
        .createUser(formState.name)
        .send({ from: accounts[0] });
    }
    async function send_message() {
      let message = formState.message;
      let sender = accounts[0];
      let room = localStorage.getItem("room");
      let timestamp = Date.now();
      const message_to_send = {
        id: await sha512(message + sender + room + timestamp),
        message: message,
        sender: sender,
        username: username,
        room: room,
        timestamp: timestamp,
      };
      const params = {
        TableName: message_table,
        Item: message_to_send,
      };
      await db
        .put(params)
        .promise()
        .then(
          () => {
            console.log("message sent");
            window.location.reload();
          },
          (error) => {
            console.error("Oh no.", error);
          }
        );
    }
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <a href="/">
          <img src="./Dechat-eth.png" style={{ width: "20rem" }}></img>
        </a>
        <h2>User Settings</h2>
        <h4>User Address: {accounts}</h4>
        {username != null ? <h4>Username: {username}</h4> : ""}
        <input
          onChange={(e) =>
            this.setState({ formState: { ...formState, name: e.target.value } })
          }
          placeholder="Username"
          name="name"
          value={formState.name}
        />
        <button onClick={set_username}>Set Username</button>
        <br></br>
        <br></br>
        <hr></hr>
        <h2>Room</h2>
        <h4>{localStorage.getItem("room")}</h4>
        <input
          onChange={(e) =>
            this.setState({
              formState: { ...formState, message: e.target.value },
            })
          }
          placeholder="Message"
          name="message"
          value={formState.message}
        />
        <button onClick={send_message}>Send Message</button>
        {messages.map((message) => (
          <div key={message.id}>
            <h2>{message.message}</h2>
            <h3>
              From:{" "}
              {message.username != null ? message.username : message.sender}
            </h3>
            <p>
              Date: {new Date(message.timestamp).toLocaleDateString()}{" "}
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
}