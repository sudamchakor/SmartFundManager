import React, { useState, useMemo, useCallback } from 'react';
import { Box, Grid, Paper, Typography, FormControlLabel, Switch, Button, Divider, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditableGoalItem from '../common/EditableGoalItem';
import GoalForm from './GoalForm';
import {
  selectGoals,
  selectGoalInvestments,
  selectConsiderInflation,
  selectCurrentAge,
  selectRetirementAge,
  selectProfileExpenses,
  addGoal,
  updateGoal,
  deleteGoal,
  setConsiderInflation,
  setGoalInvestment,
  selectGeneralInflationRate,
  selectEducationInflationRate,
  selectCareerGrowthRate, // Changed from selectExpectedAnnualSalaryHike
  selectCurrentSurplus, // Import the new current surplus selector
  selectTotalMonthlyIncome, // For wealth projection
  selectTotalMonthlyGoalContributions, // For wealth projection
} from '../../store/profileSlice';
import { selectCurrency } from '../../store/emiSlice';
import { selectCalculatedValues } from '../../utils/emiCalculator'; // Corrected import path
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { calculateSIP, calculateStepUpSIP, calculateLumpsum } from '../../utils/financialCalculations'; // Import financial calculations

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function FutureGoalsTab() {
  const dispatch = useDispatch();

  const goals = useSelector(selectGoals) || [];
  const goalInvestments = useSelector(selectGoalInvestments) || {};
  const considerInflation = useSelector(selectConsiderInflation) || false;
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const profileExpenses = useSelector(selectProfileExpenses) || [];
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0;
  const educationInflationRate = useSelector(selectEducationInflationRate) || 0;
  const careerGrowthRate = useSelector(selectCareerGrowthRate) || 0; // Changed from expectedAnnualSalaryHike
  const totalMonthlyIncome = useSelector(selectTotalMonthlyIncome) || 0;
  const totalMonthlyGoalContributions = useSelector(selectTotalMonthlyGoalContributions) || 0;
  const { emi: monthlyEmi } = useSelector(selectCalculatedValues); // Extracted emi from selectCalculatedValues
  const currency = useSelector(selectCurrency);

  const currentSurplus = useSelector(selectCurrentSurplus) || 0; // Use the combined surplus selector

  const [realValueToggle, setRealValueToggle] = useState(false); // State for "Real-Value" Toggle

  const formatCurrency = (val) => `${currency}${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const currentYear = new Date().getFullYear();

  // Helper function to calculate required investment for a goal
  const calculateRequiredInvestment = useCallback((targetAmount, yearsToGoal, investmentType, expectedReturn, stepUpRate = 0) => {
    if (yearsToGoal <= 0) return targetAmount; // If goal is in current or past year, need full amount now

    const annualReturnRate = expectedReturn / 100;

    if (investmentType === 'sip') {
      return calculateSIP(targetAmount, yearsToGoal, annualReturnRate);
    } else if (investmentType === 'step_up_sip') {
      return calculateStepUpSIP(targetAmount, yearsToGoal, annualReturnRate, stepUpRate / 100);
    } else if (investmentType === 'lumpsum') {
      // For lumpsum, we calculate the present value needed, but the monthly contribution will be 0
      // The actual lumpsum amount will be stored in goalInvestments
      return 0; // Lumpsum doesn't have a monthly contribution
    }
    return 0;
  }, []);

  const handleAddGoal = useCallback((goalData) => {
    const yearsToGoal = goalData.targetYear - currentYear;
    const expectedReturn = 8; // Default expected return for new goals

    let monthlyContribution = 0;
    if (goalData.investmentType !== 'lumpsum') {
      monthlyContribution = calculateRequiredInvestment(
        goalData.targetAmount,
        yearsToGoal,
        goalData.investmentType,
        expectedReturn,
        goalData.stepUpRate
      );
    }

    dispatch(addGoal({
      ...goalData,
      monthlyContribution: monthlyContribution,
      expectedReturn: expectedReturn, // Store expected return with goal
    }));
  }, [dispatch, currentYear, calculateRequiredInvestment]);


  const applyRetirementGoal = useCallback(() => {
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement < 0) {
      alert("Retirement age is in the past. Please adjust your retirement age.");
      return;
    }

    const monthlyBasicExpenses = profileExpenses.filter(e => e.category === 'basic').reduce((sum, e) => sum + e.amount, 0);
    let yearlyExpenses = monthlyBasicExpenses * 12;

    // Assuming a safe withdrawal rate of 4%
    let targetAmount = Math.round(yearlyExpenses / 0.04);

    // Adjust for inflation if considered
    if (considerInflation && yearsToRetirement > 0) {
      targetAmount = targetAmount * Math.pow(1 + generalInflationRate, yearsToRetirement);
    }

    const expectedReturn = 8; // Default for template
    const monthlyContribution = calculateRequiredInvestment(targetAmount, yearsToRetirement, 'sip', expectedReturn);

    dispatch(addGoal({
      id: Date.now(),
      name: "Retirement",
      targetAmount: targetAmount,
      targetYear: currentYear + yearsToRetirement,
      monthlyContribution: monthlyContribution,
      investmentType: 'sip',
      category: 'retirement',
      expectedReturn: expectedReturn,
      stepUpRate: 0,
    }));
  }, [dispatch, retirementAge, currentAge, profileExpenses, considerInflation, generalInflationRate, currentYear, calculateRequiredInvestment]);

  const applyEducationGoal = useCallback(() => {
    const yearsToCollege = 18; // Example: child is 0, goal in 18 years
    let targetAmount = 5000000; // Example amount for higher education

    // Adjust for education-specific inflation
    if (considerInflation && yearsToCollege > 0) {
      targetAmount = targetAmount * Math.pow(1 + educationInflationRate, yearsToCollege);
    }

    const expectedReturn = 8; // Default for template
    const monthlyContribution = calculateRequiredInvestment(targetAmount, yearsToCollege, 'sip', expectedReturn);

    dispatch(addGoal({
      id: Date.now(),
      name: "Child's Higher Education",
      targetAmount: Math.round(targetAmount),
      targetYear: currentYear + yearsToCollege,
      monthlyContribution: monthlyContribution,
      investmentType: 'sip',
      category: 'education',
      expectedReturn: expectedReturn,
      stepUpRate: 0,
    }));
  }, [dispatch, considerInflation, educationInflationRate, currentYear, calculateRequiredInvestment]);

  const applyEmergencyFundGoal = useCallback(() => {
    const totalMonthlyOutflow = profileExpenses.reduce((sum, e) => sum + e.amount, 0) + monthlyEmi + totalMonthlyGoalContributions;
    const targetAmount = Math.round(totalMonthlyOutflow * 6); // 6 months of expenses

    const yearsToGoal = 1; // Aim to build in 1 year
    const expectedReturn = 6; // Lower expected return for emergency fund (e.g., savings account)
    const monthlyContribution = calculateRequiredInvestment(targetAmount, yearsToGoal, 'sip', expectedReturn);

    dispatch(addGoal({
      id: Date.now(),
      name: "Emergency Fund",
      targetAmount: targetAmount,
      targetYear: currentYear + yearsToGoal,
      monthlyContribution: monthlyContribution,
      investmentType: 'savings', // Special type for emergency fund
      category: 'safety',
      expectedReturn: expectedReturn,
      stepUpRate: 0,
    }));
  }, [dispatch, profileExpenses, monthlyEmi, totalMonthlyGoalContributions, currentYear, calculateRequiredInvestment]);

  const handleInvestmentChange = useCallback((goalId, investmentData) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const yearsToGoal = goal.targetYear - currentYear;
    let monthlyContribution = 0;

    if (investmentData.investmentType === 'lumpsum') {
      // For lumpsum, the 'monthlyInvestment' in investmentData actually holds the lumpsum amount
      // We don't set a monthlyContribution for the goal itself, but store the lumpsum in goalInvestments
      monthlyContribution = 0;
    } else {
      monthlyContribution = calculateRequiredInvestment(
        goal.targetAmount,
        yearsToGoal,
        investmentData.investmentType,
        investmentData.expectedReturn,
        investmentData.stepUpRate
      );
    }

    // Update the goal's monthlyContribution and investment type in the profile slice
    dispatch(updateGoal({
      ...goal,
      monthlyContribution: monthlyContribution,
      investmentType: investmentData.investmentType,
      stepUpRate: investmentData.stepUpRate,
      expectedReturn: investmentData.expectedReturn,
    }));

    // Update the specific investment details in the goalInvestments slice
    dispatch(setGoalInvestment({ goalId, investmentData }));
  }, [dispatch, goals, currentYear, calculateRequiredInvestment]);


  // Wealth Projection Logic
  const wealthData = useMemo(() => {
    const maxGoalYear = goals.reduce((max, g) => Math.max(max, g.targetYear), currentYear + 10);
    const endYear = Math.max(maxGoalYear, currentYear + (retirementAge - currentAge), currentYear + 10); // Project at least 10 years or until retirement

    let currentPrincipalInvested = 0;
    let currentMarketGains = 0;
    let currentBonusGains = 0; // From income increments
    let currentTotalWealth = 0;

    const data = [];

    // Calculate total monthly SIPs from all goals
    const totalActiveGoalSips = goals.reduce((acc, goal) => {
      // Only consider SIPs that are not lumpsum and have a monthly contribution
      if (goal.investmentType !== 'lumpsum' && goal.monthlyContribution > 0) {
        return acc + goal.monthlyContribution;
      }
      return acc;
    }, 0);

    let currentMonthlyIncome = totalMonthlyIncome;
    let currentMonthlyOutflowExcludingGoals = profileExpenses.reduce((acc, exp) => acc + exp.amount, 0) + monthlyEmi;

    for (let year = currentYear; year <= endYear; year++) {
      const yearsFromNow = year - currentYear;
      const annualInvestmentReturn = 0.08; // Default market return
      const annualBonusReturn = 0.02; // Additional gains from income increments

      // Apply annual salary hike
      if (yearsFromNow > 0 && yearsFromNow % 1 === 0) { // Apply yearly
        currentMonthlyIncome *= (1 + careerGrowthRate); // Changed from expectedAnnualSalaryHike
      }

      // Calculate investable surplus for the year
      const annualInvestableSurplus = (currentMonthlyIncome - currentMonthlyOutflowExcludingGoals - totalActiveGoalSips) * 12;

      // Simulate wealth growth
      if (yearsFromNow > 0) {
        // Market Gains on previous total wealth
        currentMarketGains = currentTotalWealth * annualInvestmentReturn;

        // Bonus Gains from income increments (simplified: a portion of the increased income)
        const incomeIncreaseThisYear = (currentMonthlyIncome * 12) - (totalMonthlyIncome * Math.pow(1 + careerGrowthRate, yearsFromNow - 1) * 12); // Changed from expectedAnnualSalaryHike
        currentBonusGains = incomeIncreaseThisYear * annualBonusReturn; // A small percentage of the income increase as bonus gain

        // Principal Invested (current year's surplus)
        currentPrincipalInvested = annualInvestableSurplus;

        currentTotalWealth = (currentTotalWealth + currentPrincipalInvested) * (1 + annualInvestmentReturn);
      } else {
        // Initial values for current year
        currentPrincipalInvested = (currentMonthlyIncome - currentMonthlyOutflowExcludingGoals - totalActiveGoalSips) * 12;
        currentTotalWealth = currentPrincipalInvested;
      }

      // Apply "Real-Value" Toggle
      let displayWealth = currentTotalWealth;
      let displayPrincipal = currentPrincipalInvested;
      let displayMarketGains = currentMarketGains;
      let displayBonusGains = currentBonusGains;

      if (realValueToggle && yearsFromNow > 0) {
        displayWealth = currentTotalWealth / Math.pow(1 + generalInflationRate, yearsFromNow);
        displayPrincipal = currentPrincipalInvested / Math.pow(1 + generalInflationRate, yearsFromNow);
        displayMarketGains = currentMarketGains / Math.pow(1 + generalInflationRate, yearsFromNow);
        displayBonusGains = currentBonusGains / Math.pow(1 + generalInflationRate, yearsFromNow);
      }

      // Cumulative Loan Cost (from EMI slice)
      const cumulativeLoanCost = monthlyEmi * Math.min(yearsFromNow * 12, 240); // Assuming 20 year loan (240 months) max

      // Total Goals needed by this year (inflation adjusted if toggle is on)
      const totalGoalsThisYear = goals.reduce((sum, g) => {
        if (g.targetYear === year) {
          let target = g.targetAmount;
          if (considerInflation && g.category === 'education') {
            target = target * Math.pow(1 + educationInflationRate, yearsFromNow);
          } else if (considerInflation) {
            target = target * Math.pow(1 + generalInflationRate, yearsFromNow);
          }
          return sum + target;
        }
        return sum;
      }, 0);

      data.push({
        year,
        'Principal Invested': Math.round(displayPrincipal),
        'Market Gains': Math.round(displayMarketGains),
        'Bonus Gains': Math.round(displayBonusGains),
        'Total Wealth': Math.round(displayWealth),
        'Loan Cost': Math.round(cumulativeLoanCost),
        'Goals Target': totalGoalsThisYear > 0 ? Math.round(totalGoalsThisYear) : null,
      });
    }
    return data;
  }, [goals, currentYear, retirementAge, totalMonthlyIncome, profileExpenses, monthlyEmi, totalMonthlyGoalContributions, careerGrowthRate, realValueToggle, considerInflation, generalInflationRate, educationInflationRate]);


  const breakEvenYear = useMemo(() => {
    const breakEvenPoint = wealthData.find(d => d['Total Wealth'] >= d['Goals Target']);
    return breakEvenPoint ? breakEvenPoint.year : null;
  }, [wealthData]);


  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon /> Smart Goal Templates
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Button variant="outlined" onClick={applyRetirementGoal} fullWidth>
              🎯 Retirement
            </Button>
            <Button variant="outlined" onClick={applyEducationGoal} fullWidth>
              🎓 Child's Education
            </Button>
            <Button variant="outlined" onClick={applyEmergencyFundGoal} fullWidth>
              🛟 Emergency Fund (6M)
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <GoalForm onAdd={handleAddGoal} currentYear={currentYear} disableAdd={currentSurplus < 0} />
          {currentSurplus < 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Cannot add new goals. Your current surplus is negative.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Goals ({goals.length})</Typography>
            <FormControlLabel
              control={<Switch checked={considerInflation} onChange={(e) => dispatch(setConsiderInflation(e.target.checked))} />}
              label={<Typography variant="caption">Inflation ({generalInflationRate * 100}%)</Typography>}
            />
          </Box>

          {goals && goals.length > 0 ? goals.map(g => (
            <EditableGoalItem
              key={g.id}
              goal={g}
              currency={currency}
              currentYear={currentYear}
              considerInflation={considerInflation}
              onUpdate={(updated) => dispatch(updateGoal(updated))}
              onDelete={(id) => dispatch(deleteGoal(id))}
              onInvestmentChange={handleInvestmentChange}
              investmentAmount={goalInvestments[g.id]?.monthlyInvestment || 0}
            />
          )) : (
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2" color="textSecondary">
                No goals yet. Create one or use a template!
              </Typography>
            </Paper>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Wealth Projection vs Goals</Typography>
                <FormControlLabel
                  control={<Switch checked={realValueToggle} onChange={(e) => setRealValueToggle(e.target.checked)} />}
                  label={<Typography variant="caption">Show Real Value (Inflation Adjusted)</Typography>}
                />
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={wealthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(val) => `${currency}${val / 100000}L`} />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name === 'Goals Target') return [formatCurrency(value), 'Goals Target'];
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Principal Invested" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="Market Gains" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="Bonus Gains" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  <Line type="monotone" dataKey="Goals Target" stroke="#ff7c7c" strokeWidth={2} dot={false} />

                  {breakEvenYear ? (
                    <ReferenceLine x={breakEvenYear} stroke="green" strokeDasharray="3 3" label="Breakeven Point" />
                  ) : null}
                </AreaChart>
              </ResponsiveContainer>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                * Projected wealth assumes annual investment return of 8%. Bonus gains from income increments are estimated.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Goal Distribution & Investments</Typography>
              {goals.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goals.map(g => ({
                    name: g.name.substring(0, 10),
                    amount: g.targetAmount,
                    inflated: considerInflation && g.targetYear > currentYear
                      ? g.targetAmount * Math.pow(1 + (g.category === 'education' ? educationInflationRate : generalInflationRate), g.targetYear - currentYear)
                      : g.targetAmount,
                    monthlyContribution: g.monthlyContribution || 0,
                    year: g.targetYear
                  }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `${currency}${val / 100000}L`} />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        if (name === 'amount') return [formatCurrency(value), 'Target Amount'];
                        if (name === 'inflated') return [formatCurrency(value), 'Inflation-Adjusted'];
                        if (name === 'monthlyContribution') return [formatCurrency(value), 'Monthly Investment'];
                        return [formatCurrency(value), name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="amount" fill={COLORS[0]} name="Target Amount" />
                    {considerInflation && <Bar dataKey="inflated" fill={COLORS[1]} name="Inflation-Adjusted" />}
                    {goals.some(g => (g.monthlyContribution || 0) > 0) &&
                      <Bar dataKey="monthlyContribution" fill={COLORS[2]} name="Monthly Investment" />
                    }
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                  No goals added yet
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}