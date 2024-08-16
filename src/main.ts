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
  LegendItem,
  ChartConfiguration,
  Plugin,
} from "chart.js";

import numeral from "numeral";
import { months } from "./utils";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const ctx = document.getElementById(
  "compounding-interest-chart"
) as HTMLCanvasElement;

const fullSizeCtx = document.getElementById(
  "full-size-chart"
) as HTMLCanvasElement;

const getOrCreateLegendList = (_chart: Chart, id: string) => {
  const legendContainer = document.getElementById(id) as HTMLDivElement;
  let listContainer = legendContainer.querySelector("ul");

  if (!listContainer) {
    listContainer = document.createElement("ul");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "row";
    listContainer.style.margin = "0";
    listContainer.style.padding = "0";

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

const htmlLegendPlugin: Plugin = {
  id: "htmlLegend",
  afterUpdate(chart, _args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID as string);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    if (!chart?.options?.plugins?.legend?.labels?.generateLabels) return;

    const items: LegendItem[] =
      chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";

      li.onclick = () => {
        const { type } = chart.config as ChartConfiguration;
        if (type === "pie" || type === "doughnut") {
          if (item.index != null && item.index != undefined) {
            chart.toggleDataVisibility(item.index);
          }
        } else {
          if (item.datasetIndex != null && item.datasetIndex != undefined) {
            chart.setDatasetVisibility(
              item.datasetIndex,
              !chart.isDatasetVisible(item.datasetIndex)
            );
          }
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle as string;
      boxSpan.style.borderColor = item.strokeStyle as string;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.flexShrink = "0";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

      // Text
      const textContainer = document.createElement("p");
      textContainer.style.color = item.fontColor as string;
      textContainer.style.margin = "0";
      textContainer.style.padding = "0";
      textContainer.style.textDecoration = item.hidden ? "line-through" : "";
      textContainer.style.fontSize = "10px";

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};

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
  plugins: [htmlLegendPlugin],
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
        // position: "bottom",
        // labels: {
        //   font: {
        //     size: 12,
        //   },
        // },
        display: false,
      },
      htmlLegend: {
        containerID: "legend-container",
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
} as ChartConfiguration);

export const fullSizeChart = new Chart(fullSizeCtx, {
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
    maintainAspectRatio: true,
    aspectRatio: 2 / 1,
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
} as ChartConfiguration);

export default chart;
