import Chart from "chart.js";

let data = localStorage.getItem("heart_rate").split(",");

let MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let config = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: [],
        fill: false
      },
    ]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Chart.js Line Chart"
    },
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Month"
          }
        }
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Value"
          }
        }
      ]
    }
  }
};

window.onload = function() {
  let ctx = document.getElementById("canvas").getContext("2d");
  window.myLine = new Chart(ctx, config);
};

let colorNames = Object.keys(window.chartColors);

setInterval(() => {
  if (config.data.datasets.length > 0) {
    let date = [];
    // config.data.labels.push(date);
    config.data.datasets[0] = [];
    config.data.datasets[0].push(localStorage.getItem("heart_rate").split(","));
    window.myLine.update();
  }
}, 5000);
