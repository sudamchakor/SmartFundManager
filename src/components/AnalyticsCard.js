import React from "react";
import { Grid, Paper } from "@mui/material";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";

const AnalyticsCard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="calculator-paper">
          <PieChartComponent />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="calculator-paper">
          <BarChartComponent />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AnalyticsCard;