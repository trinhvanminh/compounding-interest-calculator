import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import numeral from "numeral";
import { months } from "./utils";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

const ctx = document.querySelector<HTMLCanvasElement>("#compounding-interest-chart")!;

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: months(),
    datasets: [
      {
        label: "Kỳ hạn n (i%)",
        data: [0],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: function (value, _index, _ticks) {
            return numeral(value).format("(0a)");
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "LÃI KÉP",
        font: {
          size: 24,
        },
      },
    },
  },
});

export default chart;
