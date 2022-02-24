import React, { useEffect, useState, useReducer, Component } from 'react'
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

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
}

export default class Chat extends Component {
  componentDidMount() {
     
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

  async get_message() {

  }

  async get_messages(sender, recipient) {
    
  }

  //send_message('Hello', '0x1234567890123456789012345678901234567890', '0x1234567890123456789012345678901234567890', Date.now());
    

  /*
  await db.get({
      TableName: message_table,
      Key: {
        'id': id
      }
    }).promise().then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    })
  */
  
  render() {
    const { formState, messages } = this.state;
    async function send_message() {
      let message = formState.message;
      let sender = formState.name;
      let recipient = 'Alice';
      let timestamp = Date.now();
      const message_to_send = {
          id : await sha512(message+sender+recipient+timestamp),
          message : message,
          sender : sender,
          recipient : recipient,
          timestamp : timestamp
      }
      console.log(message_to_send);
      const params = {
          TableName: message_table,
          Item: message_to_send
      }
      await db.put(params).promise().then(() => {
          console.log('message sent');
      }, error => {
          console.error('Oh no.', error);
      })
    }
    return (
      <div style={{ padding: 30, textAlign: 'center'}}>
        <img src='Dechat-eth.png' style={{ width: '20rem'}}></img>
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
            <div key={message.createdAt}>
              <h2>{message.message}</h2>
              <h3>From: {message.name}</h3>
              <p>Date: {message.createdAt}</p>
            </div>
          ))
        }
      </div>
    );
  }
}