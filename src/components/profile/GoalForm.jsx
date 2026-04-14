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
import StepUpSipCalculatorForm from "../calculators/investment/StepUpSipCalculatorForm";
import SwpCalculatorForm from "../calculators/investment/SwpCalculatorForm";
import FdCalculatorForm from "../calculators/investment/FdCalculatorForm";

export const GoalForm = ({ goal, currentYear, onSave }) => {
  const getDefaultPlanState = (type, targetAmount = 0, timePeriod = 10) => {
    const defaultTimePeriodFromGoal = goal?.targetYear
      ? goal.targetYear - currentYear
      : 10;
    const effectiveTimePeriod = Math.max(1, timePeriod > 0 ? timePeriod : defaultTimePeriodFromGoal);

    // Calculate a base amount for initial suggestions, ensuring a minimum of 500
    // These are heuristics to provide a reasonable starting point for the user
    const baseAmountForSip = Math.max(500, Math.round(targetAmount / (effectiveTimePeriod * 12 * 2))); // Aim for SIP to cover half of target over time
    const baseAmountForLumpsum = Math.max(500, Math.round(targetAmount / 2)); // Aim for lumpsum to cover half of target
    const baseAmountForFd = Math.max(500, Math.round(targetAmount / 2)); // Aim for FD to cover half of target

    switch (type) {
      case "sip":
        return {
          id: Date.now().toString(),
          type: "sip",
          monthlyInvestment: baseAmountForSip,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
      case "lumpsum":
        return {
          id: Date.now().toString(),
          type: "lumpsum",
          totalInvestment: baseAmountForLumpsum,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
      case "stepUpSip":
        return {
          id: Date.now().toString(),
          type: "stepUpSip",
          monthlyInvestment: baseAmountForSip, // Using SIP base for step-up
          stepUpPercentage: 10,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
      case "swp":
        return {
          id: Date.now().toString(),
          type: "swp",
          totalInvestment: baseAmountForLumpsum, // Using lumpsum base for SWP
          withdrawalPerMonth: Math.max(500, Math.round(baseAmountForLumpsum / (effectiveTimePeriod * 12))),
          expectedReturnRate: 8,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
      case "fd":
        return {
          id: Date.now().toString(),
          type: "fd",
          principalAmount: baseAmountForFd,
          interestRate: 7,
          timePeriod: effectiveTimePeriod,
          compoundingFrequency: "annually",
          isSafe: true, // FD is generally considered safe
        };
      default:
        return {
          id: Date.now().toString(),
          type: "sip",
          monthlyInvestment: baseAmountForSip,
          expectedReturnRate: 12,
          timePeriod: effectiveTimePeriod,
          isSafe: false,
        };
    }
  };

  const [editedGoal, setEditedGoal] = useState(() => {
    const initialTargetAmount = goal?.targetAmount || 0;
    const initialTimePeriod = goal?.targetYear ? goal.targetYear - currentYear : 10;

    if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
      return goal;
    } else if (goal && goal.investmentType) {
      // If an old goal has investmentType, convert it to a plan
      return {
        ...goal,
        investmentPlans: [getDefaultPlanState(goal.investmentType, initialTargetAmount, initialTimePeriod)],
      };
    }
    return {
      ...goal,
      investmentPlans: [getDefaultPlanState("sip", initialTargetAmount, initialTimePeriod)],
    };
  });

  const [generatedInvestmentPlans, setGeneratedInvestmentPlans] = useState([]);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
  const [totalEstimatedReturns, setTotalEstimatedReturns] = useState(0);
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [overallROI, setOverallROI] = useState(null);

  useEffect(() => {
    // This effect ensures that if the 'goal' prop changes, the editedGoal state is updated.
    // It also handles the conversion of old 'investmentType' to new 'investmentPlans' structure.
    setEditedGoal((prevGoal) => {
      const currentTargetAmount = goal?.targetAmount || 0;
      const currentTimePeriod = goal?.targetYear ? goal.targetYear - currentYear : 10;

      if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
        return goal;
      } else if (goal && goal.investmentType) {
        return {
          ...goal,
          investmentPlans: [getDefaultPlanState(goal.investmentType, currentTargetAmount, currentTimePeriod)],
        };
      }
      // If goal is null or has no plans/type, initialize with a default SIP plan
      return {
        ...goal,
        investmentPlans: [getDefaultPlanState("sip", currentTargetAmount, currentTimePeriod)],
      };
    });
  }, [goal, currentYear]); // Added currentYear to dependency array

  useEffect(() => {
    onSave(editedGoal);
  }, [editedGoal, onSave]);

  const handleAddPlan = () => {
    const currentTargetAmount = editedGoal.targetAmount || 0;
    const currentTimePeriod = editedGoal.targetYear ? editedGoal.targetYear - currentYear : 10;
    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: [...prev.investmentPlans, getDefaultPlanState("sip", currentTargetAmount, currentTimePeriod)], // Add a default SIP plan
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
    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: prev.investmentPlans.map((plan) =>
        plan.id === id ? { ...plan, [field]: value } : plan,
      ),
    }));
  };

  const handleGenerateInvestmentPlans = () => {
    const { targetAmount, targetYear } = editedGoal;
    if (!targetAmount || !targetYear || targetYear <= currentYear) {
      alert("Please set a valid Target Amount and Target Year.");
      return;
    }

    let plansToCalculate = editedGoal.investmentPlans;
    const totalTimePeriod = targetYear - currentYear;

    // If no plans are defined, generate some default ones with suitable initial amounts
    if (plansToCalculate.length === 0) {
      const newPlans = [
        getDefaultPlanState("sip", targetAmount, totalTimePeriod),
        getDefaultPlanState("lumpsum", targetAmount, totalTimePeriod),
        getDefaultPlanState("fd", targetAmount, totalTimePeriod),
      ];
      // Update the editedGoal state with these newly generated plans
      setEditedGoal((prev) => ({
        ...prev,
        investmentPlans: newPlans,
      }));
      plansToCalculate = newPlans; // Use the newly generated plans for calculation
    }

    const generatedPlans = [];
    let calculatedTotalInvestedAmount = 0;
    let calculatedTotalEstimatedReturns = 0;
    let calculatedTotalCurrentValue = 0;

    plansToCalculate.forEach((plan) => {
      let result = {};
      let details = "";

      switch (plan.type) {
        case "sip":
          result = calculateSip(
            plan.monthlyInvestment,
            plan.expectedReturnRate,
            plan.timePeriod,
          );
          details = `Monthly ₹${plan.monthlyInvestment.toLocaleString()} for ${plan.timePeriod} years @ ${plan.expectedReturnRate}% p.a.`;
          break;
        case "lumpsum":
          result = calculateLumpsum(
            plan.totalInvestment,
            plan.expectedReturnRate,
            plan.timePeriod,
          );
          details = `One-time ₹${plan.totalInvestment.toLocaleString()} for ${plan.timePeriod} years @ ${plan.expectedReturnRate}% p.a.`;
          break;
        case "stepUpSip":
          result = calculateStepUpSip(
            plan.monthlyInvestment,
            plan.expectedReturnRate,
            plan.timePeriod,
            plan.stepUpPercentage,
          );
          details = `Monthly ₹${plan.monthlyInvestment.toLocaleString()} with ${plan.stepUpPercentage}% annual step-up for ${plan.timePeriod} years @ ${plan.expectedReturnRate}% p.a.`;
          break;
        case "swp":
          result = calculateSwp(
            plan.totalInvestment,
            plan.expectedReturnRate,
            plan.timePeriod,
            plan.withdrawalPerMonth,
          );
          details = `Start with ₹${plan.totalInvestment.toLocaleString()}, withdraw ₹${plan.withdrawalPerMonth.toLocaleString()}/month for ${plan.timePeriod} years @ ${plan.expectedReturnRate}% p.a.`;
          break;
        case "fd":
          result = calculateFd(
            plan.principalAmount,
            plan.interestRate,
            plan.timePeriod,
            plan.compoundingFrequency,
          );
          details = `One-time ₹${plan.principalAmount.toLocaleString()} for ${plan.timePeriod} years @ ${plan.interestRate}% p.a. (${plan.compoundingFrequency} Compounded)`;
          break;
        default:
          break;
      }

      if (Object.keys(result).length > 0) {
        const planResult = {
          id: plan.id,
          type: plan.type,
          name: plan.type.toUpperCase(), // Display type as name for now
          ...result,
          details: details,
          isSafe: plan.isSafe,
        };
        generatedPlans.push(planResult);

        // Aggregate totals
        if (planResult.type === "swp") {
          calculatedTotalInvestedAmount += planResult.principal || 0;
          // SWP doesn't add to estimated returns in the same way
          calculatedTotalCurrentValue += planResult.totalValue || 0;
        } else {
          calculatedTotalInvestedAmount += planResult.investedAmount || 0;
          calculatedTotalEstimatedReturns += planResult.estimatedReturns || 0;
          calculatedTotalCurrentValue += planResult.totalValue || 0;
        }
      }
    });

    setGeneratedInvestmentPlans(generatedPlans);
    setTotalInvestedAmount(calculatedTotalInvestedAmount);
    setTotalEstimatedReturns(calculatedTotalEstimatedReturns);
    setTotalCurrentValue(calculatedTotalCurrentValue);

    if (calculatedTotalInvestedAmount > 0) {
      const roi = ((calculatedTotalCurrentValue - calculatedTotalInvestedAmount) / calculatedTotalInvestedAmount) * 100;
      setOverallROI(roi);
    } else {
      setOverallROI(null);
    }
  };

  const totalTimePeriod = editedGoal.targetYear ? editedGoal.targetYear - currentYear : 0;

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
      {editedGoal.investmentPlans.map((plan, index) => (
        <Box
          key={plan.id}
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
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={plan.isSafe}
                    onChange={(e) =>
                      handlePlanChange(plan.id, "isSafe", e.target.checked)
                    }
                    name="isSafe"
                    color="primary"
                  />
                }
                label="Consider Safe"
              />
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
      ))}
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddPlan}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Add Investment Plan
      </Button>

      <GeneratedInvestmentPlans
        generatedInvestmentPlans={generatedInvestmentPlans}
        totalInvestedAmount={totalInvestedAmount}
        totalEstimatedReturns={totalEstimatedReturns}
        totalCurrentValue={totalCurrentValue}
        totalTimePeriod={totalTimePeriod}
        overallROI={overallROI}
      />
    </Box>
  );
};

export default GoalForm;
