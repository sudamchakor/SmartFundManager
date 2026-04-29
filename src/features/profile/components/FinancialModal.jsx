import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import IncomeExpenseForm from "../../../components/common/IncomeExpenseForm";
import { addIncome, addExpense } from "../../../store/profileSlice";
import { addAsset, updateAsset } from "../../corpus/corpusSlice"; // Import updateAsset

const CorpusForm = ({ onSave, onCancel, assetToEdit, mode }) => { // Added mode prop
  const [newAsset, setNewAsset] = useState({
    label: "",
    value: "",
    expectedReturn: "",
    category: "Equity",
  });

  useEffect(() => {
    if (assetToEdit && mode === "edit") { // Check mode for editing
      setNewAsset({
        id: assetToEdit.id,
        label: assetToEdit.label,
        value: assetToEdit.value,
        expectedReturn: assetToEdit.expectedReturn,
        category: assetToEdit.category,
      });
    } else {
      setNewAsset({
        label: "",
        value: "",
        expectedReturn: "",
        category: "Equity",
      });
    }
  }, [assetToEdit, mode]); // Added mode to dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSave = () => {
    if (newAsset.label && newAsset.value && newAsset.expectedReturn) {
      onSave(newAsset);
    }
  };

  return (
    <>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="label"
          label="Asset Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newAsset.label}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="value"
          label="Current Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={newAsset.value}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <Typography>₹</Typography>,
          }}
        />
        <TextField
          margin="dense"
          name="expectedReturn"
          label="Expected Return"
          type="number"
          fullWidth
          variant="outlined"
          value={newAsset.expectedReturn}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: <Typography>%</Typography>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {mode === "edit" ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </>
  );
};

export default function FinancialModal({ open, onClose, type, asset, mode }) { // Added mode prop
  const dispatch = useDispatch();

  const getTitle = () => {
    switch (type) {
      case "income":
        return mode === "edit" ? "Edit Income" : "Add New Income";
      case "expense":
        return mode === "edit" ? "Edit Expense" : "Add New Expense";
      case "corpus":
        return mode === "edit" ? "Edit Asset" : "Add New Asset";
      default:
        return "";
    }
  };

  const handleSave = (formData) => {
    if (mode === "edit") { // Use mode to determine edit operation
      dispatch(updateAsset({ ...formData, id: asset.id }));
    } else { // Otherwise, it's an add operation
      const payload = { ...formData, id: Date.now() }; // id will be generated in prepare for addAsset
      dispatch(
        addAsset(
          payload.label,
          payload.value,
          payload.expectedReturn,
          payload.category,
        ),
      );
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <Divider sx={{ mb: 2 }} />
      {type === "corpus" ? (
        <CorpusForm onSave={handleSave} onCancel={onClose} assetToEdit={asset} mode={mode} /> // Pass assetToEdit and mode
      ) : (
        <DialogContent>
          <IncomeExpenseForm
            isExpense={type === "expense"}
            onSave={handleSave}
            onCancel={onClose}
            submitLabel={mode === "edit" ? "Update" : "Add"} // Use mode for submitLabel
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
