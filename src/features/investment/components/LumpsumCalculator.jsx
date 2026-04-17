import React, { useEffect } from "react";
import { Box } from "@mui/material";
import LumpsumCalculatorInputs from "./LumpsumCalculatorInputs"; // Import the new input component

const LumpsumCalculator = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { totalInvestment, expectedReturnRate, timePeriod } = sharedState;

  useEffect(() => {
    calculateLumpsum();
  }, [totalInvestment, expectedReturnRate, timePeriod]);

  const calculateLumpsum = () => {
    const P = totalInvestment;
    const r = expectedReturnRate / 100;
    const n = timePeriod;

    // Formula: A = P(1 + r)^n
    const totalValue = P * Math.pow(1 + r, n);
    const estimatedReturns = totalValue - P;

    let chartData = [];
    for (let year = 1; year <= timePeriod; year++) {
      let yearlyValue = P * Math.pow(1 + r, year);
      chartData.push({
        year: year,
        invested: Math.round(P),
        returns: Math.round(yearlyValue - P),
        total: Math.round(yearlyValue)
      });
    }

    onCalculate({
      investedAmount: Math.round(P),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      chartData: chartData
    });
  };

  return (
    <Box>
      <LumpsumCalculatorInputs
        totalInvestment={totalInvestment}
        expectedReturnRate={expectedReturnRate}
        timePeriod={timePeriod}
        onSharedStateChange={onSharedStateChange}
      />
    </Box>
  );
};

export default LumpsumCalculator;
