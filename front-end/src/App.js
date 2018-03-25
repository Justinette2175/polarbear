import React, { Component } from 'react';
import TextEditor from './components/TextEditor';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

import Logo_horizontal from './assets/images/logo_horizontal.png'

import Accessible from './components/Accessible';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

import { Layout, Menu, Icon, Switch } from 'antd';
const { Header, Content, Footer } = Layout;

const SERVER_URL = 'https://www.polarbear.press/analysis'

//const SERVER_URL = 'http://localhost:3000/analysis';

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

  // response data sample:
  // {
  //   "engagement": {
  //       "shares": 1552,
  //       "comments": 1624,
  //       "reactions": 0
  //   },
  //   "tone": {
  //       "skewness": 0,
  //       "average": 0,
  //       "stdDev": 0
  //   }
  // }
  updateData(json) {
    this.setStateAsync({data: json});
  }

  _sendContent(data) {
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
    // debug ----------------------------------------------------------
    .catch((e) => {
      console.log('better chance next time', e);
      return {
        "engagement": {
          "shares": 0,
          "comments": 0,
          "reactions": 0
        },
        "tone": {
          "skewness": 0,
          "average": 0,
          "stdDev": 0
        }
      };
    })
    // debug ----------------------------------------------------------
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
    const text = document.getElementById('paragraphs').value;
    const title = document.getElementById('title').value;
    const summary = document.getElementById('summary').value;
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
        <Accessible data={this.state.data}/>
      </div>
    );
  }
}

export default App;
