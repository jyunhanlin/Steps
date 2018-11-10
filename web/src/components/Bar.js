import { Bar, mixins } from 'vue-chartjs';

export default {
  name: 'Bar',
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          labels: ['123', '', '', '', '', '', ''],
          datasets: [
            {
              backgroundColor: [
                '#c4c4c4',
                '#c4c4c4',
                '#111111',
                '#c4c4c4',
                '#c4c4c4',
                '#c4c4c4',
                '#c4c4c4',
              ],
              data: [1, 5, 4, 2, 7, 1, 3],
            },
          ],
        };
      },
    },
  },
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
