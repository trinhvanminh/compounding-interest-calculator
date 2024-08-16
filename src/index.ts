import { ChartDataset } from "chart.js";
import chart from "./main";
import { calculateCompoundingInterest, color, debounce, months, transparentize } from "./utils";

type InterestRate = {
  compoundFrequency: number;
  interestRate: number;
};

const OCB_INTEREST_RATES: InterestRate[] = [
  { compoundFrequency: 1, interestRate: 0.037 },
  { compoundFrequency: 2, interestRate: 0.038 },
  { compoundFrequency: 3, interestRate: 0.039 },
  { compoundFrequency: 5, interestRate: 0.043 },
  { compoundFrequency: 6, interestRate: 0.049 },
  { compoundFrequency: 12, interestRate: 0.052 },
  { compoundFrequency: 18, interestRate: 0.054 },
  { compoundFrequency: 21, interestRate: 0.055 },
  { compoundFrequency: 24, interestRate: 0.056 },
  { compoundFrequency: 36, interestRate: 0.058 },
];

// TODO: make these variables dynamic
let initialInvestment: number;
let lengthOfTimeInMonths: number;
let interestRates: InterestRate[] = OCB_INTEREST_RATES;

const initInvestmentElm = document.getElementById("init-investment") as HTMLInputElement;
const lengthOfTimeInYearElm = document.getElementById("length-of-time") as HTMLInputElement;
const addDatasetBtn = document.getElementById("add-dataset-button") as HTMLButtonElement;
const removeDatasetsBtn = document.getElementById("remove-datasets") as HTMLButtonElement;

const loadSampleDataBtn = document.getElementById("load-sample-data") as HTMLButtonElement;
const interestRateList = document.getElementById("interest-rate-list") as HTMLDivElement;

const compoundFrequencyInput = document.getElementById("compound-frequency") as HTMLInputElement;
const interestRateInput = document.getElementById("interest-rate") as HTMLInputElement;

initInvestmentElm.addEventListener(
  "input",
  debounce(function (e) {
    const element = e.target as HTMLInputElement;
    initialInvestment = parseFloat(element.value);
    updateChart();
  }, 300)
);

lengthOfTimeInYearElm.addEventListener(
  "input",
  debounce(function (e) {
    const element = e.target as HTMLInputElement;
    lengthOfTimeInMonths = parseFloat(element.value) * 12;
    updateChart();
  }, 300)
);

addDatasetBtn.addEventListener("click", () => {
  const compoundFrequency = parseInt(compoundFrequencyInput.value, 10);
  const interestRate = parseFloat(interestRateInput.value) / 100;

  if (!isNaN(compoundFrequency) && !isNaN(interestRate)) {
    interestRates.push({ compoundFrequency, interestRate });
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

removeDatasetsBtn.addEventListener("click", () => {
  interestRates = [];
  renderInterestRateList();
  updateChart();
});

loadSampleDataBtn.addEventListener("click", () => {
  interestRates = OCB_INTEREST_RATES;
  renderInterestRateList();
  updateChart();
});

function getDatasets() {
  const datasets = interestRates.map<ChartDataset<"line", number[]>>((interestRate: InterestRate, index: number) => {
    const { compoundFrequency, interestRate: rate } = interestRate;

    const label: string = `Kỳ hạn: ${compoundFrequency} tháng (${(rate * 100).toFixed(2)}%)`;

    let compoundInterests: number[] = [];
    for (let i = 0; i < lengthOfTimeInMonths; i++) {
      const month = i + 1;
      const compoundInterest = calculateCompoundingInterest(initialInvestment, rate, compoundFrequency, month);

      compoundInterests.push(compoundInterest);
    }

    return {
      label,
      data: compoundInterests,
      borderColor: color(index),
      backgroundColor: transparentize(color(index), 0.5),
    };
  });
  return datasets;
}

function sortInterestRates() {
  interestRates.sort((a, b) => a.compoundFrequency - b.compoundFrequency);
}

function renderInterestRateList() {
  interestRateList.innerHTML = ""; // Clear the existing list

  interestRates.forEach((item, index) => {
    const listItem = document.createElement("div");
    listItem.className = "interest-rate-item";
    listItem.innerHTML = `
      <span>Kỳ hạn: ${item.compoundFrequency} tháng, Lãi suất: ${(item.interestRate * 100).toFixed(2)}%</span>
      <button data-index="${index}">Xoá</button>
    `;
    interestRateList.appendChild(listItem);
  });

  // Add event listeners to the remove buttons
  interestRateList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.target as HTMLButtonElement;
      const index = parseInt(target.getAttribute("data-index")!, 10);
      interestRates.splice(index, 1);
      renderInterestRateList();
      updateChart();
    });
  });
}

function updateChart() {
  const datasets = getDatasets();
  chart.data.datasets = datasets;
  chart.data.labels = months(lengthOfTimeInMonths);
  chart.update();
}

renderInterestRateList();
updateChart();
