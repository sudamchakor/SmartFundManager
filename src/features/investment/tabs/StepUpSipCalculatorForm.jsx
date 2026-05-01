import React, { useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Grid,
  InputAdornment,
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import { QueryStats as StepUpIcon } from "@mui/icons-material";

const StepUpSipCalculatorForm = ({
  onCalculate,
  sharedState,
  onSharedStateChange,
}) => {
  const theme = useTheme();
  const {
    monthlyContribution,
    stepUpPercentage,
    expectedReturnRate,
    timePeriod,
  } = sharedState;

  const calculateStepUpSip = useCallback(() => {
    let currentMonthlySIP = monthlyContribution;
    const i = expectedReturnRate / 100 / 12;

    let totalInvestedAmount = 0;
    let finalCorpus = 0;
    let chartData = [];

    for (let year = 1; year <= timePeriod; year++) {
      let yearlyInvested = currentMonthlySIP * 12;
      totalInvestedAmount += yearlyInvested;

      // Compound existing corpus for the year
      finalCorpus = finalCorpus * Math.pow(1 + i, 12);

      // Add maturity of this year's SIP contributions
      let yearlySipMaturity =
        currentMonthlySIP * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
      finalCorpus += yearlySipMaturity;

      chartData.push({
        year: year,
        invested: Math.round(totalInvestedAmount),
        returns: Math.round(finalCorpus - totalInvestedAmount),
        total: Math.round(finalCorpus),
      });

      currentMonthlySIP += currentMonthlySIP * (stepUpPercentage / 100);
    }

    onCalculate({
      investedAmount: Math.round(totalInvestedAmount),
      estimatedReturns: Math.round(finalCorpus - totalInvestedAmount),
      totalValue: Math.round(finalCorpus),
      monthlyContribution: monthlyContribution,
      chartData: chartData,
      totalWithdrawn: 0,
    });
  }, [
    monthlyContribution,
    stepUpPercentage,
    expectedReturnRate,
    timePeriod,
    onCalculate,
  ]);

  useEffect(() => {
    calculateStepUpSip();
  }, [calculateStepUpSip]);

  const labelStyle = {
    fontWeight: 800,
    textTransform: "uppercase",
    fontSize: "0.65rem",
    color: "text.disabled",
    letterSpacing: 1,
    mb: 0.5,
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Internal Subsection Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <StepUpIcon
          sx={{
            fontSize: "1rem",
            color: theme.palette.primary.main,
            opacity: 0.8,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: "text.primary",
            textTransform: "uppercase",
          }}
        >
          Step-Up SIP Parameters
        </Typography>
      </Stack>

      {/* 1. Monthly Investment */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Initial Monthly SIP</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={monthlyContribution}
              onChange={(e) =>
                onSharedStateChange(
                  "monthlyContribution",
                  Number(e.target.value),
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ "& p": { fontWeight: 900, fontSize: "0.8rem" } }}
                  >
                    ₹
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={monthlyContribution}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("monthlyContribution", val)}
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
          }}
        />
      </Box>

      {/* 2. Annual Step-Up % */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Annual Increment (%)</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={stepUpPercentage}
              onChange={(e) =>
                onSharedStateChange("stepUpPercentage", Number(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ "& p": { fontWeight: 900, fontSize: "0.8rem" } }}
                  >
                    %
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={stepUpPercentage}
          min={1}
          max={50}
          step={1}
          onChange={(e, val) => onSharedStateChange("stepUpPercentage", val)}
          color="secondary"
          sx={{ py: 1, "& .MuiSlider-thumb": { width: 12, height: 12 } }}
        />
      </Box>

      {/* 3. Expected Return Rate */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Expected Returns (p.a)</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={expectedReturnRate}
              onChange={(e) =>
                onSharedStateChange(
                  "expectedReturnRate",
                  Number(e.target.value),
                )
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ "& p": { fontWeight: 900, fontSize: "0.8rem" } }}
                  >
                    %
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={expectedReturnRate}
          min={1}
          max={30}
          step={0.1}
          onChange={(e, val) => onSharedStateChange("expectedReturnRate", val)}
          color="success"
          sx={{ py: 1, "& .MuiSlider-thumb": { width: 12, height: 12 } }}
        />
      </Box>

      {/* 4. Time Period */}
      <Box sx={{ mb: 1 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Duration (Years)</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={timePeriod}
              onChange={(e) =>
                onSharedStateChange("timePeriod", Number(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ "& p": { fontWeight: 900, fontSize: "0.8rem" } }}
                  >
                    Yr
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={timePeriod}
          min={1}
          max={40}
          step={1}
          onChange={(e, val) => onSharedStateChange("timePeriod", val)}
          color="info"
          sx={{ py: 1, "& .MuiSlider-thumb": { width: 12, height: 12 } }}
        />
      </Box>
    </Box>
  );
};

export default StepUpSipCalculatorForm;
