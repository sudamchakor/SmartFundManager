import React from "react";
import { Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCalculatedValues } from "../utils/emiCalculator";
import { selectCurrency, selectExpenses } from "../../../store/emiSlice";
import { formatCurrency } from "../../../utils/formatting";
import DetailRow from "../../../components/common/DetailRow";

const TotalMonthlyPayment = () => {
  const theme = useTheme();
  const calculatedValues = useSelector(selectCalculatedValues);
  const currency = useSelector(selectCurrency);
  const expenses = useSelector(selectExpenses);

  const emi = Math.round(calculatedValues.emi || 0);
  const monthlyTaxes = Math.round((calculatedValues.taxesYearlyInRs || 0) / 12);
  const monthlyInsurance = Math.round(
    (calculatedValues.homeInsYearlyInRs || 0) / 12,
  );
  const monthlyMaintenance = Math.round(expenses.maintenance || 0);
  const tenureInMonths = calculatedValues.tenureInMonths || 1;
  const averageMonthlyPrepayment =
    Math.round((calculatedValues.totalPrepayments || 0) / tenureInMonths) || 0;

  const totalMonthlyPayment =
    emi +
    monthlyTaxes +
    monthlyInsurance +
    monthlyMaintenance +
    averageMonthlyPrepayment;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box", // Essential to prevent overflow
        overflow: "hidden",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="caption"
          sx={{
            mb: 1,
            px: 1,
            fontWeight: 800,
            color: "text.disabled",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          Breakdown
        </Typography>
        <Stack spacing={0.5} sx={{ width: "100%" }}>
          <DetailRow
            label="Monthly EMI"
            value={formatCurrency(emi, currency)}
          />
          <DetailRow
            label="Property Taxes"
            value={formatCurrency(monthlyTaxes, currency)}
          />
          <DetailRow
            label="Home Insurance"
            value={formatCurrency(monthlyInsurance, currency)}
          />
          <DetailRow
            label="Maintenance"
            value={formatCurrency(monthlyMaintenance, currency)}
          />
          <DetailRow
            label="Avg. Prepayment"
            value={formatCurrency(averageMonthlyPrepayment, currency)}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 3,
          p: 2.5, // Added padding so text doesn't touch the edges
          borderRadius: 4,
          textAlign: "center",
          bgcolor: theme.palette.primary.main,
          color: "primary.contrastText",
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
          width: "100%",
          boxSizing: "border-box", // Critical for containment
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            opacity: 0.9,
            display: "block",
            mb: 0.5,
            letterSpacing: 1,
          }}
        >
          Total Monthly Outflow
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          {formatCurrency(totalMonthlyPayment, currency)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TotalMonthlyPayment;
