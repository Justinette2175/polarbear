import React, { Component } from 'react';
import { Icon, Switch, Button } from 'antd';

class InfoSection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="info-sections-wrapper">
        <div className="button-toggle-wrapper">
          <span>Mise à jour automatique</span>  
          <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange={this.props.toggleAutomaticUpdate} defaultChecked />
        </div>  
        <Button type="primary" className="update-data-button" onClick={this.props.sendDataWithButton} >Rafraîchir</Button>
      </section>
    )
  }
}

export default InfoSection;
