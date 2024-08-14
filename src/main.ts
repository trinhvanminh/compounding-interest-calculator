// TODO: make it a npm package

import { Chart, LineController } from "chart.js";
import {
  calculateCompoundingInterest,
  color,
  months,
  transparentize,
} from "./utils";

type InterestRateByCompoundFrequency = {
  compoundFrequency: number;
  interestRate: number;
};

type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

// TODO: make 3 this variables dynamic
const INITIAL_INVESTMENT = 60_000_000;
const LENGTH_OF_TIME_IN_MONTHS = 36;
const INTEREST_RATE_BY_COMPOUND_FREQUENCIES: InterestRateByCompoundFrequency[] =
  [
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

const datasets = INTEREST_RATE_BY_COMPOUND_FREQUENCIES.map<Dataset>(
  (
    interestRateByFrequencies: InterestRateByCompoundFrequency,
    index: number
  ) => {
    const { compoundFrequency, interestRate } = interestRateByFrequencies;

    const label: string = `Kỳ hạn: ${compoundFrequency} tháng (${(
      interestRate * 100
    ).toFixed(2)}%)`;

    let compoundInterests: number[] = [];
    for (let i = 0; i < LENGTH_OF_TIME_IN_MONTHS; i++) {
      const month = i + 1;
      const compoundInterest = calculateCompoundingInterest(
        INITIAL_INVESTMENT,
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

const ctx = document.querySelector<HTMLCanvasElement>(
  "#compounding-interest-chart"
);

Chart.register(LineController);

if (ctx) {
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months({ count: LENGTH_OF_TIME_IN_MONTHS }),
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    },
  });
}
