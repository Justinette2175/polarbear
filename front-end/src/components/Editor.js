import React, { Component } from 'react';
import { Input } from 'antd';
import Promise from 'bluebird';
const { TextArea } = Input;

class Editor extends Component {
  constructor(props) {
    super(props);
    this.setStateAsync = Promise.promisify(this.setState);
    this.state = {
      counter: 0,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.counter >= 50) {
      const text = document.getElementById('editor-text').textContent;
      const title = document.getElementById('editor-title').textContent;
      const summary = document.getElementById('editor-summary').textContent;
      console.log('sendingoverdata', {text, title, summary})
      this.setStateAsync({ counter: 0 })
    }
  }

  _updateCounter(e) {
    e.preventDefault();
    let counter = this.state.counter;
    counter += 1;
    this.setStateAsync({ counter })
  }

  render() {
    return (
      <section id="editor">
        <div id="editor-title">
          <TextArea id="title" placeholder="Votre titre" onChange={this._updateCounter.bind(this)}></TextArea>  
        </div> 
        <h3>Résumé</h3>
        <div id="editor-summary">
          <TextArea ref="summary" autosize={false} id="paragraphs" onChange={this._updateCounter.bind(this)} />  
        </div>
        <h3>Contenu de l'article</h3>
        <div id="editor-text">
          <TextArea ref="text" autosize={false} id="paragraphs" onChange={this._updateCounter.bind(this)} />  
        </div>  
      </section>
    )
  }
}

export default Editor;
