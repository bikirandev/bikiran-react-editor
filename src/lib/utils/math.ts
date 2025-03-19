/* eslint-disable no-eval */

export const evaluate = (val: any) => {
  let output = val;

  const isValOperatorOrNumber = /^[\d.*/+=-]*$/.test(val);

  if (output.substring(output.length - 1, output.length) === "=") {
    if (isValOperatorOrNumber) {
      try {
        output = eval(output.substring(0, output.length - 1));
      } catch (error) {
        output = 0;
      }
    } else {
      output = 0;
    }
  }
  return output;
};

export const round = (value: number, decimals: number = 4) => {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
};

export default null;
