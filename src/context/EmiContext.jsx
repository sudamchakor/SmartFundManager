import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectThemeMode,
  selectCurrency,
  selectAutoSave,
  selectLoanDetails, // Import from emiSlice
  selectExpenses, // Import from emiSlice
  selectPrepayments, // Import from emiSlice
  setThemeMode as reduxSetThemeMode,
  setCurrency as reduxSetCurrency,
  setAutoSave as reduxSetAutoSave,
  updateLoanDetails as reduxUpdateLoanDetails, // Import Redux action
  updateExpenses as reduxUpdateExpenses, // Import Redux action
  updatePrepayments as reduxUpdatePrepayments, // Import Redux action
  changeLoanUnit as reduxChangeLoanUnit, // Import Redux action
  changeExpenseUnit as reduxChangeExpenseUnit, // Import Redux action
} from "../store/emiSlice";
import { selectCalculatedValues } from "../features/emiCalculator/utils/emiCalculator"; // Import from emiCalculator.js
import dayjs from "dayjs";

// Create the Context
const EmiContext = createContext();

// Create a custom hook for easier usage
export const useEmiContext = () => useContext(EmiContext);

// The Provider Component
export const EmiProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Use Redux selectors for all state
  const themeMode = useSelector(selectThemeMode);
  const currency = useSelector(selectCurrency);
  const autoSave = useSelector(selectAutoSave);
  const loanDetails = useSelector(selectLoanDetails);
  const expenses = useSelector(selectExpenses);
  const prepayments = useSelector(selectPrepayments);
  const calculatedValues = useSelector(selectCalculatedValues); // Use the new selector

  // Wrapper functions that dispatch Redux actions
  const setThemeMode = (newTheme) => {
    dispatch(reduxSetThemeMode(newTheme));
  };

  const setCurrency = (newCurrency) => {
    dispatch(reduxSetCurrency(newCurrency));
  };

  const setAutoSave = (newAutoSave) => {
    dispatch(reduxSetAutoSave(newAutoSave));
  };

  const updateLoanDetails = (key, value) => {
    dispatch(reduxUpdateLoanDetails({ key, value: key === "startDate" ? dayjs(value).toISOString() : value }));
  };

  const updateExpenses = (key, value) => {
    dispatch(reduxUpdateExpenses({ key, value }));
  };

  const updatePrepayments = (type, key, value) => {
    dispatch(reduxUpdatePrepayments({ type, key, value: (key === "startDate" || key === "date") ? dayjs(value).toISOString() : value }));
  };

  const changeLoanUnit = (unitField, amountField, newUnit, convertedAmount) => {
    dispatch(reduxChangeLoanUnit({ unitField, amountField, newUnit, convertedAmount }));
  };

  const changeExpenseUnit = (unitField, amountField, newUnit, convertedAmount) => {
    dispatch(reduxChangeExpenseUnit({ unitField, amountField, newUnit, convertedAmount }));
  };

  const [saveTrigger, setSaveTrigger] = useState(0);

  const saveSettingsToLocal = (data) => {
    // Settings are now persisted via Redux, just signal the update
    setSaveTrigger((prev) => prev + 1);
  };

  return (
    <EmiContext.Provider
      value={{
        loanDetails,
        updateLoanDetails,
        changeLoanUnit,
        expenses,
        updateExpenses,
        changeExpenseUnit,
        prepayments,
        updatePrepayments,
        calculatedValues,
        currency,
        setCurrency,
        themeMode,
        setThemeMode,
        autoSave,
        setAutoSave,
        saveSettingsToLocal,
        saveTrigger,
      }}
    >
      {children}
    </EmiContext.Provider>
  );
};
