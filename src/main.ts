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
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Lãi kép",
      },
    },
  },
});

export default chart;

// const actions = [
//   {
//     name: "Add Dataset",
//     handler(chart: Chart) {
//       const data = chart.data;
//       const dsColor = color(chart.data.datasets.length);
//       const newDataset = {
//         label: "Dataset " + (data.datasets.length + 1),
//         backgroundColor: transparentize(dsColor, 0.5),
//         borderColor: dsColor,
//         data: Utils.numbers({
//           count: data.labels.length,
//           min: -100,
//           max: 100,
//         }),
//       };
//       chart.data.datasets.push(newDataset);
//       chart.update();
//     },
//   },
//   {
//     name: "Remove Dataset",
//     handler(chart: Chart) {
//       chart.data.datasets.pop();
//       chart.update();
//     },
//   },
// ];
// }
