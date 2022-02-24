import React, { useEffect, useState, useReducer, Component } from 'react'

export default class Login extends Component {
    componentDidMount() {
    }
  
    render() {
        return (
            <div style={{ padding: 30, textAlign: 'center'}}>
                <img src='Dechat-eth.png' style={{ width: '20rem'}}></img>
                <br></br>
                <input
                onChange={onChange}
                placeholder="Name"
                name="name"
                value={formState.name}
                />
                <input
                onChange={onChange}
                placeholder="Message"
                name="message"
                value={formState.message}
                />
                <button onClick={saveMessage}>Send Message</button>
                {
                state.messages.map(message => (
                    <div key={message.createdAt}>
                    <h2>{message.message}</h2>
                    <h3>From: {message.name}</h3>
                    <p>Date: {message.createdAt}</p>
                    </div>
                ))
                }
            </div>
        )
    }
}