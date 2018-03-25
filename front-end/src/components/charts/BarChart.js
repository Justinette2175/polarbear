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

    let values = {
      likes: 10000, 
      shares: 3500, 
      comments: 8364,
    }
    
    const dataValues = Object.keys(values).map((key) => {
      return values[key];
    })

    const colorsArray = this.makeColors();

    const data = {
      labels: ["J'aime", "Partages", "Commentaires"],
      datasets: [{
        label: "Engagement attendu",
        backgroundColor: colorsArray,
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