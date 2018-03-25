import React, { Component } from 'react';
import TextEditor from './components/TextEditor';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

import Logo_horizontal from './assets/images/logo_horizontal.png'

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

import { Layout, Menu, Icon, Switch } from 'antd';
const { Header, Content, Footer } = Layout;

// const SERVER_URL = 'http://52.179.98.111:8081/predict'

const SERVER_URL = 'http://localhost:8080/predict';

class App extends Component {

  constructor() {
    super();
    this.setStateAsync = Promise.promisify(this.setState);
    this.state = {
      titleValue: '',
      abstractValue: '',
      paragraphsValue: '',
      automaticUpdate: true,
      data: {}
    }
  }

  updateData() {
    
  }

  _sendContent(data) {
    console.log('sending content, ', data)
    fetch(SERVER_URL, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, cors, *same-origin
      // // redirect: 'follow', // *manual, follow, error
      // referrer: 'no-referrer', // *client, no-referrer
    })
    .then(response => response.json())
    .then((json) => {
      return this.updateData(json)
    }) 
  }

  get sendContent() {
    return this._sendContent.bind(this);
  }

  _toggleAutomaticUpdate() {
    let newState = !this.state.automaticUpdate;
    this.setStateAsync({automaticUpdate: newState})
  }

  get toggleAutomaticUpdate() {
    return this._toggleAutomaticUpdate.bind(this);
  }


  _sendDataWithButton() {
    const text = document.getElementById('editor-text').textContent;
    const title = document.getElementById('editor-title').textContent;
    const summary = document.getElementById('editor-summary').textContent;
    return this.sendContent({
      title, 
      summary, 
      text,
    })
  }

  get sendDataWithButton() {
    return this._sendDataWithButton.bind(this)
  }

  render() {

    

    return (
      <div className="App">
        <Layout>  
          <Header id="header">
            <h1 className="app-title">PolarBear</h1>  
            <div className="logo"><img src={Logo_horizontal} alt="Logo de Polar bear: un ours rouge dans un cercle" /></div> 
          </Header>
          <Content className="main-content">
            <Sidebar
              automaticUpdate={this.state.automaticUpdate}
              toggleAutomaticUpdate={this.toggleAutomaticUpdate}
              sendDataWithButton={this.sendDataWithButton}
              data={this.state.data}
            />
            <Editor
              sendContent={this.sendContent}
              automaticUpdate={this.state.automaticUpdate}
            />
          </Content> 
        </Layout>  
      </div>
    );
  }
}

export default App;
