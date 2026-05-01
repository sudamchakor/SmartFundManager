import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ReadOnlyItem({
  item,
  subItems,
  currency,
  isExpense,
  isIncome,
  isGoal,
  isReadOnly = false,
  onDelete,
  onEdit,
  onEditGoal,
  formatCurrency,
  totalIncome,
  expenseRatio,
  getExpenseColor,
  onConfirmDelete,
  deletionImpactMessage,
  onClick,
  taxRate,
}) {
  const [showSubItems, setShowSubItems] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    if (onConfirmDelete) {
      setConfirmOpen(true);
    } else if (onDelete) {
      onDelete(item.id);
    }
  };

  const handleConfirmClose = (confirmed) => {
    setConfirmOpen(false);
    if (confirmed && onConfirmDelete) {
      onConfirmDelete();
    }
  };

  const taxSaved =
    isExpense && item.isTaxDeductible && taxRate
      ? item.amount * taxRate
      : 0;
  const netCost = isExpense && taxSaved > 0 ? item.amount - taxSaved : null;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#fcfcfd",
        border: "1px solid #e0e0e0",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: getExpenseColor ? getExpenseColor() : "text.primary",
            }}
          >
            {item.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(item.amount, currency)} / {item.frequency}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {isExpense && totalIncome > 0 && (
            <Chip
              label={`${((item.amount / totalIncome) * 100).toFixed(1)}%`}
              size="small"
              sx={{
                bgcolor: "#eee",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          )}
          {!isReadOnly && (
            <>
              <IconButton size="small" onClick={() => onEdit(item.id)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" onClick={handleDeleteClick}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
          {isGoal && (
            <IconButton size="small" onClick={() => onEditGoal(item.id)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}
          {subItems && subItems.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setShowSubItems(!showSubItems)}
            >
              {showSubItems ? (
                <ExpandLessIcon fontSize="inherit" />
              ) : (
                <ExpandMoreIcon fontSize="inherit" />
              )}
            </IconButton>
          )}
        </Stack>
      </Stack>

      {netCost !== null && (
        <Tooltip
          title={`Original: ${formatCurrency(
            item.amount,
            currency,
          )}, Tax Saved: ${formatCurrency(taxSaved, currency)}`}
          arrow
        >
          <Chip
            label={`Net Cost: ${formatCurrency(netCost, currency)}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ mt: 1, fontWeight: 600 }}
          />
        </Tooltip>
      )}

      {showSubItems && subItems && subItems.length > 0 && (
        <Box sx={{ mt: 1.5, pl: 2, borderLeft: "2px solid #eee" }}>
          {subItems.map((sub, index) => (
            <ReadOnlyItem
              key={sub.id || index}
              item={sub}
              currency={currency}
              isExpense={true}
              isReadOnly={true}
              formatCurrency={formatCurrency}
              totalIncome={totalIncome}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => handleConfirmClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deletionImpactMessage ||
              "Are you sure you want to delete this item?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)}>Cancel</Button>
          <Button onClick={() => handleConfirmClose(true)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
