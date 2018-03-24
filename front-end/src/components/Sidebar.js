import React, { Component } from 'react';
import DataSection from './DataSection';
import InfoSection from './InfoSection';

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="sidebar">
        <InfoSection/>
        <DataSection/>
      </section>
    )
  }
}

export default SideBar;
