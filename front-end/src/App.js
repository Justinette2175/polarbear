import React, { Component } from 'react';
import TextEditor from './components/TextEditor';
import Promise from 'bluebird';
import Logo_horizontal from './assets/images/logo_horizontal.png'

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {

  constructor() {
    super();
    this.setStateAsync = Promise.promisify(this.setState);
    this.state = {
      titleValue: '',
      abstractValue: '',
      paragraphsValue:'', 
    }
  }

  _updateTitleValue(value) {
    this.setStateAsync({ titleValue: value });
  }

  get updateTitleValue() {
    return this._updateTitleValue.bind(this);
  }

  _updateAbstractValue(value) {
    this.setStateAsync({ abstractValue: value });
  }

  get updateAbstractValue() {
    return this._updateAbstractValue.bind(this);
  }

  _updateParagraphsValue(value) {
    this.setStateAsync({ paragraphsValue: value });
  }

  get updateParagraphsValue() {
    return this._updateParagraphsValue.bind(this);
  }


  sendUpdatedText() {

  }

  render() {

    const textTools = {
      title: this.state.title,
      abstract: this.state.abstract,

    }
    return (
      <div className="App">
        <Layout>  
          <Header id="header">
            <div className="logo"><img src={Logo_horizontal} alt="Logo de Polar bear: un ours rouge dans un cercle"/></div> 
          </Header>
          <Content className="main-content">
            <Sidebar/>
            <Editor/>
          </Content> 
        </Layout>  
      </div>
    );
  }
}

export default App;
