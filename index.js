import { sha512 } from 'crypto-hash';
const aws_access = require('./secrets.json');
const aws = require('aws-sdk');
aws.config.update({
    region: 'us-east-2',
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: aws_access.access_key,
    secretAccessKey: aws_access.secret_key
});
const db = new aws.DynamoDB.DocumentClient();
const message_table = 'dechat.eth';

async function send_message(message, sender, recipient, timestamp) {
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

async function get_message() {


}

async function get_messages(sender, recipient) {
  
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