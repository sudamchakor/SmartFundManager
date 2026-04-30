import React, { useRef, useEffect } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfileExpenses,
  selectTotalMonthlyGoalContributions,
  selectCurrentSurplus,
  selectCareerGrowthRate,
  selectGeneralInflationRate,
  setCareerGrowthRate,
  setGeneralInflationRate,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import CashFlowDonutChart from "../components/CashFlowDonutChart";
import WealthProjectionEngine from "../components/WealthProjectionEngine";
import GoalCoverage from "../components/GoalCoverage";
import ExpenseOptimizer from "../components/ExpenseOptimizer";
import DebtAccelerator from "../components/DebtAccelerator";
import CorrectionEngine from "../components/CorrectionEngine";
import AutoBalancer from "../components/AutoBalancer"; // Import AutoBalancer
import AssetAllocationChart from "../components/AssetAllocationChart"; // Import AssetAllocationChart
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";
import SliderInput from "../../../components/common/SliderInput";

export default function WealthTab() {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const expenses = useSelector(selectProfileExpenses) || [];
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate =
    typeof careerGrowthRaw === "object"
      ? careerGrowthRaw.value
      : careerGrowthRaw || 0;
  const careerGrowthType =
    typeof careerGrowthRaw === "object" ? careerGrowthRaw.type : "percentage";
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0.06;

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);

  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const investableSurplus = useSelector(selectCurrentSurplus);

  const needsValue = expenses
    .filter((e) => e.category === "basic")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const wantsValue = expenses
    .filter((e) => e.category === "discretionary")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const donutData = [
    {
      name: "Needs",
      value: needsValue,
    },
    {
      name: "Wants",
      value: wantsValue,
    },
    { name: "Loan EMIs", value: monthlyEmi || 0 },
    {
      name: "Future Wealth (Goals)",
      value: totalMonthlyGoalContributions,
    },
    {
      name: "Surplus",
      value: investableSurplus > 0 ? investableSurplus : 0,
    },
  ].filter((item) => item.value > 0);

  const engineRef = useRef(null);
  const acceleratorRef = useRef(null);
  const allocationChartRef = useRef(null);
  const goalCoverageRef = useRef(null);

  // Example of how the parent can access the engine's data for export
  // This ref can be passed up via context or Redux if the Header needs it directly,
  // or the export logic can be triggered via a custom event/state change.
  useEffect(() => {
    // Store ref in window object temporarily to allow Header to access it easily
    // In a real app, you might use Context or a more robust state management approach
    window.__wealthEngineRef = engineRef;
    window.__debtAcceleratorRef = acceleratorRef;
    window.__allocationChartRef = allocationChartRef;
    window.__goalCoverageRef = goalCoverageRef;

    return () => {
      window.__wealthEngineRef = null;
      window.__debtAcceleratorRef = null;
      window.__allocationChartRef = null;
      window.__goalCoverageRef = null;
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CorrectionEngine /> 
      </Grid>
      
      <Grid item xs={12}>
        <AutoBalancer /> 
      </Grid>

      <Grid item xs={12}>
        <WealthProjectionEngine ref={engineRef} />
      </Grid>

      {/* Add AssetAllocationChart here */}
      <Grid item xs={12}>
        <AssetAllocationChart ref={allocationChartRef} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ width: "100%", minHeight: 300 }}>
          <CashFlowDonutChart donutData={donutData} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <GoalCoverage ref={goalCoverageRef} />
      </Grid>

      <Grid item xs={12}>
        <ExpenseOptimizer />
      </Grid>

      {/* Add DebtAccelerator here */}
      <Grid item xs={12}>
        <DebtAccelerator ref={acceleratorRef} />
      </Grid>
    </Grid>
  );
}
