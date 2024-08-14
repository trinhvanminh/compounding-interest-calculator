import { Color } from "@kurkle/color";

const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

type MonthConfig = {
  count?: number;
  section?: number;
};

export function months(config?: MonthConfig): string[] {
  let cfg = config || {};
  let count = cfg.count || 12;
  let section = cfg.section;
  let values = [];
  let value;

  for (let i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}

export function color(index: number): string {
  return COLORS[index % COLORS.length];
}

export function transparentize(value: string, opacity?: number): string {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  const kurklecolor = new Color(value);
  return kurklecolor.alpha(alpha).rgbString();
}

export function calculateCompoundingInterest(
  initInvestment: number,
  interestRate: number,
  compoundFrequencyInMonths: number,
  lengthOfTimeInMonths: number
): number {
  if (lengthOfTimeInMonths < compoundFrequencyInMonths) {
    return initInvestment;
  }

  const compoundingInterest: number =
    initInvestment *
    Math.pow(
      1 + (interestRate * compoundFrequencyInMonths) / 12,
      lengthOfTimeInMonths / compoundFrequencyInMonths
    );

  return compoundingInterest;
}
