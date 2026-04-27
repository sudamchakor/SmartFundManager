import React from "react";
import FinancialSection from "./FinancialSection";

export default function ExpenseSection(props) {
  return <FinancialSection isIncome={false} {...props} />;
}