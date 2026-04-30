import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const FundingStatus = ({ targetAmount, currentCorpus, currency }) => {
  const fundedPercentage = targetAmount > 0 ? (currentCorpus / targetAmount) * 100 : 0;
  const remainingAmount = Math.max(0, targetAmount - currentCorpus);

  const getProgressBarColor = (percentage) => {
    if (percentage < 25) return "error";
    if (percentage >= 25 && percentage < 75) return "warning";
    return "success";
  };

  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Funded Status
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.main" }}>
          {formatCurrency(remainingAmount)} more to reach target
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={fundedPercentage}
        color={getProgressBarColor(fundedPercentage)}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default FundingStatus;
