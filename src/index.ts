import { ChartDataset } from "chart.js";
import chart from "./main";
import { calculateCompoundingInterest, color, debounce, months, transparentize } from "./utils";

type InterestRateByCompoundFrequency = {
  compoundFrequency: number;
  interestRate: number;
};

const initInvestmentElm = document.querySelector<HTMLInputElement>("#init-investment")!;
const lengthOfTimeInYearElm = document.querySelector<HTMLInputElement>("#length-of-time")!;
const addDatasetBtn = document.querySelector<HTMLButtonElement>("#add-dataset")!;
const removeDatasetBtn = document.querySelector<HTMLButtonElement>("#remove-dataset")!;
const loadSampleDataBtn = document.querySelector<HTMLButtonElement>("#load-sample-data")!;

// TODO: make 3 this variables dynamic
let initialInvestment: number;
let lengthOfTimeInMonths: number;

const INTEREST_RATE_BY_COMPOUND_FREQUENCIES: InterestRateByCompoundFrequency[] = [
  {
    compoundFrequency: 1,
    interestRate: 0.037,
  },
  {
    compoundFrequency: 2,
    interestRate: 0.038,
  },
  {
    compoundFrequency: 3,
    interestRate: 0.039,
  },
  {
    compoundFrequency: 5,
    interestRate: 0.043,
  },
  {
    compoundFrequency: 6,
    interestRate: 0.049,
  },
  {
    compoundFrequency: 12,
    interestRate: 0.052,
  },
  {
    compoundFrequency: 18,
    interestRate: 0.054,
  },
  {
    compoundFrequency: 21,
    interestRate: 0.055,
  },
  {
    compoundFrequency: 24,
    interestRate: 0.056,
  },
  {
    compoundFrequency: 36,
    interestRate: 0.058,
  },
];

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
  console.log("Data added");
  updateChart();
});

removeDatasetBtn.addEventListener("click", () => {
  console.log("Data removed");
  updateChart();
});

loadSampleDataBtn.addEventListener("click", () => {
  console.log("Sample data loaded");
  updateChart();
});

function getDatasets() {
  const datasets = INTEREST_RATE_BY_COMPOUND_FREQUENCIES.map<ChartDataset<"line", number[]>>(
    (interestRateByFrequencies: InterestRateByCompoundFrequency, index: number) => {
      const { compoundFrequency, interestRate } = interestRateByFrequencies;

      const label: string = `Kỳ hạn: ${compoundFrequency} tháng (${(interestRate * 100).toFixed(2)}%)`;

      let compoundInterests: number[] = [];
      for (let i = 0; i < lengthOfTimeInMonths; i++) {
        const month = i + 1;
        const compoundInterest = calculateCompoundingInterest(
          initialInvestment,
          interestRate,
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

function updateChart() {
  const datasets = getDatasets();
  chart.data.datasets = datasets;
  chart.data.labels = months(lengthOfTimeInMonths);
  chart.update();
}
