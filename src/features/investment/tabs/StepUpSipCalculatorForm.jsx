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
import { SettingsInputComponent as SettingsIcon } from "@mui/icons-material";

const StepUpSipCalculatorForm = ({
  onCalculate,
  sharedState,
  onSharedStateChange,
}) => {
  const theme = useTheme();

  const {
    initialMonthlyInvestment,
    stepUpPercentage,
    expectedReturnRate,
    timePeriod,
  } = sharedState;

  const calculateStepUpSip = useCallback(() => {
    const P = initialMonthlyInvestment || 0;
    const annualIncrease = stepUpPercentage || 0;
    const years = timePeriod || 0;
    const annualRate = expectedReturnRate || 0;
    const i = annualRate / 100 / 12;
    const r = annualIncrease / 100;

    let totalValue = 0;
    let totalInvestment = 0;
    let chartData = [];

    if (P > 0 && years > 0) {
      let currentInvestment = P;
      for (let year = 1; year <= years; year++) {
        let yearlyInvestment = 0;
        for (let month = 1; month <= 12; month++) {
          totalValue = totalValue * (1 + i) + currentInvestment;
          yearlyInvestment += currentInvestment;
        }
        totalInvestment += yearlyInvestment;
        currentInvestment *= 1 + r;

        chartData.push({
          year: year,
          invested: Math.round(totalInvestment),
          returns: Math.round(totalValue - totalInvestment),
          total: Math.round(totalValue),
        });
      }
    }

    onCalculate({
      investedAmount: Math.round(totalInvestment),
      estimatedReturns: Math.round(totalValue - totalInvestment),
      totalValue: Math.round(totalValue),
      initialMonthlyInvestment: initialMonthlyInvestment,
      chartData: chartData,
    });
  }, [
    initialMonthlyInvestment,
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
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <SettingsIcon
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

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Initial Monthly SIP</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={initialMonthlyInvestment}
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
          value={initialMonthlyInvestment}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) =>
            onSharedStateChange("monthlyContribution", val)
          }
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Annual Step-Up (%)</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={stepUpPercentage}
              onChange={(e) =>
                onSharedStateChange(
                  "stepUpPercentage",
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
          max={25}
          step={1}
          onChange={(e, val) => onSharedStateChange("stepUpPercentage", val)}
          color="secondary"
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
          }}
        />
      </Box>

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
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
          }}
        />
      </Box>

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
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
          }}
        />
      </Box>
    </Box>
  );
};

export default StepUpSipCalculatorForm;
