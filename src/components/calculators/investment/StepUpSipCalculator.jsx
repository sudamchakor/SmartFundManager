import React, { useEffect } from "react";
import { Box } from "@mui/material";
import StepUpSipCalculatorInputs from "./StepUpSipCalculatorInputs"; // Import the new input component

const StepUpSipCalculator = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { monthlyInvestment, stepUpPercentage, expectedReturnRate, timePeriod } = sharedState;

  useEffect(() => {
    calculateStepUpSip();
  }, [monthlyInvestment, stepUpPercentage, expectedReturnRate, timePeriod]);

  const calculateStepUpSip = () => {
    let currentMonthlySIP = monthlyInvestment;
    const i = expectedReturnRate / 100 / 12; // Monthly rate of return
    
    let totalInvestedAmount = 0;
    let finalCorpus = 0;
    let chartData = [];

    for (let year = 1; year <= timePeriod; year++) {
      // For this specific year, we invest currentMonthlySIP every month
      let yearlyInvested = currentMonthlySIP * 12;
      totalInvestedAmount += yearlyInvested;

      // The corpus from previous years grows by 1 year of interest
      finalCorpus = finalCorpus * Math.pow(1 + i, 12);
      
      // Add the maturity of this year's SIP
      let yearlySipMaturity = currentMonthlySIP * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
      finalCorpus += yearlySipMaturity;

      chartData.push({
        year: year,
        invested: Math.round(totalInvestedAmount),
        returns: Math.round(finalCorpus - totalInvestedAmount),
        total: Math.round(finalCorpus)
      });

      // Step up the SIP amount for next year
      currentMonthlySIP += currentMonthlySIP * (stepUpPercentage / 100);
    }

    const estimatedReturns = finalCorpus - totalInvestedAmount;

    onCalculate({
      investedAmount: Math.round(totalInvestedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(finalCorpus),
      chartData: chartData
    });
  };

  return (
    <Box>
      <StepUpSipCalculatorInputs
        monthlyInvestment={monthlyInvestment}
        stepUpPercentage={stepUpPercentage}
        expectedReturnRate={expectedReturnRate}
        timePeriod={timePeriod}
        onSharedStateChange={onSharedStateChange}
      />
    </Box>
  );
};

export default StepUpSipCalculator;
