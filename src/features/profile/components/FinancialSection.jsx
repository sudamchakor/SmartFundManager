import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIncomes,
  selectProfileExpenses,
  selectTotalMonthlyGoalContributions,
  deleteIncome,
  deleteExpense,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import EditableIncomeExpenseItem from "../../../components/common/EditableIncomeExpenseItem";

const FinancialSection = ({ isIncome, onOpenModal, onEditGoal }) => {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);
  const items = useSelector(isIncome ? selectIncomes : selectProfileExpenses) || [];
  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );

  const title = isIncome ? "Income Sources" : "Monthly Expenses";
  const modalType = isIncome ? "income" : "expense";

  const handleDelete = (id) => {
    if (isIncome) {
      dispatch(deleteIncome(id));
    } else {
      dispatch(deleteExpense(id));
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => onOpenModal(modalType, null, "add")}
          >
            Add
          </Button>
        }
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {items.map((item) => (
            <EditableIncomeExpenseItem
              key={item.id}
              item={item}
              currency={currency}
              onEdit={() => onOpenModal(modalType, item, "edit")}
              onDelete={() => handleDelete(item.id)}
              isIncome={isIncome}
            />
          ))}
          {!isIncome && totalMonthlyGoalContributions > 0 && (
            <EditableIncomeExpenseItem
              item={{
                name: "Goal Investments",
                amount: totalMonthlyGoalContributions,
                frequency: "monthly",
                isGoal: true,
              }}
              currency={currency}
              isIncome={false}
              onEditGoal={onEditGoal}
            />
          )}
        </List>
        {items.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ p: 2 }}
          >
            No {isIncome ? "income sources" : "expenses"} added yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSection;
