import { Color } from "@kurkle/color";

const COLORS = ["#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236", "#166a8f", "#00a950", "#58595b", "#8549ba"];

const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

export function months(count: number = 12): string[] {
  let values = [];
  let value;
  let times;

  for (let i = 0; i < count; ++i) {
    times = Math.floor(i / 12);
    if (times === 0) {
      value = MONTHS[Math.ceil(i) % 12];
      values.push(value);
      continue;
    }

    value = MONTHS[Math.ceil(i) % 12] + "N" + (times + 1);
    values.push(value);
  }

  return values;
}

export function color(index: number): string {
  return COLORS[index % COLORS.length];
}

export function transparentize(value: string, opacity?: number): string {
  let alpha = opacity === undefined ? 0.5 : 1 - opacity;
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
    Math.pow(1 + (interestRate * compoundFrequencyInMonths) / 12, lengthOfTimeInMonths / compoundFrequencyInMonths);

  return compoundingInterest;
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
