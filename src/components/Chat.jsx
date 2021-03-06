import React, { Component } from "react";
import { sha512 } from "crypto-hash";
import ChatMessage from "./ChatMessage";

const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-2",
  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
});
const db = new aws.DynamoDB.DocumentClient();
const message_table = "dechat.eth";

export default class Chat extends Component {
  componentDidMount() {
    if (this.initRoom()) {
      this.loadMessage();
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
      bottom: React.createRef(),
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
    } else {
      window.location.replace("/");
      localStorage.clear();
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
      this.getUsername(accounts[0]);
    }
    return accounts;
  }

  async getUsername(account) {
    const username = await this.props.contract.methods
      .getUsername(account)
      .call({ from: account });
    if (username != "") {
      this.setState({
        username: username,
      });
    }
  }

  async loadMessage() {
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
        messages: allMessages.Items.sort((a, b) => a.timestamp - b.timestamp),
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { formState, messages, accounts, username, bottom } = this.state;
    async function sendMessage() {
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
            console.error("send message failed", error);
          }
        );
    }
    bottom.current?.scrollIntoView({ behavior: "smooth" });
    return (
      <div className="App">
        <main>
          <div className="container card">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                username={username}
              />
            ))}
          </div>
          <span ref={bottom} />
        </main>
        <div className="input-group fixed-bottom w-auto m-lg-3">
          <input
            onChange={(e) =>
              this.setState({
                formState: { ...formState, message: e.target.value },
              })
            }
            placeholder="Type a message..."
            className="form-control"
            name="message"
            value={formState.message}
            maxLength="100"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            className="btn btn-primary"
            disabled={formState.message === ""}
            onClick={sendMessage}
          >
            Send
          </button>{" "}
        </div>
      </div>
    );
  }
}
