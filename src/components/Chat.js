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

export default class Chat extends Component {
  componentDidMount() {
    this.connect();
    this.get_messages();
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
      messages: []
    };
  }

  async connect() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async get_message(sender, recipient) {
    await db.get({
      TableName: message_table,
      Key: {
        sender: sender
      }
    }).promise().then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    })
  }

  async get_messages() {
    const params = {
      TableName: message_table
    }
    const allMessages = await this.scanDynamoRecords(params, []);
    this.setState({
      messages: allMessages
    });
  }

  async scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await db.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      throw new Error(error);
    }
  }
  
  render() {
    const { formState, messages } = this.state;
    console.log(this.props.match.params.room);
    async function send_message() {
      let message = formState.message;
      let sender = formState.name;
      let room = this.props.match.params;
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
        <img src='../Dechat-eth.png' style={{ width: '20rem'}}></img>
        <br></br>
        <input
          onChange={e => this.setState({ formState: { ...formState, name: e.target.value } })}
          placeholder="Name"
          name="name"
          value={formState.name}
        />
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