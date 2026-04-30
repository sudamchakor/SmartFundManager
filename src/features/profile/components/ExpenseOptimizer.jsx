import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, Typography, Box, Slider } from "@mui/material";
import {
  selectProfileExpenses,
  selectTotalMonthlyIncome,
  selectTotalMonthlyGoalContributions,
  updateExpense,
} from "../../../store/profileSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import { selectCurrency } from "../../../store/emiSlice";
import { formatCurrency } from "../../../utils/formatting";

const ExpenseOptimizer = () => {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const expenses = useSelector(selectProfileExpenses) || [];
  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const goalContributions = useSelector(selectTotalMonthlyGoalContributions);
  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);

  // Local state to handle slider dragging smoothly before dispatching to Redux
  const [localExpenses, setLocalExpenses] = useState(expenses);
  // Store the initial expenses to calculate the static max limit for sliders
  const [initialExpenses] = useState(expenses);

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  const handleSliderChange = (expenseId, newValue) => {
    const updatedExpenses = localExpenses.map((exp) =>
      exp.id === expenseId ? { ...exp, amount: newValue } : exp,
    );
    setLocalExpenses(updatedExpenses);
  };

  const handleSliderChangeCommitted = (expenseId) => {
    const expenseToUpdate = localExpenses.find((exp) => exp.id === expenseId);
    if (expenseToUpdate) {
      dispatch(updateExpense(expenseToUpdate));
    }
  };

  // Calculate current dynamic deficit/surplus based on local state
  const totalLocalExpenses = localExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const currentDynamicSurplus =
    totalIncome - totalLocalExpenses - goalContributions - (monthlyEmi || 0);
  const isDeficit = currentDynamicSurplus < 0;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom>
          Expense Optimizer
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Adjust your current expenses to see how it affects your monthly cash
          flow.
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            py: 1,
          }}
        >
          {localExpenses.map((expense) => {
            // Find the initial expense amount to use for a stable max calculation
            const initialExpense = initialExpenses.find(e => e.id === expense.id) || expense;
            const initialAmount = initialExpense.amount;
            
            // Calculate max limit based on category and initial amount, NOT the current changing amount
            let maxLimit;
            if (expense.category === "basic") {
              maxLimit = Math.max(
                totalIncome * 2,
                initialAmount * 1.5,
                500000,
              );
            } else if (expense.category === "discretionary") {
              maxLimit = Math.max(totalIncome, initialAmount * 2, 200000);
            } else {
              maxLimit = Math.max(totalIncome * 2, initialAmount * 2, 500000);
            }

            return (
              <Box key={expense.id} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    {expense.name} ({expense.category})
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main">
                    {formatCurrency(expense.amount, currency)}
                  </Typography>
                </Box>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={expense.amount}
                    min={0}
                    max={maxLimit}
                    step={100}
                    onChange={(e, val) => handleSliderChange(expense.id, val)}
                    onChangeCommitted={() =>
                      handleSliderChangeCommitted(expense.id)
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(val) => formatCurrency(val, currency)}
                  />
                </Box>
              </Box>
            );
          })}

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle2">Loan EMIs (Fixed)</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {formatCurrency(monthlyEmi || 0, currency)}
              </Typography>
            </Box>
            <Box sx={{ px: 1 }}>
              <Slider
                value={monthlyEmi || 0}
                disabled
                max={Math.max(totalIncome * 2, monthlyEmi * 2, 500000)}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: isDeficit ? "#ffebee" : "#e8f5e9", // light red vs light green
            transition: "background-color 0.3s ease",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: isDeficit ? "#c62828" : "#2e7d32",
            }}
          >
            {isDeficit ? "Current Deficit:" : "Current Surplus:"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: isDeficit ? "#c62828" : "#2e7d32",
            }}
          >
            {isDeficit ? "-" : ""}
            {formatCurrency(Math.abs(currentDynamicSurplus), currency)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseOptimizer;
