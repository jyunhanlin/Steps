import { Doughnut, mixins } from 'vue-chartjs';

export default {
  name: 'Doughnut',
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          labels: ['已完成', '未完成'],
          datasets: [
            {
              backgroundColor: ['#2db374', '#c4c4c4'],
              data: [40, 20],
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
