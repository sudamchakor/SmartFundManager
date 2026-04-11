import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEmiContext } from "../../context/EmiContext";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const BarChartComponent = () => {
  const { calculatedValues, currency } = useEmiContext();
  const theme = useTheme();

  // Sample data for bar chart - perhaps monthly payments or something
  const data = calculatedValues.schedule.slice(0, 12).map((row, index) => ({
    month: row.month,
    principal: row.principal,
    interest: row.interest,
    prepayment: row.prepayment,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Monthly Payment Breakdown (First 12 Months)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${currency} ${value.toFixed(2)}`, ""]} />
          <Bar dataKey="principal" stackId="a" fill={theme.palette.primary.main} />
          <Bar dataKey="interest" stackId="a" fill={theme.palette.secondary.main} />
          <Bar dataKey="prepayment" stackId="a" fill={theme.palette.success.main} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartComponent;
