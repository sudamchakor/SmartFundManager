import React from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";

const SwpCalculatorInputs = ({
  totalInvestment,
  withdrawalPerMonth,
  expectedReturnRate,
  timePeriod,
  onSharedStateChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        SWP Details
      </Typography>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Total Investment</Typography>
          <TextField
            size="small"
            value={totalInvestment}
            onChange={(e) => onSharedStateChange("totalInvestment", Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            sx={{ width: 140 }}
          />
        </Grid>
        <Slider
          value={totalInvestment}
          min={50000}
          max={50000000}
          step={10000}
          onChange={(e, val) => onSharedStateChange("totalInvestment", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Withdrawal per month</Typography>
          <TextField
            size="small"
            value={withdrawalPerMonth}
            onChange={(e) => onSharedStateChange("withdrawalPerMonth", Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            sx={{ width: 120 }}
          />
        </Grid>
        <Slider
          value={withdrawalPerMonth}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("withdrawalPerMonth", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Expected Return Rate (p.a)</Typography>
          <TextField
            size="small"
            value={expectedReturnRate}
            onChange={(e) => onSharedStateChange("expectedReturnRate", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ width: 100 }}
          />
        </Grid>
        <Slider
          value={expectedReturnRate}
          min={1}
          max={30}
          step={0.1}
          onChange={(e, val) => onSharedStateChange("expectedReturnRate", val)}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Time Period (Years)</Typography>
          <TextField
            size="small"
            value={timePeriod}
            onChange={(e) => onSharedStateChange("timePeriod", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">Yr</InputAdornment>,
            }}
            sx={{ width: 100 }}
          />
        </Grid>
        <Slider
          value={timePeriod}
          min={1}
          max={40}
          step={1}
          onChange={(e, val) => onSharedStateChange("timePeriod", val)}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default SwpCalculatorInputs;
