import React from "react";
import { Doughnut } from 'react-chartjs-2';
import COLORS from '../../helpers/colors';

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

  render() {

    let values = {
      positif: 10000, 
      neutre: 3500, 
      negatif: 8364,
    }
    
    const dataValues = Object.keys(values).map((key) => {
      return values[key];
    })

    const colorsArray = this.makeColors();
    const data = {
      labels: ["Positif", "Neutre", "Negatif"],
      datasets: [{
        // label: "Ton de l'engagement",
        backgroundColor: 'rgb(255, 99, 132)',
        backgroundColor: ['#4caf50','#ffca28', '#f44336'],
        data: dataValues,
      }]
    };        
    return (
      <div className="doughnut-chart-wrapper chart-wrapper">
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