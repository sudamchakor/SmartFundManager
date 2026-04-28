import React from "react";
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

  return (
    <Grid container spacing={3}>
      {/* Wealth Projection Engine */}
      <Grid item xs={12}>
        <WealthProjectionEngine />
      </Grid>

      {/* Donut Chart */}
      <Grid item xs={12} md={6}>
        <Box sx={{ width: "100%", minHeight: 300 }}>
          <CashFlowDonutChart donutData={donutData} />
        </Box>
      </Grid>
    </Grid>
  );
}
