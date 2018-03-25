import React from "react";
import { Doughnut } from 'react-chartjs-2';
import COLORS from '../../helpers/colors';
import pattern from 'patternomaly';

import statsNoral from '../../utils/statNormalFunc';

class DoughnutChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      itemsNumber : 3,
    };
  }

  makeColors() {
    let colorsArray = [];
    for (let i = 0; i < this.state.itemsNumber; i++) {
      colorsArray.push(COLORS[i].value)
    }
    return colorsArray;
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  render() {
    const rawData = this.props.data || {};
    const avg = rawData.average;
    const stdDev = rawData.stdDev;
    const vals = statsNoral.extractFunctSteps(avg, stdDev, 5);

    const sum = vals.reduce((acc, val) => {
      return acc + val;
    }, 0)
    const positif = this.precisionRound((vals[4] + vals[3]) / sum * 100, 2);
    const neutre = this.precisionRound(vals[2] / sum * 100, 2);
    const negatif = this.precisionRound((vals[0] + vals[1]) / sum * 100, 2);

    let values = {
      positif,
      neutre,
      negatif,
    }
    
    const dataValues = Object.keys(values).map((key) => {
      return values[key];
    })

    const colorsArray = this.makeColors();
    const data = {
      labels: ["Positif", "Neutre", "Negatif"],
      datasets: [{
        // label: "Ton de l'engagement",
        backgroundColor: [
          pattern.draw('zigzag-horizontal', '#4caf50'),
          pattern.draw('circle', '#ffca28'),
          pattern.draw('square', '#f44336')
        ],
        data: dataValues,
      }]
    };        
    return (
      <div className="doughnut-chart-wrapper chart-wrapper" aria-hidden="true">
        <Doughnut data={data}
          getElementAtEvent={(elems) => {}}                                       
          options={{
            maintainAspectRatio: true,
            responsive: true,
            // barPercentage: 0.5,
            // scales: {
            //   xAxes: [{
            //   }],                            
            //   yAxes: [{
            //     ticks: {
            //         min: 0,
            //     }
            //   }]
            // }
          }}
        />
      </div>
    );
  }
}

export default DoughnutChart;