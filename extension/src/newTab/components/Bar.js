import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  name: 'Bar',
  extends: Bar,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        stepped: false,
        scales: {
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
          }],
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          }],
        },
        // layout: {
        //   padding: {
        //     left: 0,
        //     right: 0,
        //     top: 0,
        //     bottom: -20,
        //   },
        // },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
