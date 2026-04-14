import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SwpCalculatorInputs from "./SwpCalculatorInputs"; // Import the new input component

const SwpCalculator = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { totalInvestment, withdrawalPerMonth, expectedReturnRate, timePeriod } = sharedState;

  useEffect(() => {
    calculateSwp();
  }, [totalInvestment, withdrawalPerMonth, expectedReturnRate, timePeriod]);

  const calculateSwp = () => {
    const P = totalInvestment;
    const W = withdrawalPerMonth;
    const n = timePeriod * 12; // months
    const i = expectedReturnRate / 100 / 12; // monthly rate
    
    let currentBalance = P;
    let totalWithdrawn = 0;
    let chartData = [];

    // SWP Calculation
    for (let month = 1; month <= n; month++) {
      if (currentBalance > 0) {
        // Interest earned for the month
        let interest = currentBalance * i;
        
        // Add interest to balance
        currentBalance += interest;
        
        // Subtract withdrawal
        let actualWithdrawal = Math.min(W, currentBalance);
        currentBalance -= actualWithdrawal;
        totalWithdrawn += actualWithdrawal;
      }
      
      // Add data points every 12 months (end of year)
      if (month % 12 === 0) {
        chartData.push({
          year: month / 12,
          invested: Math.round(P),
          withdrawn: Math.round(totalWithdrawn),
          total: Math.round(Math.max(0, currentBalance))
        });
      }
    }

    // Final calculations
    const finalBalance = Math.max(0, currentBalance);
    // Estimated Returns in SWP context = (Total Withdrawn + Final Balance) - Initial Investment
    const estimatedReturns = (totalWithdrawn + finalBalance) - P;

    onCalculate({
      investedAmount: Math.round(P),
      // To display logically in the same UI as SIP/Lumpsum:
      // "Estimated Returns" = Total earned above initial investment
      estimatedReturns: Math.round(estimatedReturns), 
      // "Total Value" = What's left at the end
      totalValue: Math.round(finalBalance),
      // We also want to pass totalWithdrawn, but the parent UI might not show it currently
      totalWithdrawn: Math.round(totalWithdrawn),
      chartData: chartData
    });
  };

  return (
    <Box>
      <SwpCalculatorInputs
        totalInvestment={totalInvestment}
        withdrawalPerMonth={withdrawalPerMonth}
        expectedReturnRate={expectedReturnRate}
        timePeriod={timePeriod}
        onSharedStateChange={onSharedStateChange}
      />
    </Box>
  );
};

export default SwpCalculator;
