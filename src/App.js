import React, { Component } from 'react';
import './App.css';
import SendMessageForm from './components/SendMessageForm';
import MessageList from './components/MessageList';
import Chatkit from '@pusher/chatkit';

const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/5b71386b-7308-4fd4-b6f7-9ef780e5acd5/token";
const instanceLocator = "v1:us1:5b71386b-7308-4fd4-b6f7-9ef780e5acd5";
const username = "mariel33";
const roomId = 12923884;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: '13',
      tokenProvider: new Chatkit.TokenProvider({
        url: testToken
      })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser
      currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      })
    })
    .catch((err) => {
      console.log("error with connection", err)
    })
  }
  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }

  
  render() {
    return (
      <div className="app">
        <Title/>
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages} />
        <SendMessageForm
          sendMessage={this.sendMessage} />
      </div>
    );
  }
}

function Title() {
  return <p className="title">Chatter Box</p>
}

export default App;
