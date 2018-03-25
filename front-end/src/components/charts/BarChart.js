import React from "react";
import { Bar } from 'react-chartjs-2';
import pattern from 'patternomaly';
import COLORS from '../../helpers/colors';

class BarChart extends React.Component {

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

  render() {

    console.log('render:', this.props.data)
    // let values = {
    //   likes: 10000, 
    //   shares: 3500, 
    //   comments: 8364,
    // }

    let values = this.props.data;// || {};
    
    const dataValues = Object.keys(values).map((key) => {
      return values[key];
    })

    const colorsArray = this.makeColors();

    const data = {
      labels: ["J'aime", "Partages", "Commentaires"],
      datasets: [{
        label: "Engagement attendu",
        backgroundColor: [
          pattern.draw('square', '#ff7960'),
          pattern.draw('zigzag-horizontal', '#f44336'),
          pattern.draw('circle', '#b9000b'),
        ],
        data: dataValues,
      }]
    };
    return (
      <div className="bar-chart-wrapper chart-wrapper" aria-hidden="true">
        <Bar data={data}
          getElementAtEvent={(elems) => {}}                                       
          options={{
            maintainAspectRatio: true,
            responsive: true,
            barPercentage: 0.5,
            scales: {
              xAxes: [{}],                            
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

export default BarChart;