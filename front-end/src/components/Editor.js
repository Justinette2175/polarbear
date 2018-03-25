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
      const text = document.getElementById('paragraphs').value;
      const title = document.getElementById('title').value;
      const summary = document.getElementById('summary').value;
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
          <label>
            Titre
            <TextArea id="title" onChange={this._updateCounter.bind(this)}></TextArea>
          </label>  
        </div> 
        <div id="editor-summary">
          <label>
            Résumé
            <TextArea ref="summary" autosize={false} id="summary" onChange={this._updateCounter.bind(this)} />
          </label>    
        </div>
        <div id="editor-text">
          <label>
            Contenu de l'article
            <TextArea ref="text" autosize={false} id="paragraphs" onChange={this._updateCounter.bind(this)} />  
          </label>      
        </div>  
      </section>
    )
  }
}

export default Editor;
