import { ChartDataset } from "chart.js";
import chart, { fullSizeChart } from "./main";
import {
  calculateCompoundingInterest,
  color,
  debounce,
  months,
  transparentize,
} from "./utils";
import numeral from "numeral";
import "numeral/locales/vi";

import { v4 as uuidv4 } from "uuid";

numeral.locale("vi");

type InterestRate = {
  id: string;
  compoundFrequency: number;
  interestRate: number;
};

const OCB_INTEREST_RATES: InterestRate[] = [
  { id: "1", compoundFrequency: 1, interestRate: 0.037 },
  { id: "2", compoundFrequency: 2, interestRate: 0.038 },
  { id: "3", compoundFrequency: 3, interestRate: 0.039 },
  { id: "4", compoundFrequency: 5, interestRate: 0.043 },
  { id: "5", compoundFrequency: 6, interestRate: 0.049 },
  { id: "6", compoundFrequency: 12, interestRate: 0.052 },
  { id: "7", compoundFrequency: 18, interestRate: 0.054 },
  { id: "8", compoundFrequency: 21, interestRate: 0.055 },
  { id: "9", compoundFrequency: 24, interestRate: 0.056 },
  { id: "10", compoundFrequency: 36, interestRate: 0.058 },
];

const initInvestmentElm = document.getElementById(
  "init-investment"
) as HTMLInputElement;
const lengthOfTimeInYearElm = document.getElementById(
  "length-of-time"
) as HTMLInputElement;
const addDatasetBtn = document.getElementById(
  "add-dataset-button"
) as HTMLButtonElement;
const removeDatasetsBtn = document.getElementById(
  "remove-datasets"
) as HTMLButtonElement;

const loadSampleDataBtn = document.getElementById(
  "load-sample-data"
) as HTMLButtonElement;
const interestRateList = document.getElementById(
  "interest-rate-list"
) as HTMLDivElement;

const compoundFrequencyInput = document.getElementById(
  "compound-frequency"
) as HTMLInputElement;
const interestRateInput = document.getElementById(
  "interest-rate"
) as HTMLInputElement;

const downloadButton = document.getElementById(
  "download-chart"
) as HTMLButtonElement;

let initialInvestment: number = parseFloat(initInvestmentElm.value);
let lengthOfTimeInMonths: number = parseFloat(lengthOfTimeInYearElm.value) * 12;
let interestRates: InterestRate[] = [...OCB_INTEREST_RATES];

initInvestmentElm.addEventListener(
  "input",
  debounce(function (e) {
    const element = e.target as HTMLInputElement;
    let value = parseFloat(element.value);

    if (value < 0) {
      alert("Vui lòng nhập số tiền lớn hơn 0");
      element.value = "0";
      value = 0;
    }

    initialInvestment = value;
    updateChart();
  }, 300)
);

lengthOfTimeInYearElm.addEventListener(
  "input",
  debounce(function (e) {
    const element = e.target as HTMLInputElement;
    let value = parseFloat(element.value);

    if (value < 0) {
      alert("Vui lòng nhập thời gian gửi lớn hơn 0");
      element.value = "0";
      value = 0;
    }

    lengthOfTimeInMonths = value * 12;
    updateChart();
  }, 300)
);

addDatasetBtn.addEventListener("click", () => {
  const compoundFrequency = parseInt(compoundFrequencyInput.value, 10);
  const interestRate = parseFloat(interestRateInput.value) / 100;

  const isValidInput =
    !isNaN(compoundFrequency) &&
    !isNaN(interestRate) &&
    compoundFrequency > 0 &&
    interestRate > 0;

  if (isValidInput) {
    interestRates.push({ id: uuidv4(), compoundFrequency, interestRate });
    sortInterestRates();
    renderInterestRateList();
    updateChart();

    compoundFrequencyInput.value = "";
    interestRateInput.value = "";
  } else {
    alert("Vui lòng nhập các giá trị hợp lệ cho kỳ hạn và lãi suất.");
  }

  updateChart();
});

downloadButton.addEventListener("click", () => {
  const datasets = getDatasets();
  console.log("datasets", datasets);
  fullSizeChart.data.datasets = datasets;
  fullSizeChart.data.labels = months(lengthOfTimeInMonths);

  fullSizeChart.update();

  const base64Image = fullSizeChart.toBase64Image("image/png", 1);
  const link = document.createElement("a");
  link.href = base64Image;
  link.download = "chart.png";
  link.click();
});

removeDatasetsBtn.addEventListener("click", () => {
  interestRates = [];
  renderInterestRateList();
  updateChart();
});

loadSampleDataBtn.addEventListener("click", () => {
  interestRates = [...OCB_INTEREST_RATES];
  renderInterestRateList();
  updateChart();
});

function getDatasets() {
  const datasets = interestRates.map<ChartDataset<"line", number[]>>(
    (interestRate: InterestRate, index: number) => {
      const { compoundFrequency, interestRate: rate } = interestRate;

      const label: string = `${compoundFrequency} tháng (${(rate * 100).toFixed(
        2
      )}%)`;

      let compoundInterests: number[] = [];
      for (let i = 0; i < lengthOfTimeInMonths; i++) {
        const month = i + 1;
        const compoundInterest = calculateCompoundingInterest(
          initialInvestment,
          rate,
          compoundFrequency,
          month
        );

        compoundInterests.push(compoundInterest);
      }

      return {
        label,
        data: compoundInterests,
        borderColor: color(index),
        backgroundColor: transparentize(color(index), 0.5),
      };
    }
  );
  return datasets;
}

function sortInterestRates() {
  interestRates.sort(
    (a, b) =>
      a.compoundFrequency - b.compoundFrequency ||
      a.interestRate - b.interestRate
  );
}

function renderInterestRateList() {
  interestRateList.innerHTML = ""; // Clear the existing list

  interestRates.forEach((item: InterestRate) => {
    const listItem = document.createElement("div");
    listItem.className = "interest-rate-item";
    listItem.innerHTML = `
      <span>${item.compoundFrequency} tháng (${(
      item.interestRate * 100
    ).toFixed(2)}%)</span>
      <button data-interest-rate-id="${
        item.id
      }"><i class="fas fa-trash-alt"></i></button>
    `;
    interestRateList.appendChild(listItem);
  });

  // Add event listeners to the remove buttons
  interestRateList
    .querySelectorAll("button[data-interest-rate-id]")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        // Note: event.target can be a child element if bubbling
        // event.currentTarget is the current target
        const target = event.currentTarget as HTMLButtonElement;
        const id = target.getAttribute("data-interest-rate-id");
        interestRates = interestRates.filter((item) => item.id !== id);
        renderInterestRateList();
        updateChart();
      });
    });
}

function updateChart() {
  const datasets = getDatasets();
  const labels = months(lengthOfTimeInMonths);

  chart.data.datasets = datasets;
  chart.data.labels = labels;
  chart.update();

  fullSizeChart.data.datasets = datasets;
  fullSizeChart.data.labels = labels;
  fullSizeChart.update();
}

window.addEventListener("load", () => {
  renderInterestRateList();
  updateChart();
});
