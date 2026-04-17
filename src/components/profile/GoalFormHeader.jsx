import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import SliderInput from "../common/SliderInput";

const GoalFormHeader = ({
  editedGoal,
  setEditedGoal,
  currentYear,
  handleGenerateInvestmentPlans,
}) => {
  return (
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
              disabled={editedGoal.targetAmount < 500}
            >
              Generate Investment Plans
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GoalFormHeader;
