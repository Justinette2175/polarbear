import React from "react";
import { Line } from 'react-chartjs-2';

import pattern from 'patternomaly';
import statsNoral from '../../utils/statNormalFunc';

class LineChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const rawData = this.props.data || {};
    const avg = rawData.average;
    const stdDev = rawData.stdDev;
    const yValues = statsNoral.extractFunctSteps(avg, stdDev, 7);
    console.log('yValues', yValues);
    
    const data = {
      labels: ["Negatif", "", "", "Neutre", "", "", "Positif"],
      datasets: [{
        label: "Ton de l'engagement",
        backgroundColor: pattern.draw('zigzag-horizontal', '#f44336'),
        borderColor: '#ff7960',
        data: yValues
      }]
    };
    return (
      <div className="line-chart-wrapper chart-wrapper" aria-hidden="true">
        <Line data={data}
          getElementAtEvent={(elems) => {}}                                       
          options={{
            maintainAspectRatio: true,
            responsive: true,
            barPercentage: 0.5,
            scales: {
              xAxes: [{
              }],                            
              yAxes: [{
                ticks: {
                    min: 0,
                }
              }]
            }
          }}
        />
      </div>
    );
  }
}

export default LineChart;