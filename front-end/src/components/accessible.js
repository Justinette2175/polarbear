import React, {Component} from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import DoughnutChart from './charts/DoughnutChart';

class DataSection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="accessible-wrapper">
        <div className="data-section">
          <BarChart/>
        </div>
      </section>
    )
  }
}

export default DataSection;
