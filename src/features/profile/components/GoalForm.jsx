import React from "react";
import { Box, Typography, Divider, Grid, Card } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GoalFormHeader from "./GoalFormHeader";
import InvestmentPlanCard from "./InvestmentPlanCard";
import useGoalForm from "./useGoalForm";

export const GoalForm = ({ goal, currentYear, onSave, retirementYear }) => {
  const {
    editedGoal,
    setEditedGoal,
    handleAddPlan,
    handleRemovePlan,
    handlePlanChange,
    handleGenerateInvestmentPlans,
    handleSaveGoal,
  } = useGoalForm(goal, currentYear, onSave);

  const formatAmount = (amount) =>
    (amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

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
      <GoalFormHeader
        editedGoal={editedGoal}
        setEditedGoal={setEditedGoal}
        currentYear={currentYear}
        retirementYear={retirementYear} // Pass retirementYear to GoalFormHeader
        handleGenerateInvestmentPlans={handleGenerateInvestmentPlans}
        plans={editedGoal.investmentPlans}
        handleSaveGoal={handleSaveGoal}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Investment Plans
      </Typography>
      <Grid container spacing={2}>
        {editedGoal.investmentPlans.map((plan) => (
          <Grid item xs={12} sm={12} md={12} lg={6} key={plan.id}>
            <InvestmentPlanCard
              plan={plan}
              targetAmount={editedGoal.targetAmount}
              handlePlanChange={handlePlanChange}
              handleRemovePlan={handleRemovePlan}
              formatAmount={formatAmount}
            />
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            onClick={handleAddPlan}
            sx={(theme) => ({
              border: `1px dotted ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              cursor: "pointer",
              width: "fit-content",
              padding: "1.5rem",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.dark,
                "& > div": {
                  borderColor: theme.palette.primary.contrastText,
                },
              },
            })}
          >
            <Box
              sx={(theme) => ({
                borderRadius: "50%",
                transition: "border-color 0.3s ease-in-out",
              })}
            >
              <AddCircleOutlineIcon sx={{ fontSize: "3rem" }} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoalForm;
