import React from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";

const SipCalculatorInputs = ({
  monthlyContribution, // Changed from monthlyInvestment
  expectedReturnRate,
  timePeriod,
  onSharedStateChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        SIP Details
      </Typography>

      <Box sx={{ my: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography gutterBottom>Monthly Investment</Typography>
          <TextField
            size="small"
            value={monthlyContribution} // Changed from monthlyInvestment
            onChange={(e) => onSharedStateChange("monthlyContribution", Number(e.target.value))} // Changed from monthlyInvestment
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            placeholder="Enter monthly investment"
            sx={{ width: 120 }}
          />
        </Grid>
        <Slider
          value={monthlyContribution} // Changed from monthlyInvestment
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("monthlyContribution", val)} // Changed from monthlyInvestment
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
            placeholder="Enter return rate"
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
            placeholder="Enter time period"
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

export default SipCalculatorInputs;
