import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import Promise from 'bluebird';
const { TextArea} = Input;

class Editor extends Component {
  constructor(props) {
    super(props);
    this.setStateAsync = Promise.promisify(this.setState);
    this.state = {
      counter: 0,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.automaticUpdate && this.state.counter >= 10) {
      const text = document.getElementById('editor-text').textContent;
      const title = document.getElementById('editor-title').textContent;
      const summary = document.getElementById('editor-summary').textContent;
      console.log('sendingoverdata', {text, title, summary})
      this.setStateAsync({ counter: 0 })
        .then(() => {
          this.props.sendContent({
            title, 
            summary, 
            text,
        })
      })
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
        <h2><Icon type="form" />  À vous de jouer!</h2>  
        <div id="editor-title">
          <label forhtml="title">Titre</label>  
          <TextArea id="title" onChange={this._updateCounter.bind(this)}></TextArea>  
        </div> 
        <div id="editor-summary">
          <label forhtml="summary">Résumé</label>    
          <TextArea ref="summary" autosize={false} id="summary" onChange={this._updateCounter.bind(this)} />  
        </div>
        <div id="editor-text">
          <label forhtml="paragraphs">Contenu de l'article</label>      
          <TextArea ref="text" autosize={false} id="paragraphs" onChange={this._updateCounter.bind(this)} />  
        </div>  
      </section>
    )
  }
}

export default Editor;
