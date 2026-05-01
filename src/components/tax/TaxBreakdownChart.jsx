import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Box, Typography, useTheme, alpha } from "@mui/material";

const TaxBreakdownChart = ({ taxComparison, calculatedSalary }) => {
  const theme = useTheme();

  const barData = [
    {
      name: "Old Regime",
      "Basic Tax": taxComparison.oldRegime.tax,
      "Education Cess": taxComparison.oldRegime.tax * 0.04,
      Surcharge: 0, // Assuming no surcharge for now
    },
    {
      name: "New Regime",
      "Basic Tax": taxComparison.newRegime.tax,
      "Education Cess": taxComparison.newRegime.tax * 0.04,
      Surcharge: 0, // Assuming no surcharge for now
    },
  ];

  const totalTax = taxComparison.oldRegime.tax + taxComparison.newRegime.tax;
  const takeHomePay =
    calculatedSalary.annual.totalIncome -
    totalTax -
    calculatedSalary.annual.pf;

  const pieData = [
    { name: "Take Home Pay", value: takeHomePay },
    { name: "Total Tax", value: totalTax },
    { name: "Forced Savings (PF)", value: calculatedSalary.annual.pf },
  ];

  const COLORS = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tax Breakdown
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="subtitle1" align="center">
            Regime Comparison
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Basic Tax" stackId="a" fill={theme.palette.primary.main} />
              <Bar
                dataKey="Education Cess"
                stackId="a"
                fill={alpha(theme.palette.primary.main, 0.5)}
              />
              <Bar
                dataKey="Surcharge"
                stackId="a"
                fill={alpha(theme.palette.primary.main, 0.2)}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography variant="subtitle1" align="center">
            Gross Income Composition
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default TaxBreakdownChart;
