/**
 * Rounds a number to 2 decimal places using a more precise method
 */
export const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Adds two numbers with proper decimal handling
 */
export const add = (a: number, b: number): number => {
  return roundToTwo(a + b);
};

/**
 * Multiplies two numbers with proper decimal handling
 */
export const multiply = (a: number, b: number): number => {
  return roundToTwo(a * b);
};

/**
 * Divides two numbers with proper decimal handling
 */
export const divide = (a: number, b: number): number => {
  return roundToTwo(a / b);
};

/**
 * Calculates percentage of a number with proper decimal handling
 */
export const calculatePercentage = (
  amount: number,
  percentage: number
): number => {
  return roundToTwo(amount * (percentage / 100));
};
