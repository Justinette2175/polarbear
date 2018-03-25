import React from "react";
import { Line } from 'react-chartjs-2';

class LineChart extends React.Component {

  render() {
    const data = {
      labels: ["Negatif", "", "", "Neutre", "", "", "Positif"],
      datasets: [{
        label: "Ton de l'engagement",
        backgroundColor: '#f44336',
        borderColor: '#ff7960',
        data: [0, 10, 5, 2, 20, 30, 45],
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