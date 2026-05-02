import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { selectCalculatedValues } from "../../features/emiCalculator/utils/emiCalculator";
import { selectExpenses, selectCurrency } from "../../store/emiSlice";
import { Box, Typography, Grid, Stack, alpha, useTheme } from "@mui/material";
import { formatCurrency } from "../../utils/formatting";
import DetailRow from "../common/DetailRow";

const PieChartComponent = () => {
  const theme = useTheme();
  const calculatedValues = useSelector(selectCalculatedValues);
  const expenses = useSelector(selectExpenses);
  const currency = useSelector(selectCurrency);

  // Strictly using Theme Palette Colors
  const COLORS = [
    theme.palette.primary.main, // Initial Costs
    theme.palette.success.main, // Principal
    theme.palette.warning.main, // Prepayments
    theme.palette.error.main, // Interest
    theme.palette.info.main, // Taxes & Maintenance
  ];

  if (!calculatedValues?.schedule?.length) {
    return (
      <Typography color="text.disabled" sx={{ p: 2 }}>
        No data available for breakdown
      </Typography>
    );
  }

  // Data Aggregation logic
  const downPaymentFees =
    calculatedValues.marginInRs +
    calculatedValues.feesInRs +
    calculatedValues.oneTimeInRs;
  const principal = calculatedValues.totalPrincipal;
  const prepayments = calculatedValues.totalPrepayments;
  const interest = calculatedValues.totalInterest;
  const taxesInsMaint =
    calculatedValues.taxesYearlyInRs * (calculatedValues.schedule.length / 12) +
    calculatedValues.homeInsYearlyInRs *
      (calculatedValues.schedule.length / 12) +
    expenses.maintenance * calculatedValues.schedule.length;

  const chartData = [
    { name: "Initial Costs", value: downPaymentFees, color: COLORS[0] },
    { name: "Principal", value: principal, color: COLORS[1] },
    { name: "Prepayments", value: prepayments, color: COLORS[2] },
    { name: "Interest", value: interest, color: COLORS[3] },
    { name: "Taxes & Maint", value: taxesInsMaint, color: COLORS[4] },
  ].filter((d) => d.value > 0);

  return (
    <Grid container spacing={2} alignItems="center">
      {/* Donut Chart Side */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            height: { xs: 280, md: 320 },
            width: "100%",
            position: "relative",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="70%" // Thinner donut for cleaner look
                outerRadius="90%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => formatCurrency(val, currency)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: theme.shadows[10],
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: "blur(4px)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Summary Text */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Total Cost
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: -0.5,
              }}
            >
              {formatCurrency(calculatedValues.totalPayments, currency)}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Legend Side */}
      <Grid item xs={12} md={6}>
        <Stack spacing={0.25}>
          <DetailRow
            label="Down Payment & Fees"
            value={formatCurrency(downPaymentFees, currency)}
            indicatorColor={COLORS[0]}
          />
          <DetailRow
            label="Total Principal"
            value={formatCurrency(principal, currency)}
            indicatorColor={COLORS[1]}
          />
          <DetailRow
            label="Total Prepayments"
            value={formatCurrency(prepayments, currency)}
            indicatorColor={COLORS[2]}
          />
          <DetailRow
            label="Total Interest"
            value={formatCurrency(interest, currency)}
            indicatorColor={COLORS[3]}
          />
          <DetailRow
            label="Taxes & Maintenance"
            value={formatCurrency(taxesInsMaint, currency)}
            indicatorColor={COLORS[4]}
          />

          {/* Grand Total Highlight */}
          <Box sx={{ pt: 1.5, mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900, textTransform: "uppercase" }}
              >
                Grand Total
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 900, color: "primary.main" }}
              >
                {formatCurrency(calculatedValues.totalPayments, currency)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PieChartComponent;
