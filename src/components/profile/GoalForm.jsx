import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon

import SliderInput from "../common/SliderInput";
import {
  calculateSip,
  calculateLumpsum,
  calculateStepUpSip,
  calculateSwp,
  calculateFd,
} from "./investmentCalculations";
import GeneratedInvestmentPlans from "./GeneratedInvestmentPlans";

// Import calculator forms
import SipCalculatorForm from "../calculators/investment/SipCalculatorForm";
import LumpsumCalculatorForm from "../calculators/investment/LumpsumCalculatorForm";
import StepUpSipCalculatorForm from "../calculators/investment/LumpsumCalculatorForm";
import SwpCalculatorForm from "../calculators/investment/SwpCalculatorForm";
import FdCalculatorForm from "../calculators/investment/FdCalculatorForm";

// Helper function to generate plan summary
const generatePlanSummary = (plan) => {
  const formatAmount = (amount) =>
    (amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const formatRate = (rate) => rate || 0;
  const formatTime = (time) => time || 0;

  switch (plan.type) {
    case "sip":
      return `Monthly ₹${formatAmount(plan.monthlyInvestment)} for ${formatTime(plan.timePeriod)} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "lumpsum":
      return `One-time ₹${formatAmount(plan.totalInvestment)} for ${formatTime(plan.timePeriod)} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "stepUpSip":
      return `Monthly ₹${formatAmount(plan.monthlyInvestment)} with ${formatRate(plan.stepUpPercentage)}% annual step-up for ${formatTime(plan.timePeriod)} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "swp":
      return `Start with ₹${formatAmount(plan.totalInvestment)}, withdraw ₹${formatAmount(plan.withdrawalPerMonth)}/month for ${formatTime(plan.timePeriod)} years @ ${formatRate(plan.expectedReturnRate)}% p.a.`;
    case "fd":
      return `One-time ₹${formatAmount(plan.principalAmount)} for ${formatTime(plan.timePeriod)} years @ ${formatRate(plan.interestRate)}% p.a. (${plan.compoundingFrequency} Compounded)`;
    default:
      return "Unknown Plan Type";
  }
};

export const GoalForm = ({ goal, currentYear, onSave }) => {
  const formatAmount = (amount) =>
    (amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // This function now ONLY creates the default structure, without calculations.
  const getDefaultPlanState = (type, targetAmount = 0, timePeriod = 10) => {
    const defaultTimePeriodFromGoal = goal?.targetYear
      ? goal.targetYear - currentYear
      : 10;
    const effectiveTimePeriod = Math.max(
      1,
      timePeriod > 0 ? timePeriod : defaultTimePeriodFromGoal,
    );

    const baseAmountForSip = Math.max(
      500,
      Math.round(targetAmount / (effectiveTimePeriod * 12 * 2)),
    );
    const baseAmountForLumpsum = Math.max(500, Math.round(targetAmount / 2));
    const baseAmountForFd = Math.max(500, Math.round(targetAmount / 2));

    let plan = {};

    switch (type) {
      case "sip":
        plan = {
          monthlyInvestment: baseAmountForSip,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
        break;
      case "lumpsum":
        plan = {
          totalInvestment: baseAmountForLumpsum,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
        break;
      case "stepUpSip":
        plan = {
          monthlyInvestment: baseAmountForSip,
          stepUpPercentage: 10,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
        break;
      case "swp":
        plan = {
          totalInvestment: baseAmountForLumpsum,
          withdrawalPerMonth: Math.max(
            500,
            Math.round(baseAmountForLumpsum / (effectiveTimePeriod * 12)),
          ),
          expectedReturnRate: 8,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
        break;
      case "fd":
        plan = {
          principalAmount: baseAmountForFd,
          interestRate: 7,
          timePeriod: effectiveTimePeriod,
          compoundingFrequency: "annually",
          isSafe: true,
        };
        break;
      default:
        plan = {
          monthlyInvestment: baseAmountForSip,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
        break;
    }
    return { id: Date.now().toString(), type, ...plan };
  };

  // This function takes a plan and returns it with all calculated values.
  const calculatePlanResults = (plan) => {
    let result = {};
    let investedAmount = 0;
    let estimatedReturns = 0;
    let totalValue = 0;
    let monthlyContribution = 0;

    switch (plan.type) {
      case "sip":
        result = calculateSip(
          plan.monthlyInvestment,
          plan.expectedReturnRate,
          plan.timePeriod,
        );
        monthlyContribution = plan.monthlyInvestment;
        break;
      case "lumpsum":
        result = calculateLumpsum(
          plan.totalInvestment,
          plan.expectedReturnRate,
          plan.timePeriod,
        );
        break;
      case "stepUpSip":
        result = calculateStepUpSip(
          plan.monthlyInvestment,
          plan.expectedReturnRate,
          plan.timePeriod,
          plan.stepUpPercentage,
        );
        monthlyContribution = plan.monthlyInvestment;
        break;
      case "swp":
        result = calculateSwp(
          plan.totalInvestment,
          plan.expectedReturnRate,
          plan.timePeriod,
          plan.withdrawalPerMonth,
        );
        break;
      case "fd":
        result = calculateFd(
          plan.principalAmount,
          plan.interestRate,
          plan.timePeriod,
          plan.compoundingFrequency,
        );
        break;
      default:
        break;
    }

    investedAmount = result.investedAmount || result.principal || 0;
    estimatedReturns = result.estimatedReturns || 0;
    totalValue = result.totalValue || 0;

    return {
      ...plan,
      investedAmount,
      estimatedReturns,
      totalValue,
      monthlyContribution,
      amount: totalValue, // This is the crucial field for the parent component
      details: generatePlanSummary({ ...plan, ...result }),
    };
  };

  const [editedGoal, setEditedGoal] = useState(() => {
    const initialTargetAmount = goal?.targetAmount || 0;
    const initialTimePeriod = goal?.targetYear
      ? goal.targetYear - currentYear
      : 10;

    if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
      return {
        ...goal,
        investmentPlans: goal.investmentPlans.map(calculatePlanResults),
      };
    }
    const defaultPlan = getDefaultPlanState(
      "sip",
      initialTargetAmount,
      initialTimePeriod,
    );
    return {
      ...goal,
      investmentPlans: [calculatePlanResults(defaultPlan)],
    };
  });

  const [generatedInvestmentPlans, setGeneratedInvestmentPlans] = useState([]);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
  const [totalEstimatedReturns, setTotalEstimatedReturns] = useState(0);
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [overallROI, setOverallROI] = useState(null);

  useEffect(() => {
    setEditedGoal((prevGoal) => {
      const currentTargetAmount = goal?.targetAmount || 0;
      const currentTimePeriod = goal?.targetYear
        ? goal.targetYear - currentYear
        : 10;

      let newEditedGoal;
      if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
        newEditedGoal = {
          ...goal,
          investmentPlans: goal.investmentPlans.map(calculatePlanResults),
        };
      } else {
        const defaultPlan = getDefaultPlanState(
          "sip",
          currentTargetAmount,
          currentTimePeriod,
        );
        newEditedGoal = {
          ...goal,
          investmentPlans: [calculatePlanResults(defaultPlan)],
        };
      }
      return newEditedGoal;
    });
  }, [goal, currentYear]);

  useEffect(() => {
    onSave(editedGoal);
  }, [editedGoal, onSave]);

  const handleAddPlan = () => {
    const currentTargetAmount = editedGoal.targetAmount || 0;
    const currentTimePeriod = editedGoal.targetYear
      ? editedGoal.targetYear - currentYear
      : 10;
    const newPlan = getDefaultPlanState(
      "sip",
      currentTargetAmount,
      currentTimePeriod,
    );
    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: [...prev.investmentPlans, calculatePlanResults(newPlan)],
    }));
  };

  const handleRemovePlan = (idToRemove) => {
    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: prev.investmentPlans.filter(
        (plan) => plan.id !== idToRemove,
      ),
    }));
  };

  const handlePlanChange = (id, field, value) => {
    setEditedGoal((prev) => {
      const updatedPlans = prev.investmentPlans.map((plan) => {
        if (plan.id === id) {
          let updatedPlan;
          if (field === "type") {
            const currentTargetAmount = prev.targetAmount || 0;
            const currentTimePeriod = prev.targetYear
              ? prev.targetYear - currentYear
              : 10;
            const newDefaultPlan = getDefaultPlanState(
              value,
              currentTargetAmount,
              currentTimePeriod,
            );
            updatedPlan = { ...newDefaultPlan, id: plan.id };
          } else {
            updatedPlan = { ...plan, [field]: value };
          }
          return calculatePlanResults(updatedPlan);
        }
        return plan;
      });
      return { ...prev, investmentPlans: updatedPlans };
    });
  };

  const handleGenerateInvestmentPlans = () => {
    const { targetAmount, targetYear } = editedGoal;
    if (!targetAmount || !targetYear || targetYear <= currentYear) {
      alert("Please set a valid Target Amount and Target Year.");
      return;
    }

    const totalTimePeriod = targetYear - currentYear;

    const planTypes = ["sip", "lumpsum", "stepUpSip", "swp", "fd"];
    const newPlans = planTypes.map((type) =>
      getDefaultPlanState(type, targetAmount, totalTimePeriod),
    );

    const updatedInvestmentPlans = newPlans.map(calculatePlanResults);

    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: updatedInvestmentPlans,
    }));
  };

  const totalTimePeriod = editedGoal.targetYear
    ? editedGoal.targetYear - currentYear
    : 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        padding: 3,
        overflowX: "hidden",
      }}
    >
      <Grid container xs={12} spacing={2}>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
            <TextField
              fullWidth
              label="Goal Name"
              size="small"
              value={editedGoal.name || ""}
              onChange={(e) =>
                setEditedGoal({ ...editedGoal, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
            <SliderInput
              label="Target Amount"
              value={Number(editedGoal.targetAmount) || 0}
              onChange={(val) =>
                setEditedGoal({ ...editedGoal, targetAmount: val })
              }
              min={0}
              max={100000000}
              step={100000}
              showInput={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
            <SliderInput
              label="Target Year"
              value={Number(editedGoal.targetYear) || currentYear}
              onChange={(val) =>
                setEditedGoal({ ...editedGoal, targetYear: val })
              }
              min={currentYear}
              max={currentYear + 50}
              step={1}
              showInput={true}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
            {editedGoal.targetAmount && editedGoal.targetYear > currentYear && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateInvestmentPlans}
                sx={{ mt: 3 }}
              >
                Generate Investment Plans
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Investment Plans
      </Typography>
      <Grid container spacing={2}>
        {" "}
        {/* Added Grid container here */}
        {editedGoal.investmentPlans.map((plan, index) => (
          <Grid item xs={6} key={plan.id}>
            {/* Changed to xs={12} for full width */}
            <Box
              sx={{ border: "1px solid #ddd", p: 2, mb: 2, borderRadius: 2 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Plan Type</InputLabel>
                    <Select
                      value={plan.type}
                      label="Plan Type"
                      onChange={(e) =>
                        handlePlanChange(plan.id, "type", e.target.value)
                      }
                    >
                      <MenuItem value="sip">SIP</MenuItem>
                      <MenuItem value="lumpsum">Lumpsum</MenuItem>
                      <MenuItem value="stepUpSip">Step-Up SIP</MenuItem>
                      <MenuItem value="swp">SWP</MenuItem>
                      <MenuItem value="fd">Fixed Deposit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ textAlign: "right" }}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemovePlan(plan.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight="bold">
                        {plan.details}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Invested:{" "}
                        <Typography component="span" fontWeight="bold" color="primary">
                          ₹{formatAmount(plan.investedAmount)}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Returns:{" "}
                        <Typography component="span" fontWeight="bold" color="success.main">
                          ₹{formatAmount(plan.estimatedReturns)}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total Value:{" "}
                        <Typography component="span" fontWeight="bold" color="text.primary">
                          ₹{formatAmount(plan.totalValue)}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mt: 2 }}>
                {plan.type === "sip" && (
                  <SipCalculatorForm
                    sharedState={plan}
                    onSharedStateChange={(field, value) =>
                      handlePlanChange(plan.id, field, value)
                    }
                    onCalculate={() => {}} // Placeholder, actual calculation happens on button click
                  />
                )}
                {plan.type === "lumpsum" && (
                  <LumpsumCalculatorForm
                    sharedState={plan}
                    onSharedStateChange={(field, value) =>
                      handlePlanChange(plan.id, field, value)
                    }
                    onCalculate={() => {}}
                  />
                )}
                {plan.type === "stepUpSip" && (
                  <StepUpSipCalculatorForm
                    sharedState={plan}
                    onSharedStateChange={(field, value) =>
                      handlePlanChange(plan.id, field, value)
                    }
                    onCalculate={() => {}}
                  />
                )}
                {plan.type === "swp" && (
                  <SwpCalculatorForm
                    sharedState={plan}
                    onSharedStateChange={(field, value) =>
                      handlePlanChange(plan.id, field, value)
                    }
                    onCalculate={() => {}}
                  />
                )}
                {plan.type === "fd" && (
                  <FdCalculatorForm
                    sharedState={plan}
                    onSharedStateChange={(field, value) =>
                      handlePlanChange(plan.id, field, value)
                    }
                    onCalculate={() => {}}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddPlan}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Add Investment Plan
      </Button>
    </Box>
  );
};

export default GoalForm;
