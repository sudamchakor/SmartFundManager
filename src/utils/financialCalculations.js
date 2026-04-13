// src/utils/financialCalculations.js

/**
 * Calculates the required monthly SIP to reach a target amount.
 * @param {number} targetAmount The future value needed.
 * @param {number} yearsToGoal The number of years until the goal.
 * @param {number} annualReturnRate The expected annual return rate (e.g., 0.12 for 12%).
 * @returns {number} The required monthly SIP.
 */
export const calculateSIP = (targetAmount, yearsToGoal, annualReturnRate) => {
  if (yearsToGoal <= 0 || annualReturnRate <= 0) {
    // If no time or no return, SIP is target amount / (years * 12) if years > 0, else target amount
    return yearsToGoal > 0 ? targetAmount / (yearsToGoal * 12) : targetAmount;
  }

  const monthlyReturnRate = annualReturnRate / 12;
  const numberOfMonths = yearsToGoal * 12;

  // FV = P * (((1 + r)^n - 1) / r) * (1 + r) for SIP at beginning of period
  // We need to find P (monthly SIP)
  // P = FV / ((((1 + r)^n - 1) / r) * (1 + r))
  const factor = (Math.pow(1 + monthlyReturnRate, numberOfMonths) - 1) / monthlyReturnRate;
  const sip = targetAmount / (factor * (1 + monthlyReturnRate)); // Assuming SIP at beginning of month

  return sip > 0 ? sip : 0;
};

/**
 * Calculates the required initial monthly SIP for a Step-Up SIP to reach a target amount.
 * @param {number} targetAmount The future value needed.
 * @param {number} yearsToGoal The number of years until the goal.
 * @param {number} annualReturnRate The expected annual return rate (e.g., 0.12 for 12%).
 * @param {number} annualStepUpRate The annual increase in SIP (e.g., 0.10 for 10%).
 * @returns {number} The required initial monthly SIP.
 */
export const calculateStepUpSIP = (targetAmount, yearsToGoal, annualReturnRate, annualStepUpRate) => {
  if (yearsToGoal <= 0 || annualReturnRate <= 0) {
    return yearsToGoal > 0 ? targetAmount / (yearsToGoal * 12) : targetAmount;
  }

  const monthlyReturnRate = annualReturnRate / 12;
  const numberOfMonths = yearsToGoal * 12;

  // Formula for Future Value of Step-Up SIP (approximate, more complex exact formula exists)
  // This is a simplified approach, assuming annual step-up.
  // A more precise calculation would involve summing up future values of each year's SIP series.
  // For simplicity, we can iterate year by year.

  let sumOfFutureValuesOfEachYearSIP = 0;
  let initialMonthlySIP = 1; // Assume an initial SIP of 1 to find the multiplier

  for (let year = 0; year < yearsToGoal; year++) {
    const currentYearSIP = initialMonthlySIP * Math.pow(1 + annualStepUpRate, year);
    const remainingMonths = (yearsToGoal - year) * 12;
    
    // FV of current year's SIP for remaining period
    const factor = (Math.pow(1 + monthlyReturnRate, remainingMonths) - 1) / monthlyReturnRate;
    sumOfFutureValuesOfEachYearSIP += currentYearSIP * 12 * (factor * (1 + monthlyReturnRate)); // Approx. FV of annual SIP
  }

  // If sumOfFutureValuesOfEachYearSIP is 0, it means no growth or no time,
  // so we fall back to simple SIP or direct amount.
  if (sumOfFutureValuesOfEachYearSIP === 0) {
    return calculateSIP(targetAmount, yearsToGoal, annualReturnRate);
  }

  // Scale the initialMonthlySIP based on the target amount
  const requiredInitialMonthlySIP = targetAmount / sumOfFutureValuesOfEachYearSIP;

  return requiredInitialMonthlySIP > 0 ? requiredInitialMonthlySIP : 0;
};

/**
 * Calculates the required lumpsum investment to reach a target amount.
 * @param {number} targetAmount The future value needed.
 * @param {number} yearsToGoal The number of years until the goal.
 * @param {number} annualReturnRate The expected annual return rate (e.g., 0.12 for 12%).
 * @returns {number} The required lumpsum amount.
 */
export const calculateLumpsum = (targetAmount, yearsToGoal, annualReturnRate) => {
  if (yearsToGoal <= 0) {
    return targetAmount; // If no time, lumpsum is the target amount
  }
  if (annualReturnRate <= 0) {
    return targetAmount; // If no return, lumpsum is the target amount
  }

  // FV = PV * (1 + r)^n
  // PV = FV / (1 + r)^n
  const lumpsum = targetAmount / Math.pow(1 + annualReturnRate, yearsToGoal);
  return lumpsum > 0 ? lumpsum : 0;
};
