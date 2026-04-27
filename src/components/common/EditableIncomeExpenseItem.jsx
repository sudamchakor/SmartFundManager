import React, { useState } from "react";
import { Paper } from "@mui/material";
import ReadOnlyItem from "./ReadOnlyItem";
import IncomeExpenseForm from "./IncomeExpenseForm";

export const EditableIncomeExpenseItem = ({
  item,
  currency,
  onUpdate,
  onDelete,
  isExpense = false,
  isIncome = false,
  isBudgetExceeded = false,
  budgetWarning = "",
  totalIncome = 0,
  totalExpenses = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = (updatedData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setEditedItem(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN")}`;

  const expenseRatio = totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0;
  const getExpenseColor = () => {
    if (expenseRatio > 40) return "error.main";
    if (expenseRatio > 30) return "warning.main";
    return "success.main";
  };

  return (
    <>
      {isEditing ? (
        <Paper
          sx={{
            p: 2,
            mb: 1.5,
            border: isBudgetExceeded
              ? "2px solid #f44336"
              : "1px solid #e0e0e0",
            backgroundColor: isBudgetExceeded ? "#ffebee" : "background.paper",
            borderRadius: 1.5,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <IncomeExpenseForm
            initialData={editedItem}
            isExpense={isExpense}
            onSave={handleSave}
            onCancel={handleCancel}
            isInline={true}
          />
        </Paper>
      ) : (
        <ReadOnlyItem
          item={editedItem}
          currency={currency}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onConfirmDelete={onDelete}
          deletionImpactMessage={`This will permanently remove the ${isExpense ? "expense" : "income"} from your cash flow calculations.`}
          isExpense={isExpense}
          isIncome={isIncome}
          isBudgetExceeded={isBudgetExceeded}
          budgetWarning={budgetWarning}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          expenseRatio={expenseRatio}
          getExpenseColor={getExpenseColor}
          formatCurrency={formatCurrency}
          key={item.id}
        />
      )}
    </>
  );
};

export default EditableIncomeExpenseItem;