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
import { AccountBalanceWallet as SwpIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../../store/emiSlice";

const SwpCalculatorForm = ({
  onCalculate,
  sharedState,
  onSharedStateChange,
}) => {
  const theme = useTheme();
  const currency = useSelector(selectCurrency) || "₹";

  const {
    totalInvestment,
    withdrawalPerMonth,
    expectedReturnRate,
    timePeriod,
  } = sharedState;

  const calculateSwp = useCallback(() => {
    const P = parseFloat(totalInvestment) || 0;
    const W = parseFloat(withdrawalPerMonth) || 0;
    const n = (parseFloat(timePeriod) || 0) * 12;
    const i = (parseFloat(expectedReturnRate) || 0) / 100 / 12;

    let finalBalance = 0;
    let totalWithdrawn = 0;
    let totalInterest = 0;

    if (P > 0 && n > 0) {
      if (i > 0) {
        const r_plus_1_pow_n = Math.pow(1 + i, n);
        finalBalance = P * r_plus_1_pow_n - W * ((r_plus_1_pow_n - 1) / i);
      } else {
        // If rate is 0, it's just principal minus withdrawals
        finalBalance = P - W * n;
      }
      totalWithdrawn = W * n;
    }

    finalBalance = Math.max(0, finalBalance);
    totalInterest = finalBalance + totalWithdrawn - P;

    // Sanitize outputs to prevent NaN or Infinity
    const sanitizedResults = {
      investedAmount: isFinite(P) ? Math.round(P) : 0,
      estimatedReturns: isFinite(totalInterest) ? Math.round(totalInterest) : 0,
      totalValue: isFinite(finalBalance) ? Math.round(finalBalance) : 0,
      totalWithdrawn: isFinite(totalWithdrawn) ? Math.round(totalWithdrawn) : 0,
      chartData: [], // Chart data generation can be added back if needed
    };
    console.log("Sudam 1", sanitizedResults);

    onCalculate(sanitizedResults);
  }, [
    totalInvestment,
    withdrawalPerMonth,
    expectedReturnRate,
    timePeriod,
    onCalculate,
  ]);

  useEffect(() => {
    calculateSwp();
  }, [calculateSwp]);

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
        <SwpIcon
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
          SWP Configuration
        </Typography>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Initial Corpus</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={totalInvestment}
              onChange={(e) =>
                onSharedStateChange("totalInvestment", Number(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      "& p": {
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        color: "primary.main",
                      },
                    }}
                  >
                    {currency}
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                  textAlign: "right",
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={totalInvestment}
          min={50000}
          max={50000000}
          step={10000}
          onChange={(e, val) => onSharedStateChange("totalInvestment", val)}
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
            "& .MuiSlider-rail": { height: 4, opacity: 0.2 },
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Monthly Payout</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="standard"
              size="small"
              value={withdrawalPerMonth}
              onChange={(e) =>
                onSharedStateChange(
                  "withdrawalPerMonth",
                  Number(e.target.value),
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      "& p": {
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        color: "warning.main",
                      },
                    }}
                  >
                    {currency}
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: {
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  px: 1,
                  borderRadius: 1,
                  textAlign: "right",
                },
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <Slider
          value={withdrawalPerMonth}
          min={500}
          max={100000}
          step={500}
          onChange={(e, val) => onSharedStateChange("withdrawalPerMonth", val)}
          color="warning"
          sx={{
            py: 1,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-track": { height: 4 },
            "& .MuiSlider-rail": { height: 4, opacity: 0.2 },
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
                    sx={{
                      "& p": {
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        color: "success.main",
                      },
                    }}
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
                  textAlign: "right",
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
            "& .MuiSlider-rail": { height: 4, opacity: 0.2 },
          }}
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <Grid container spacing={1} alignItems="flex-end" sx={{ mb: 0.5 }}>
          <Grid item xs={7}>
            <Typography sx={labelStyle}>Payout Duration</Typography>
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
                    sx={{
                      "& p": {
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        color: "info.main",
                      },
                    }}
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
                  textAlign: "right",
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
            "& .MuiSlider-rail": { height: 4, opacity: 0.2 },
          }}
        />
      </Box>
    </Box>
  );
};

export default SwpCalculatorForm;
