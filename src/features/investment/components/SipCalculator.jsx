import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SipCalculatorInputs from "./SipCalculatorInputs"; // Import the new input component

const SipCalculator = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { monthlyContribution, expectedReturnRate, timePeriod } = sharedState; // Changed to monthlyContribution

  useEffect(() => {
    calculateSip();
  }, [monthlyContribution, expectedReturnRate, timePeriod]); // Changed to monthlyContribution

  const calculateSip = () => {
    const P = monthlyContribution; // Changed to monthlyContribution
    const years = timePeriod;
    const annualRate = expectedReturnRate / 100;

    const n = years * 12; // Total number of months
    const i = annualRate / 12; // Monthly rate of return

    let totalValue = 0;
    if (i > 0) {
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      totalValue = P * n; // Simple sum if rate is 0
    }

    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    // Generate data for chart
    let chartData = [];
    let currentInvested = 0;

    for (let year = 1; year <= years; year++) {
      currentInvested = P * year * 12; // Total invested up to this year
      const months = year * 12;
      let yearlyTotalValue = 0;
      if (i > 0) {
        yearlyTotalValue = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      } else {
        yearlyTotalValue = P * months;
      }

      chartData.push({
        year: year,
        invested: Math.round(currentInvested),
        returns: Math.round(yearlyTotalValue - currentInvested),
        total: Math.round(yearlyTotalValue)
      });
    }

    onCalculate({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      chartData: chartData
    });
  };

  return (
    <Box>
      <SipCalculatorInputs
        monthlyContribution={monthlyContribution} // Changed to monthlyContribution
        expectedReturnRate={expectedReturnRate}
        timePeriod={timePeriod}
        onSharedStateChange={onSharedStateChange}
      />
    </Box>
  );
};

export default SipCalculator;
