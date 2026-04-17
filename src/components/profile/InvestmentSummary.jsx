import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const InvestmentSummary = ({ plans, targetAmount }) => {
  const totalInvested = plans.reduce(
    (sum, plan) => sum + (plan.investedAmount || 0),
    0,
  );

  const totalReturns = plans.reduce(
    (sum, plan) => sum + (plan.estimatedReturns || 0),
    0,
  );

  const totalValue = plans.reduce(
    (sum, plan) => sum + (plan.totalValue || 0),
    0,
  );

  const maxTimePeriod = plans.reduce(
    (max, plan) => Math.max(max, plan.timePeriod || 0),
    0,
  );

  const isMismatch = totalValue !== (targetAmount || 0); // Ensure targetAmount is treated as a number

  const formatAmount = (amount) =>
    `₹${(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Card sx={{ mt: 2, border: isMismatch ? "2px solid red" : "none" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Investment Summary
        </Typography>
        {isMismatch && (
          <Typography color="error" variant="body2" gutterBottom>
            Warning: The total projected value does not match the target amount.
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" align="center">
              Invested
            </Typography>
            <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
              {formatAmount(totalInvested)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" align="center">
              Returns
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="success.main"
              sx={{ fontWeight: "bold" }}
            >
              {formatAmount(totalReturns)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" align="center">
              Total Value
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color={isMismatch ? "error" : "primary.main"}
              sx={{ fontWeight: "bold" }}
            >
              {formatAmount(totalValue)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" align="center">
              Time Period
            </Typography>
            <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
              {maxTimePeriod} years
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;
