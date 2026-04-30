import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {
  selectCurrentSurplus,
  selectProfileExpenses,
  selectStepUpPercentage,
  updateExpense,
  setStepUpPercentage,
} from '../../../store/profileSlice';
import { selectCurrency } from '../../../store/emiSlice';
import { formatCurrency } from '../../../utils/formatting';

const CorrectionEngine = () => {
  const dispatch = useDispatch();
  const surplus = useSelector(selectCurrentSurplus);
  const expenses = useSelector(selectProfileExpenses);
  const currentStepUp = useSelector(selectStepUpPercentage);
  const currency = useSelector(selectCurrency);

  const recommendation = useMemo(() => {
    if (surplus >= 0) {
      return null;
    }

    const deficit = Math.abs(surplus);
    const discretionaryExpenses = expenses.filter(e => e.category === 'discretionary');
    const totalDiscretionary = discretionaryExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalDiscretionary === 0) {
        return {
            message: "You have a deficit, but no discretionary expenses to reduce. Consider increasing your income or reducing basic needs/goals.",
            actionable: false
        }
    }

    // Goal: Find the minimum % reduction in Discretionary needed to cover the deficit.
    // If deficit > totalDiscretionary, we max out reduction at 100% and suggest Step-Up changes
    // However, Step-Up only affects future years in the projection, not the *current* monthly surplus.
    // The prompt asks to "increase Step-up to 8%" as part of the recommendation.
    // I will interpret this as: Try to fix current deficit by reducing wants.
    // Then, suggest a standard growth strategy (like 8% step up) to prevent future deficits.

    let reductionNeededRatio = deficit / totalDiscretionary;
    let reductionPercentage = 0;
    let newStepUp = currentStepUp;
    let message = "";

    if (reductionNeededRatio <= 1) {
        // We can cover the deficit just by reducing wants
        reductionPercentage = Math.ceil(reductionNeededRatio * 100);
        message = `To reach a positive surplus, reduce your Discretionary spending by ${reductionPercentage}%.`;
        
        // Add the step-up suggestion as requested if it's currently low
        if (currentStepUp < 0.08) {
            newStepUp = 0.08;
            message += ` We also recommend increasing your Step-up SIP to ${newStepUp * 100}% to accelerate future wealth.`;
        }
    } else {
        // Cannot cover deficit entirely with wants
        reductionPercentage = 100;
        message = `Even cutting 100% of Discretionary spending leaves a deficit. You must reduce Basic Needs or Goal Contributions.`;
    }

    return {
        message,
        reductionPercentage,
        newStepUp,
        actionable: reductionNeededRatio <= 1,
        discretionaryExpenses
    };

  }, [surplus, expenses, currentStepUp]);

  const applyRecommendation = () => {
    if (!recommendation || !recommendation.actionable) return;

    // Apply expense reductions
    const reductionMultiplier = 1 - (recommendation.reductionPercentage / 100);
    recommendation.discretionaryExpenses.forEach(exp => {
        dispatch(updateExpense({
            ...exp,
            amount: Math.max(0, Math.round(exp.amount * reductionMultiplier))
        }));
    });

    // Apply Step-up increase
    if (recommendation.newStepUp !== currentStepUp) {
        dispatch(setStepUpPercentage(recommendation.newStepUp));
    }
  };

  if (surplus >= 0) {
    return null; // Hide if there's no deficit
  }

  return (
    <Card sx={{ mt: 3, mb: 4, bgcolor: '#fff3e0', border: '1px solid #ffcc80' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoFixHighIcon sx={{ color: 'warning.dark', mr: 1 }} />
          <Typography variant="h6" color="warning.dark">
            Correction Engine
          </Typography>
        </Box>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have a current deficit of <strong>{formatCurrency(Math.abs(surplus), currency)}</strong>.
        </Alert>

        {recommendation && (
            <Box>
                <Typography variant="body1" paragraph>
                    {recommendation.message}
                </Typography>
                
                {recommendation.actionable && (
                    <Button 
                        variant="contained" 
                        color="warning" 
                        onClick={applyRecommendation}
                        startIcon={<AutoFixHighIcon />}
                    >
                        Apply Auto-Correction
                    </Button>
                )}
            </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CorrectionEngine;
