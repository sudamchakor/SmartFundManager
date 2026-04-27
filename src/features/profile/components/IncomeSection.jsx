import React from "react";
import FinancialSection from "./FinancialSection";

export default function IncomeSection(props) {
  return <FinancialSection isIncome={true} {...props} />;
}