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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SliderInput from "../common/SliderInput"; // Adjusted import path for SliderInput

export const GoalForm = ({
  goal, // Renamed from initialData for clarity when editing
  currentYear,
  onSave,
}) => {
  const [editedGoal, setEditedGoal] = useState(() => {
    // Initialize investmentPlans from existing goal structure or with a default plan
    if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
      return goal;
    } else if (goal && goal.investmentType) {
      // Convert old single investmentType to a new investmentPlans array
      return {
        ...goal,
        investmentPlans: [
          {
            id: Date.now().toString(), // Unique ID for the plan
            type: goal.investmentType,
            stepUpRate: goal.stepUpRate || 0,
            isSafe: false, // Default to false for existing plans
          },
        ],
      };
    }
    return {
      ...goal,
      investmentPlans: [
        {
          id: Date.now().toString(),
          type: "sip",
          stepUpRate: 0,
          isSafe: false,
        },
      ],
    };
  });

  useEffect(() => {
    setEditedGoal((prevGoal) => {
      if (goal && goal.investmentPlans && goal.investmentPlans.length > 0) {
        return goal;
      } else if (goal && goal.investmentType) {
        return {
          ...goal,
          investmentPlans: [
            {
              id: Date.now().toString(),
              type: goal.investmentType,
              stepUpRate: goal.stepUpRate || 0,
              isSafe: false,
            },
          ],
        };
      }
      return {
        ...goal,
        investmentPlans: [
          {
            id: Date.now().toString(),
            type: "sip",
            stepUpRate: 0,
            isSafe: false,
          },
        ],
      };
    });
  }, [goal]);

  useEffect(() => {
    onSave(editedGoal);
  }, [editedGoal, onSave]);

  const handleAddPlan = () => {
    setEditedGoal((prev) => ({
      ...prev,
      investmentPlans: [
        ...prev.investmentPlans,
        {
          id: Date.now().toString(),
          type: "sip",
          stepUpRate: 0,
          isSafe: false,
        },
      ],
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
      </Grid>

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Investment Plans
      </Typography>
      {editedGoal.investmentPlans.map((plan, index) => (
        <Box
          key={plan.id}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Plan {index + 1}
          </Typography>
          {editedGoal.investmentPlans.length > 1 && (
            <IconButton
              aria-label="remove plan"
              onClick={() => handleRemovePlan(plan.id)}
              size="small"
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <RemoveCircleOutlineIcon color="error" />
            </IconButton>
          )}
          <FormControl size="small" fullWidth sx={{ mb: 1.5 }}>
            <InputLabel>Investment Type</InputLabel>
            <Select
              value={plan.type}
              label="Investment Type"
              onChange={(e) =>
                handlePlanChange(plan.id, "type", e.target.value)
              }
            >
              <MenuItem value="sip">Standard SIP</MenuItem>
              <MenuItem value="lumpsum">Lumpsum</MenuItem>
              <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
              <MenuItem value="swp">SWP</MenuItem>
              <MenuItem value="fd">Fixed Deposit</MenuItem>
            </Select>
          </FormControl>

          {plan.type === "step_up_sip" && (
            <SliderInput
              label="Annual Step-Up Rate (%)"
              value={Number(plan.stepUpRate) || 0}
              onChange={(val) => handlePlanChange(plan.id, "stepUpRate", val)}
              min={0}
              max={20}
              step={0.5}
              showInput={true}
              unit="%"
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={plan.isSafe}
                onChange={(e) =>
                  handlePlanChange(plan.id, "isSafe", e.target.checked)
                }
                name={`isSafe-${plan.id}`}
                color="primary"
              />
            }
            label="Safe Investment Option"
            sx={{ mt: 1 }}
          />
        </Box>
      ))}
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddPlan}
        variant="outlined"
        sx={{ mt: 1 }}
      >
        Add Another Investment Plan
      </Button>
    </Box>
  );
};

export default GoalForm;
