import React, { Component } from 'react';
import DataSection from './DataSection';
import InfoSection from './InfoSection';

class SideBar extends Component {
  constructor(props) {
    super(props);
    console.log('SideBar received:', props.data);
  }

  render() {
    return (
      <section id="sidebar">
        <InfoSection
          automaticUpdate={this.props.automaticUpdate}
          toggleAutomaticUpdate={this.props.toggleAutomaticUpdate}
          sendDataWithButton={this.props.sendDataWithButton}
        />
        <DataSection
          data={this.props.data}
        />
      </section>
    )
  }
}

export default SideBar;
