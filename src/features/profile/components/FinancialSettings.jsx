import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Divider,
} from '@mui/material';
import {
  selectTaxRegime,
  selectEmergencyFundTarget,
  selectRiskProfile,
  updateFinancialSettings,
} from '../../../store/profileSlice';

const questions = [
  {
    id: 'q1',
    text: 'In general, how would your best friend describe you as a risk taker?',
    options: [
      { value: 1, label: 'A real gambler' },
      { value: 2, label: 'Willing to take risks after completing adequate research' },
      { value: 3, label: 'Cautious' },
      { value: 4, label: 'A real risk avoider' },
    ],
  },
  {
    id: 'q2',
    text: 'You are on a TV game show and can choose one of the following. Which would you take?',
    options: [
      { value: 1, label: '$1,000 in cash' },
      { value: 2, label: 'A 50% chance at winning $5,000' },
      { value: 3, label: 'A 25% chance at winning $10,000' },
      { value: 4, label: 'A 5% chance at winning $100,000' },
    ],
  },
  {
    id: 'q3',
    text: 'You have just finished saving for a "once-in-a-lifetime" vacation. Three weeks before you plan to leave, you lose your job. You would:',
    options: [
      { value: 1, label: 'Cancel the vacation' },
      { value: 2, label: 'Take a much more modest vacation' },
      { value: 3, label: 'Go as scheduled, reasoning that you need the time to prepare for a job search' },
      { value: 4, label: 'Extend your vacation, because this might be your last chance to go first-class' },
    ],
  },
  {
    id: 'q4',
    text: 'If you unexpectedly received $20,000 to invest, what would you do?',
    options: [
      { value: 1, label: 'Deposit it in a bank account, money market account, or an insured CD' },
      { value: 2, label: 'Invest it in safe high quality bonds or bond mutual funds' },
      { value: 3, label: 'Invest it in stocks or stock mutual funds' },
    ],
  },
  {
    id: 'q5',
    text: 'In terms of experience, how comfortable are you investing in stocks or stock mutual funds?',
    options: [
      { value: 1, label: 'Not at all comfortable' },
      { value: 2, label: 'Somewhat comfortable' },
      { value: 3, label: 'Very comfortable' },
    ],
  },
];

const FinancialSettings = () => {
  const dispatch = useDispatch();
  
  const currentTaxRegime = useSelector(selectTaxRegime);
  const currentEmergencyTarget = useSelector(selectEmergencyFundTarget);
  const currentRiskProfile = useSelector(selectRiskProfile);

  const [taxRegime, setTaxRegime] = useState(currentTaxRegime || 'new');
  const [emergencyTarget, setEmergencyTarget] = useState(currentEmergencyTarget || 6);
  const [riskAnswers, setRiskAnswers] = useState(currentRiskProfile || { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2 });

  useEffect(() => {
    setTaxRegime(currentTaxRegime || 'new');
    setEmergencyTarget(currentEmergencyTarget || 6);
    if (currentRiskProfile) setRiskAnswers(currentRiskProfile);
  }, [currentTaxRegime, currentEmergencyTarget, currentRiskProfile]);

  const handleRiskChange = (questionId, value) => {
    setRiskAnswers(prev => ({
      ...prev,
      [questionId]: Number(value)
    }));
  };

  const handleSave = () => {
    dispatch(updateFinancialSettings({
      taxRegime,
      emergencyFundTarget: emergencyTarget,
      riskProfile: riskAnswers
    }));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Financial Settings</Typography>}
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
        
        {/* Tax Regime */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
              Current Tax Regime
            </FormLabel>
            <RadioGroup
              row
              value={taxRegime}
              onChange={(e) => setTaxRegime(e.target.value)}
            >
              <FormControlLabel value="old" control={<Radio />} label="Old Regime (Deductions Allowed)" />
              <FormControlLabel value="new" control={<Radio />} label="New Regime (Lower Rates, No Deductions)" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Emergency Fund Target */}
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Emergency Fund Target</InputLabel>
            <Select
              value={emergencyTarget}
              label="Emergency Fund Target"
              onChange={(e) => setEmergencyTarget(e.target.value)}
            >
              <MenuItem value={3}>3 Months of Expenses</MenuItem>
              <MenuItem value={6}>6 Months of Expenses (Recommended)</MenuItem>
              <MenuItem value={12}>12 Months of Expenses (Conservative)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Risk Tolerance Questionnaire */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Risk Tolerance Questionnaire
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your answers will automatically adjust your Expected Return Rate in the Wealth tab.
          </Typography>

          {questions.map((q) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                  {q.text}
                </FormLabel>
                <RadioGroup
                  value={riskAnswers[q.id]}
                  onChange={(e) => handleRiskChange(q.id, e.target.value)}
                >
                  {q.options.map((opt) => (
                    <FormControlLabel 
                      key={opt.value} 
                      value={opt.value} 
                      control={<Radio size="small" />} 
                      label={<Typography variant="body2">{opt.label}</Typography>} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save Settings
            </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default FinancialSettings;
