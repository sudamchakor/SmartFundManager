import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SliderInput from '../common/SliderInput';

export default function GoalForm({ onAdd, currentYear }) {
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetYear: currentYear + 5,
    investmentType: 'sip', // Default to Standard SIP
    stepUpRate: 0, // Default step-up rate
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetYear) {
      onAdd({
        id: Date.now(),
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        targetYear: Number(newGoal.targetYear),
        investmentType: newGoal.investmentType,
        stepUpRate: newGoal.investmentType === 'step_up_sip' ? Number(newGoal.stepUpRate) : 0,
      });
      setNewGoal({ name: '', targetAmount: '', targetYear: currentYear + 5, investmentType: 'sip', stepUpRate: 0 });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Add Custom Goal</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          size="small"
          label="Goal Name"
          value={newGoal.name}
          onChange={e => setNewGoal({...newGoal, name: e.target.value})}
          fullWidth
          placeholder="e.g., Car Purchase, Vacation, etc."
        />

        <SliderInput
          label="Target Amount"
          value={Number(newGoal.targetAmount) || 0}
          onChange={(val) => setNewGoal({...newGoal, targetAmount: val})}
          min={0}
          max={50000000}
          step={100000}
          showInput={true}
        />

        <SliderInput
          label="Timeline (Target Year)"
          value={Number(newGoal.targetYear) || currentYear + 5}
          onChange={(val) => setNewGoal({...newGoal, targetYear: val})}
          min={currentYear}
          max={currentYear + 50}
          step={1}
          showInput={true}
        />

        <FormControl size="small" fullWidth>
          <InputLabel>Investment Type</InputLabel>
          <Select
            value={newGoal.investmentType}
            label="Investment Type"
            onChange={(e) => setNewGoal({...newGoal, investmentType: e.target.value})}
          >
            <MenuItem value="sip">Standard SIP</MenuItem>
            <MenuItem value="lumpsum">Lumpsum</MenuItem>
            <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
          </Select>
        </FormControl>

        {newGoal.investmentType === 'step_up_sip' && (
          <SliderInput
            label="Annual Step-Up Rate (%)"
            value={Number(newGoal.stepUpRate) || 0}
            onChange={(val) => setNewGoal({...newGoal, stepUpRate: val})}
            min={0}
            max={20}
            step={0.5}
            showInput={true}
            unit="%"
          />
        )}

        <Divider sx={{ my: 1 }} />

        <Button
          variant="contained"
          size="large"
          onClick={handleAddGoal}
          sx={{ mt: 1 }}
        >
          Add Goal
        </Button>
      </Box>
    </Paper>
  );
}
