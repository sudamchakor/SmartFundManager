import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel,
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, IconButton, List, ListItem, ListItemText, Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  addIncome, addExpense, addGoal, setBasicInfo, setCurrentAge, setRetirementAge,
  setCareerGrowthRate, setGeneralInflationRate, selectProfileExpenses, selectEducationInflationRate
} from "../../../store/profileSlice";
import SliderInput from "../../../components/common/SliderInput";
import GoalForm from "../components/GoalForm";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents";

const steps = ["Basic Information", "Add Income", "Add Expenses", "Set Goals"];

export default function OnboardingModal({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const profileExpenses = useSelector(selectProfileExpenses);
  const educationInflationRate = useSelector(selectEducationInflationRate);
  
  const currentYear = new Date().getFullYear();

  const [basicInfo, setBasicInfoState] = useState({
    name: "",
    age: 30,
    occupation: "",
    riskTolerance: "medium",
    retirementAge: 60,
    careerGrowthRate: 0.08,
    generalInflationRate: 0.06,
  });

  const [income, setIncome] = useState({ name: "", amount: 0, frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
  const [incomesList, setIncomesList] = useState([]);

  const [expense, setExpense] = useState({ name: "", amount: 0, category: "basic", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
  const [expensesList, setExpensesList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [showCustomGoalForm, setShowCustomGoalForm] = useState(false);
  const [customGoalData, setCustomGoalData] = useState({ name: "", targetAmount: 0, targetYear: currentYear + 5, category: "general", investmentPlans: [] });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinish = () => {
    dispatch(setBasicInfo({
      name: basicInfo.name,
      age: basicInfo.age,
      occupation: basicInfo.occupation,
      riskTolerance: basicInfo.riskTolerance,
    }));
    dispatch(setCurrentAge(basicInfo.age));
    dispatch(setRetirementAge(basicInfo.retirementAge));
    dispatch(setCareerGrowthRate(basicInfo.careerGrowthRate));
    dispatch(setGeneralInflationRate(basicInfo.generalInflationRate));

    incomesList.forEach((inc) =>
      dispatch(addIncome({ ...inc, id: Date.now() + Math.random() }))
    );
    expensesList.forEach((exp) =>
      dispatch(addExpense({ ...exp, id: Date.now() + Math.random() }))
    );
    goalsList.forEach((goal) => {
      dispatch(addGoal({ ...goal, id: Date.now() + Math.random() }));
    });
    localStorage.setItem("isProfileCreated", "true");
    onClose();
  };

  const handleAddIncome = () => {
    if (income.name && income.amount) {
      setIncomesList([...incomesList, { ...income, amount: Number(income.amount) }]);
      setIncome({ name: "", amount: 0, frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
    }
  };

  const handleAddExpense = () => {
    if (expense.name && expense.amount) {
      setExpensesList([...expensesList, { ...expense, amount: Number(expense.amount) }]);
      setExpense({ name: "", amount: 0, category: "basic", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
    }
  };

  const applyRetirementGoal = () => {
    const yearsToRetirement = basicInfo.retirementAge - basicInfo.age;
    const monthlyBasicExpenses = expensesList
      .filter((e) => e.category === "basic")
      .reduce((sum, e) => sum + e.amount, 0);
    let yearlyExpenses = monthlyBasicExpenses * 12;
    let targetAmount = Math.round(yearlyExpenses / 0.04);
    if (yearsToRetirement > 0) {
      targetAmount = targetAmount * Math.pow(1 + basicInfo.generalInflationRate, yearsToRetirement);
    }
    setGoalsList([...goalsList, {
      name: "Retirement",
      targetAmount: targetAmount,
      targetYear: currentYear + (yearsToRetirement > 0 ? yearsToRetirement : 1),
      category: "retirement",
      investmentPlans: [],
    }]);
  };

  const applyEducationGoal = () => {
    const yearsToCollege = 18;
    let targetAmount = 5000000;
    if (yearsToCollege > 0) {
      targetAmount = targetAmount * Math.pow(1 + educationInflationRate, yearsToCollege);
    }
    setGoalsList([...goalsList, {
      name: "Child's Higher Education",
      targetAmount: Math.round(targetAmount),
      targetYear: currentYear + (yearsToCollege > 0 ? yearsToCollege : 1),
      category: "education",
      investmentPlans: [],
    }]);
  };

  const applyEmergencyFundGoal = () => {
    const totalMonthlyOutflow = expensesList.reduce((sum, e) => sum + e.amount, 0);
    const targetAmount = Math.round(totalMonthlyOutflow * 6);
    setGoalsList([...goalsList, {
      name: "Emergency Fund",
      targetAmount: targetAmount,
      targetYear: currentYear + 1,
      category: "safety",
      investmentPlans: [],
    }]);
  };

  const handleAddCustomGoal = (goalData) => {
    setGoalsList([...goalsList, { ...goalData, isCustom: true }]);
    setShowCustomGoalForm(false);
    setCustomGoalData({ name: "", targetAmount: 0, targetYear: currentYear + 5, category: "general", investmentPlans: [] });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Tell us a bit about yourself.</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Name" value={basicInfo.name} onChange={(e) => setBasicInfoState({ ...basicInfo, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Occupation" value={basicInfo.occupation} onChange={(e) => setBasicInfoState({ ...basicInfo, occupation: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Current Age" value={basicInfo.age} onChange={(val) => setBasicInfoState({ ...basicInfo, age: val })} min={18} max={100} step={1} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Retirement Age" value={basicInfo.retirementAge} onChange={(val) => setBasicInfoState({ ...basicInfo, retirementAge: val })} min={basicInfo.age} max={100} step={1} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Expected Career Growth (%)" value={(basicInfo.careerGrowthRate * 100).toFixed(1)} onChange={(val) => setBasicInfoState({ ...basicInfo, careerGrowthRate: val / 100 })} min={0} max={20} step={0.1} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Expected Inflation Rate (%)" value={(basicInfo.generalInflationRate * 100).toFixed(1)} onChange={(val) => setBasicInfoState({ ...basicInfo, generalInflationRate: val / 100 })} min={0} max={20} step={0.1} />
              </Grid>
              <Grid item xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Risk Tolerance</InputLabel>
                  <Select value={basicInfo.riskTolerance} label="Risk Tolerance" onChange={(e) => setBasicInfoState({ ...basicInfo, riskTolerance: e.target.value })}>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Add your main income sources to get started.</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Income Source (e.g., Salary)" value={income.name} onChange={(e) => setIncome({ ...income, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Amount" value={Number(income.amount) || 0} onChange={(val) => setIncome({ ...income, amount: val })} min={0} max={10000000} step={1000} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={income.frequency} label="Frequency" onChange={(e) => setIncome({ ...income, frequency: e.target.value })}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <SliderInput label="Start Year" value={income.startYear} onChange={(val) => setIncome({ ...income, startYear: val })} min={currentYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SliderInput label="End Year" value={income.endYear} onChange={(val) => setIncome({ ...income, endYear: val })} min={income.startYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" fullWidth onClick={handleAddIncome} disabled={!income.name || income.amount === 0}>Add</Button>
              </Grid>
            </Grid>
            {incomesList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {incomesList.map((inc, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setIncomesList(incomesList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={inc.name} secondary={`${inc.amount} (${inc.frequency})`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Add your monthly expenses to calculate your investable surplus.</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Expense Name" value={expense.name} onChange={(e) => setExpense({ ...expense, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Amount" value={Number(expense.amount) || 0} onChange={(val) => setExpense({ ...expense, amount: val })} min={0} max={1000000} step={500} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={expense.category} label="Category" onChange={(e) => setExpense({ ...expense, category: e.target.value })}>
                    <MenuItem value="basic">Basic Need</MenuItem>
                    <MenuItem value="discretionary">Discretionary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={expense.frequency} label="Frequency" onChange={(e) => setExpense({ ...expense, frequency: e.target.value })}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Start Year" value={expense.startYear} onChange={(val) => setExpense({ ...expense, startYear: val })} min={currentYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="End Year" value={expense.endYear} onChange={(val) => setExpense({ ...expense, endYear: val })} min={expense.startYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" fullWidth onClick={handleAddExpense} disabled={!expense.name || expense.amount === 0}>Add</Button>
              </Grid>
            </Grid>
            {expensesList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {expensesList.map((exp, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setExpensesList(expensesList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={exp.name} secondary={`${exp.amount} (${exp.category})`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            {showCustomGoalForm ? (
              <Box>
                 <GoalForm
                   goal={customGoalData}
                   currentYear={currentYear}
                   onSave={setCustomGoalData}
                 />
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                   <Button onClick={() => setShowCustomGoalForm(false)}>Cancel</Button>
                   <Button variant="contained" onClick={() => handleAddCustomGoal(customGoalData)} disabled={!customGoalData.name || !customGoalData.targetAmount}>Add Custom Goal</Button>
                 </Box>
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom>Select a predefined goal or create a custom one.</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={applyRetirementGoal} sx={{ height: "100%", py: 2 }}>
                      🎯 Retirement
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={applyEducationGoal} sx={{ height: "100%", py: 2 }}>
                      🎓 Child's Education
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={applyEmergencyFundGoal} sx={{ height: "100%", py: 2 }}>
                      🛟 Emergency Fund
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => setShowCustomGoalForm(true)} sx={{ height: "100%", py: 2 }}>
                      ➕ Custom Goal
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}

            {goalsList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {goalsList.map((goal, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setGoalsList(goalsList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={goal.name} secondary={`Target: ${goal.targetAmount}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Welcome! Let's Setup Your Profile</DialogTitle>
      <Divider />
      <DialogContent sx={{ minHeight: 280, pb: showCustomGoalForm ? 10 : 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>{steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      {!showCustomGoalForm && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Skip</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep > 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
          {activeStep === steps.length - 1 ? (<Button onClick={handleFinish} variant="contained" color="primary">Finish</Button>) : (<Button onClick={handleNext} variant="contained">Next</Button>)}
        </DialogActions>
      )}
    </Dialog>
  );
}
