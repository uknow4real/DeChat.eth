import React, { Component } from 'react'
import { sha512 } from 'crypto-hash';
const aws_access = require('../secrets.json');
const aws = require('aws-sdk');
aws.config.update({
    region: 'us-east-2',
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: aws_access.access_key,
    secretAccessKey: aws_access.secret_key
});
const db = new aws.DynamoDB.DocumentClient();
const message_table = 'dechat.eth';
// 0x4a9cD320e8a1EEa8fD39748a10833555CB9bafD9

export default class Chat extends Component {
  componentDidMount() {
    if (this.initRoom()) {
      this.get_messages();
    }
  }

  componentWillUnmount() {
    this.state.formState = null;
    this.state.messages = null;
  }

  constructor(props) {
    super(props);
    this.state = {
      formState: {
        name: '',
        message: ''
      },
      messages: [],
      room: null,
      accounts: null,
      connected: null
    };
  }

  async initRoom() {
    let contract = this.props.contract;
    let accounts = await this.getAccounts();
    let room = localStorage.getItem('room');
    if (web3.utils.isAddress(room)) {
      let roomID = await contract.methods.checkRoom(web3.utils.toHex(room)).call({ from: accounts[0]});
      if (roomID) {
        this.state.room = room;
        return roomID;
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
    return accounts;
}

  async get_messages() {
    try {
      const params = {
        TableName : message_table,
        FilterExpression: "room = :room",
        ExpressionAttributeValues: {
          ':room': localStorage.getItem('room')
        },
      };
      let allMessages = await db.scan(params).promise();
      this.setState({
        messages: allMessages.Items
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    const { formState, messages, accounts, connected } = this.state;
    async function send_message() {
      let message = formState.message;
      let sender = accounts[0];
      let room = localStorage.getItem('room');
      let timestamp = Date.now();
      const message_to_send = {
          id : await sha512(message+sender+room+timestamp),
          message : message,
          sender : sender,
          room : room,
          timestamp : timestamp
      }
      const params = {
          TableName: message_table,
          Item: message_to_send
      }
      await db.put(params).promise().then(() => {
          console.log('message sent');
          window.location.reload();
      }, error => {
          console.error('Oh no.', error);
      })
    }
    return (
      <div style={{ padding: 30, textAlign: 'center'}}>
        <img src='./Dechat-eth.png' style={{ width: '20rem'}}></img>
        <br></br>
        <h4>User Settings</h4>  
          <input
            onChange={e => this.setState({ formState: { ...formState, name: e.target.value } })}
            placeholder="Set Username"
            name="name"
            value={formState.name}
          />
        <br></br>
        <h4>Messaging</h4>
        <input
          onChange={e => this.setState({ formState: { ...formState, message: e.target.value } })}
          placeholder="Message"
          name="message"
          value={formState.message}
        />
        <button onClick={send_message}>Send Message</button>
        {
          messages.map(message => (
            <div key={message.id}>
              <h2>{message.message}</h2>
              <h3>From: {message.sender}</h3>
              <p>Date: {message.timestamp}</p>
            </div>
          ))
        }
      </div>
    );
  }
}