import {
  calculateSip,
  calculateLumpsum,
  calculateStepUpSip,
  calculateSwp,
  calculateFd,
} from "./investmentCalculations";

// Helper function to generate plan summary
export const generatePlanSummary = (plan) => {
  const formatAmount = (amount) =>
    (amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const formatRate = (rate) => rate || 0;
  const formatTime = (time) => time || 0;

  switch (plan.type) {
    case "sip":
      return `Monthly ₹${formatAmount(plan.monthlyInvestment)} for ${formatTime(
        plan.timePeriod,
      )} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "lumpsum":
      return `One-time ₹${formatAmount(
        plan.totalInvestment,
      )} for ${formatTime(plan.timePeriod)} years @ ${formatRate(
        plan.expectedReturnRate,
      )}% p.a.`;
    case "stepUpSip":
      return `Monthly ₹${formatAmount(
        plan.monthlyInvestment,
      )} with ${formatRate(
        plan.stepUpPercentage,
      )}% annual step-up for ${formatTime(
        plan.timePeriod,
      )} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "swp":
      return `Start with ₹${formatAmount(
        plan.totalInvestment,
      )}, withdraw ₹${formatAmount(
        plan.withdrawalPerMonth,
      )}/month for ${formatTime(plan.timePeriod)} years @ ${formatRate(
        plan.expectedReturnRate,
      )}% p.a.`;
    case "fd":
      return `One-time ₹${formatAmount(
        plan.principalAmount,
      )} for ${formatTime(plan.timePeriod)} years @ ${formatRate(
        plan.interestRate,
      )}% p.a. (${plan.compoundingFrequency} Compounded)`;
    default:
      return "Unknown Plan Type";
  }
};

// This function now ONLY creates the default structure, without calculations.
export const getDefaultPlanState = (
  type,
  targetAmount = 0,
  timePeriod = 10,
  currentYear,
  goal,
) => {
  const defaultTimePeriodFromGoal = goal?.targetYear
    ? goal.targetYear - currentYear
    : 10;
  const effectiveTimePeriod = Math.max(
    1,
    timePeriod > 0 ? timePeriod : defaultTimePeriodFromGoal,
  );

  const baseAmountForSip = Math.max(
    500,
    Math.round(targetAmount / (effectiveTimePeriod * 12 * 2)),
  );
  const baseAmountForLumpsum = Math.max(500, Math.round(targetAmount / 2));
  const baseAmountForFd = Math.max(500, Math.round(targetAmount / 2));

  let plan = {};

  switch (type) {
    case "sip":
      plan = {
        monthlyInvestment: baseAmountForSip,
        expectedReturnRate: 12,
        timePeriod: effectiveTimePeriod,
        isSafe: false,
      };
      break;
    case "lumpsum":
      plan = {
        totalInvestment: baseAmountForLumpsum,
        expectedReturnRate: 12,
        timePeriod: effectiveTimePeriod,
        isSafe: false,
      };
      break;
    case "stepUpSip":
      plan = {
        monthlyInvestment: baseAmountForSip,
        stepUpPercentage: 10,
        expectedReturnRate: 12,
        timePeriod: effectiveTimePeriod,
        isSafe: false,
      };
      break;
    case "swp":
      plan = {
        totalInvestment: baseAmountForLumpsum,
        withdrawalPerMonth: Math.max(
          500,
          Math.round(baseAmountForLumpsum / (effectiveTimePeriod * 12)),
        ),
        expectedReturnRate: 8,
        timePeriod: effectiveTimePeriod,
        isSafe: false,
      };
      break;
    case "fd":
      plan = {
        principalAmount: baseAmountForFd,
        interestRate: 7,
        timePeriod: effectiveTimePeriod,
        compoundingFrequency: "annually",
        isSafe: true,
      };
      break;
    default:
      plan = {
        monthlyInvestment: baseAmountForSip,
        expectedReturnRate: 12,
        timePeriod: effectiveTimePeriod,
        isSafe: false,
      };
      break;
  }
  return { id: Date.now().toString(), type, ...plan };
};

// This function takes a plan and returns it with all calculated values.
export const calculatePlanResults = (plan) => {
  let result = {};
  let investedAmount = 0;
  let estimatedReturns = 0;
  let totalValue = 0;
  let monthlyContribution = 0;

  switch (plan.type) {
    case "sip":
      result = calculateSip(
        plan.monthlyInvestment,
        plan.expectedReturnRate,
        plan.timePeriod,
      );
      monthlyContribution = plan.monthlyInvestment;
      break;
    case "lumpsum":
      result = calculateLumpsum(
        plan.totalInvestment,
        plan.expectedReturnRate,
        plan.timePeriod,
      );
      monthlyContribution = plan.totalInvestment / (plan.timePeriod * 12);
      break;
    case "stepUpSip":
      result = calculateStepUpSip(
        plan.monthlyInvestment,
        plan.expectedReturnRate,
        plan.timePeriod,
        plan.stepUpPercentage,
      );
      monthlyContribution = plan.monthlyInvestment;
      break;
    case "swp":
      result = calculateSwp(
        plan.totalInvestment,
        plan.expectedReturnRate,
        plan.timePeriod,
        plan.withdrawalPerMonth,
      );
      break;
    case "fd":
      result = calculateFd(
        plan.principalAmount,
        plan.interestRate,
        plan.timePeriod,
        plan.compoundingFrequency,
      );
      monthlyContribution = plan.principalAmount / (plan.timePeriod * 12);
      break;
    default:
      break;
  }

  investedAmount = result.investedAmount || result.principal || 0;
  estimatedReturns = result.estimatedReturns || 0;
  totalValue = result.totalValue || 0;

  return {
    ...plan,
    investedAmount,
    estimatedReturns,
    totalValue,
    monthlyContribution,
    amount: totalValue, // This is the crucial field for the parent component
    details: generatePlanSummary({ ...plan, ...result }),
  };
};
