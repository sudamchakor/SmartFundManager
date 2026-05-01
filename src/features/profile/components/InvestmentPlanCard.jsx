import React, { useCallback } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  alpha,
  useTheme,
  Stack,
  Divider, // Imported Divider to fix the gray box issue
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SipCalculatorForm from "../../investment/tabs/SipCalculatorForm";
import LumpsumCalculatorForm from "../../investment/tabs/LumpsumCalculatorForm";
import StepUpSipCalculatorForm from "../../investment/tabs/StepUpSipCalculatorForm";
import SwpCalculatorForm from "../../investment/tabs/SwpCalculatorForm";
import FdCalculatorForm from "../../investment/tabs/FdCalculatorForm";

const DataPoint = ({ label, value, color }) => (
  <Stack spacing={0.2} sx={{ flex: 1 }}>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 800,
        color: "text.disabled",
        textTransform: "uppercase",
        fontSize: "0.65rem",
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontWeight: 900, color: color || "text.primary" }}
    >
      {value}
    </Typography>
  </Stack>
);

const InvestmentPlanCard = ({
  plan,
  handlePlanChange,
  handleRemovePlan,
  formatAmount,
  targetAmount,
}) => {
  const theme = useTheme();

  const handleCalculate = useCallback(
    (results) => {
      if (!results) return;

      const investedAmount =
        results.totalInvestment ??
        results.principal ??
        results.investedAmount ??
        0;
      const estimatedReturns =
        results.totalReturns ??
        results.totalInterest ??
        results.estimatedReturns ??
        0;
      const totalValue =
        results.futureValue ??
        results.maturityAmount ??
        results.totalValue ??
        0;

      let monthlyContribution = 0;
      if (plan.type === "sip" || plan.type === "stepUpSip") {
        monthlyContribution =
          results.monthlyContribution ??
          plan.monthlyContribution ??
          plan.amount ??
          0;
      }

      if (plan.investedAmount !== investedAmount)
        handlePlanChange(plan.id, "investedAmount", investedAmount);
      if (plan.estimatedReturns !== estimatedReturns)
        handlePlanChange(plan.id, "estimatedReturns", estimatedReturns);
      if (plan.totalValue !== totalValue)
        handlePlanChange(plan.id, "totalValue", totalValue);
      if (plan.monthlyContribution !== monthlyContribution)
        handlePlanChange(plan.id, "monthlyContribution", monthlyContribution);
    },
    [
      plan.id,
      plan.type,
      plan.monthlyContribution,
      plan.amount,
      plan.investedAmount,
      plan.estimatedReturns,
      plan.totalValue,
      handlePlanChange,
    ],
  );

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
        p: 2,
        mb: 2,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        position: "relative",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: alpha(theme.palette.primary.main, 0.2) },
      }}
    >
      {/* 1. Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
            Plan Type
          </InputLabel>
          <Select
            value={plan.type}
            label="Plan Type"
            onChange={(e) => handlePlanChange(plan.id, "type", e.target.value)}
            sx={{ borderRadius: 2, fontWeight: 700, fontSize: "0.85rem" }}
          >
            <MenuItem value="sip">SIP</MenuItem>
            <MenuItem value="lumpsum">Lumpsum</MenuItem>
            <MenuItem value="stepUpSip">Step-Up SIP</MenuItem>
            <MenuItem value="swp">SWP</MenuItem>
            <MenuItem value="fd">Fixed Deposit</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          size="small"
          onClick={() => handleRemovePlan(plan.id)}
          sx={{
            color: theme.palette.error.main,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* 2. Technical Summary (Status Bar Style) */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            fontWeight: 700,
            color: "primary.main",
            textTransform: "uppercase",
            fontSize: "0.65rem",
          }}
        >
          {plan.details || "Configure Strategy Parameters"}
        </Typography>

        {/* FIXED: Using standard MUI vertical divider to completely remove the gray blocks */}
        <Stack
          direction="row"
          spacing={2}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: alpha(theme.palette.divider, 0.2) }}
            />
          }
        >
          <DataPoint
            label="Invested"
            value={`₹${formatAmount(plan.investedAmount)}`}
          />
          <DataPoint
            label="Returns"
            value={`₹${formatAmount(plan.estimatedReturns)}`}
            color={theme.palette.success.main}
          />
          <DataPoint
            label="Total Value"
            value={`₹${formatAmount(plan.totalValue)}`}
          />
        </Stack>
      </Box>

      {/* 3. Calculator Form Area */}
      <Box
        sx={{
          "& .MuiTextField-root": { mb: 1.5 },
          "& .MuiTypography-root": { fontWeight: 700 }, // Ensures labels in sub-forms are bold
        }}
      >
        {plan.type === "sip" && (
          <SipCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
            targetAmount={targetAmount}
          />
        )}
        {plan.type === "lumpsum" && (
          <LumpsumCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
            targetAmount={targetAmount}
          />
        )}
        {plan.type === "stepUpSip" && (
          <StepUpSipCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
            targetAmount={targetAmount}
          />
        )}
        {plan.type === "swp" && (
          <SwpCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
            targetAmount={targetAmount}
          />
        )}
        {plan.type === "fd" && (
          <FdCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
            targetAmount={targetAmount}
          />
        )}
      </Box>
    </Box>
  );
};

export default InvestmentPlanCard;
