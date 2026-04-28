import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Tooltip,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditableIncomeExpenseItem from "../../../components/common/EditableIncomeExpenseItem";
import ReadOnlyItem from "../../../components/common/ReadOnlyItem";
import IncomeExpenseForm from "../../../components/common/IncomeExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import Collapse from "@mui/material/Collapse";
import {
  selectIncomes,
  addIncome,
  deleteIncome,
  updateIncome,
  selectTotalMonthlyIncome,
  selectProfileExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  selectTotalMonthlyExpenses,
  selectTotalMonthlyGoalContributions,
  selectIndividualGoalInvestmentContributions,
  selectGoals,
  selectCurrentSurplus,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";

export default function FinancialSection({
  isIncome,
  onEditGoal,
  isModal,
  onCloseModal,
}) {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);
  const theme = useTheme();

  // Data selectors
  const incomes = useSelector(selectIncomes) || [];
  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const expenses = useSelector(selectProfileExpenses) || [];
  const totalProfileExpenses = useSelector(selectTotalMonthlyExpenses);
  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const individualGoalInvestmentContributions = useSelector(
    selectIndividualGoalInvestmentContributions,
  );
  const goals = useSelector(selectGoals) || [];
  const investableSurplus = useSelector(selectCurrentSurplus);
  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);

  const items = isIncome ? incomes : expenses;
  const totalAmount = isIncome
    ? totalIncome
    : totalProfileExpenses + (monthlyEmi || 0) + totalMonthlyGoalContributions;

  // State
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingInitialData, setEditingInitialData] = useState({});
  const [expandedGoals, setExpandedGoals] = useState({});
  const [showForm, setShowForm] = useState(false); // For controlling the form visibility

  // Handlers
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingInitialData({});
    setShowForm(false); // Collapse form on cancel
  };

  const handleAddOrUpdate = (formData) => {
    const action = editingItemId
      ? isIncome
        ? updateIncome
        : updateExpense
      : isIncome
        ? addIncome
        : addExpense;
    const payload = editingItemId
      ? { ...formData, id: editingItemId }
      : { ...formData, id: Date.now() };
    dispatch(action(payload));
    handleCancelEdit(); // Reset and collapse form
    if (isModal && onCloseModal) onCloseModal();
  };

  // Formatting and derived values
  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const isBudgetExceeded = !isIncome && investableSurplus < 0;
  const budgetWarning = isBudgetExceeded
    ? `Your spending (${formatCurrency(totalAmount)}) exceeds income (${formatCurrency(totalIncome)}) by ${formatCurrency(Math.abs(investableSurplus))}. Consider reducing expenses or increasing income.`
    : "";

  const formTitle = `Add New ${isIncome ? "Income" : "Expense"}`;
  const totalLabel = isIncome
    ? "Total Monthly Income"
    : "Total Monthly Expenses";

  // Modal view
  if (isModal) {
    return (
      <Box sx={{ p: 2 }}>
        <IncomeExpenseForm
          initialData={editingInitialData}
          isExpense={!isIncome}
          onSave={handleAddOrUpdate}
          onCancel={handleCancelEdit}
          submitLabel={editingItemId ? "Update" : "Add"}
          isInline={false}
        />
      </Box>
    );
  }

  // Income Section view
  if (isIncome) {
    return (
      <Box sx={{ p: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Current Incomes
        </Typography>
        <Box sx={{ pr: 1, maxHeight: 200, overflowY: "auto" }}>
          {items.map((item) => (
            <EditableIncomeExpenseItem
              key={item.id}
              item={item}
              currency={currency}
              onUpdate={(updatedItem) => dispatch(updateIncome(updatedItem))}
              onDelete={(id) => dispatch(deleteIncome(id))}
              isIncome={true}
              totalIncome={totalIncome}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: 1,
            bgcolor: `${theme.palette.success.light}33`,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {totalLabel}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "success.dark" }}
          >
            {formatCurrency(totalAmount.toFixed(0))}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        {showForm ? (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>{formTitle}</Typography>
              <IconButton onClick={() => setShowForm(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <IncomeExpenseForm
              initialData={editingInitialData}
              isExpense={false}
              onSave={handleAddOrUpdate}
              onCancel={handleCancelEdit}
              submitLabel={editingItemId ? "Update" : "Add"}
              isInline={false}
            />
          </Box>
        ) : (
          <Button variant="outlined" onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
            {formTitle}
          </Button>
        )}
      </Box>
    );
  }

  // Expense Section view
  const toggleGoalExpanded = (goalId) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const groupedGoalInvestmentContributions =
    individualGoalInvestmentContributions.reduce((acc, inv) => {
      const goal = goals.find((g) => g.id === inv.goalId);
      const goalName = goal ? goal.name : "Other Goal";

      if (!acc[inv.goalId]) {
        acc[inv.goalId] = {
          goalId: inv.goalId,
          goalName: goalName,
          investments: [],
        };
      }
      acc[inv.goalId].investments.push(inv);
      return acc;
    }, {});

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Current Expenses
        {isBudgetExceeded && (
          <Tooltip title={budgetWarning}>
            <InfoIcon
              fontSize="small"
              sx={{ color: "error.main", cursor: "help", ml: 1 }}
            />
          </Tooltip>
        )}
      </Typography>
      <Box sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}>
        {monthlyEmi > 0 && (
          <ReadOnlyItem
            item={{
              id: "home-loan-emi",
              name: "Home Loan EMI",
              amount: monthlyEmi,
              frequency: "monthly",
            }}
            currency={currency}
            isExpense={true}
            totalIncome={totalIncome}
            expenseRatio={(monthlyEmi / totalIncome) * 100}
            getExpenseColor={() => {
              const ratio = (monthlyEmi / totalIncome) * 100;
              if (ratio > 40) return "error.main";
              if (ratio > 30) return "warning.main";
              return "success.main";
            }}
            formatCurrency={formatCurrency}
            onConfirmDelete={() => {}}
            deletionImpactMessage="Deleting Home Loan EMI will remove it from your expenses and cash flow calculations. To adjust the EMI, please use the EMI Calculator tab."
            isReadOnly={true}
            onClick={() => {}}
          />
        )}
        {individualGoalInvestmentContributions.length > 0 && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Goal Investments
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {Object.values(groupedGoalInvestmentContributions).map(
                (group) => {
                  const groupMonthlyTotal = group.investments.reduce(
                    (sum, inv) => {
                      let monthly = inv.amount || 0;
                      if (inv.frequency === "yearly") monthly /= 12;
                      else if (inv.frequency === "quarterly") monthly /= 3;
                      return sum + monthly;
                    },
                    0,
                  );
                  const isExpanded = expandedGoals[group.goalId];

                  return (
                    <Grid item xs={12} key={group.goalId}>
                      <Box
                        sx={{
                          mb: 0,
                          p: 1.5,
                          bgcolor: "rgba(0,0,0,0.02)",
                          borderRadius: 2,
                        }}
                      >
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          onClick={() => toggleGoalExpanded(group.goalId)}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { opacity: 0.8 },
                          }}
                        >
                          <Grid item xs={12} sm={8}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: "text.secondary",
                              }}
                            >
                              {group.goalName} ({group.investments.length}{" "}
                              {group.investments.length === 1
                                ? "plan"
                                : "plans"}
                              )
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            sx={{ textAlign: { xs: "left", sm: "right" } }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: "text.secondary",
                              }}
                            >
                              {formatCurrency(groupMonthlyTotal)} / mo
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={1}
                            sx={{ textAlign: { xs: "left", sm: "right" } }}
                          >
                            <IconButton
                              size="small"
                              disableRipple
                              sx={{ p: 0 }}
                            >
                              {isExpanded ? (
                                <CloseIcon
                                  sx={{ transform: "rotate(180deg)" }}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Collapse in={isExpanded}>
                          <Box sx={{ mt: 1.5 }}>
                            {group.investments.map((investment) => (
                              <ReadOnlyItem
                                key={investment.id}
                                item={investment}
                                currency={currency}
                                isExpense={true}
                                totalIncome={totalIncome}
                                expenseRatio={
                                  totalIncome > 0
                                    ? (investment.amount / totalIncome) * 100
                                    : 0
                                }
                                getExpenseColor={() => "default"}
                                formatCurrency={formatCurrency}
                                onConfirmDelete={() => {}}
                                deletionImpactMessage={`To stop this investment, please edit or delete the associated goal in the Future Goals tab.`}
                                isReadOnly={true}
                                onClick={() => onEditGoal(investment.goalId)}
                              />
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    </Grid>
                  );
                },
              )}
            </Grid>
          </Box>
        )}
        {items.map((item) => (
          <EditableIncomeExpenseItem
            key={item.id}
            item={item}
            currency={currency}
            onUpdate={(updatedItem) => dispatch(updateExpense(updatedItem))}
            onDelete={(id) => dispatch(deleteExpense(id))}
            isExpense={true}
            isBudgetExceeded={isBudgetExceeded}
            budgetWarning={budgetWarning}
            totalIncome={totalIncome}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 1,
          bgcolor: isBudgetExceeded
            ? `${theme.palette.error.light}33`
            : `${theme.palette.grey[200]}80`,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {totalLabel}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: isBudgetExceeded ? "error.dark" : "text.primary",
            fontSize: isBudgetExceeded ? "1.2rem" : "1rem",
          }}
        >
          {formatCurrency(totalAmount.toFixed(0))}
        </Typography>
      </Box>
      {isBudgetExceeded && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: "#ffebee",
            borderLeft: "4px solid #f44336",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#c62828", fontWeight: 600 }}
          >
            ⚠️ {budgetWarning}
          </Typography>
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      {showForm ? (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>{formTitle}</Typography>
              <IconButton onClick={() => setShowForm(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <IncomeExpenseForm
              initialData={editingInitialData}
              isExpense={true}
              onSave={handleAddOrUpdate}
              onCancel={handleCancelEdit}
              submitLabel={editingItemId ? "Update" : "Add"}
              isInline={false}
            />
          </Box>
        ) : (
          <Button variant="outlined" onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
            {formTitle}
          </Button>
        )}
    </Box>
  );
}
