import React, {Component} from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import DoughnutChart from './charts/DoughnutChart';

class DataSection extends Component {
  constructor(props) {
    super(props);
    console.log('DataSection received:', props.data);
  }

  render() {
    return (
      <section id="data-sections-wrapper">
        <div className="data-section">
          <BarChart
              data={this.props.data}
          />
        </div>
        <div className="data-section">
          <LineChart/>
        </div>
        <div className="data-section">
          <DoughnutChart/>
        </div>
      </section>
    )
  }
}

export default DataSection;
