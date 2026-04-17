import React from "react";
import { Paper, Typography, Box, Grid, Divider, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectExpenses,
  selectPrepayments,
  selectCurrency,
} from "../../../store/emiSlice";
import { selectCalculatedValues } from "../utils/emiCalculator"; // Corrected import path
import { useTheme } from "@mui/material/styles";
import "./TotalMonthlyPayment.scss";

const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TotalMonthlyPayment = () => {
  const calculatedValues = useSelector(selectCalculatedValues);
  const expenses = useSelector(selectExpenses);
  const currency = useSelector(selectCurrency);
  const prepayments = useSelector(selectPrepayments); // Although prepayments are not directly used here, keeping it for consistency if needed later.

  const theme = useTheme();

  const emi = Math.round(calculatedValues.emi || 0);
  const monthlyTaxes = Math.round((calculatedValues.taxesYearlyInRs || 0) / 12);
  const monthlyInsurance = Math.round(
    (calculatedValues.homeInsYearlyInRs || 0) / 12,
  );
  const monthlyMaintenance = Math.round(expenses.maintenance || 0);

  // Calculate average monthly prepayment
  const tenureInMonths = calculatedValues.tenureInMonths || 1;
  const averageMonthlyPrepayment = Math.round((calculatedValues.totalPrepayments || 0) / tenureInMonths) || 0;

  const totalMonthlyPayment =
    emi + monthlyTaxes + monthlyInsurance + monthlyMaintenance + averageMonthlyPrepayment;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Total Monthly Payment Calculation
      </Typography>
      <Box className="total-monthly-box">
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="body1">Monthly EMI</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {formatNumberWithCommas(emi)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Property Taxes</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {formatNumberWithCommas(monthlyTaxes)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Home Insurance</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {formatNumberWithCommas(monthlyInsurance)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Maintenance</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {formatNumberWithCommas(monthlyMaintenance)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              className="total-monthly-divider"
              style={{ borderStyle: "dotted", width: '100%' }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1">Prepayments</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" align="right">
              {currency}
              {formatNumberWithCommas(averageMonthlyPrepayment)}
            </Typography>
          </Grid>
        </Grid>

        <Divider className="total-monthly-divider" sx={{ my: 2, width: '100%' }} />

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6">Total Monthly Payment</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="right" color="primary">
              {currency}
              {formatNumberWithCommas(totalMonthlyPayment)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TotalMonthlyPayment;
