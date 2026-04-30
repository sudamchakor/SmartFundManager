import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { selectCalculatedValues } from '../../emiCalculator/utils/emiCalculator';
import { selectExpectedReturnRate } from '../../../store/profileSlice';
import { selectCurrency } from '../../../store/emiSlice';
import { formatCurrency } from '../../../utils/formatting';

const DebtAccelerator = forwardRef((props, ref) => {
  const calculatedValues = useSelector(selectCalculatedValues);
  const expectedReturnRate = useSelector(selectExpectedReturnRate);
  const currency = useSelector(selectCurrency);

  const [extraPayment, setExtraPayment] = useState(10000);

  const baseEmi = calculatedValues.emi || 0;
  const loanAmount = calculatedValues.loanAmount || 0;
  const monthlyInterestRate = (calculatedValues.interestRate || 8.5) / 12 / 100;

  const calculatePrepaymentImpact = (extraMonthly) => {
    let balance = loanAmount;
    let totalInterest = 0;
    let months = 0;

    if (balance <= 0 || baseEmi + extraMonthly <= 0) return { months: 0, interest: 0 };

    while (balance > 0 && months < 1200) {
      const interestForMonth = balance * monthlyInterestRate;
      totalInterest += interestForMonth;
      
      let principalForMonth = (baseEmi + extraMonthly) - interestForMonth;
      
      if (principalForMonth <= 0) {
        return { months: Infinity, interest: Infinity };
      }

      if (balance < principalForMonth) {
        principalForMonth = balance;
      }

      balance -= principalForMonth;
      months++;
    }

    return { months, interest: totalInterest };
  };

  const impactData = useMemo(() => {
    const baseImpact = calculatePrepaymentImpact(0);
    const newImpact = calculatePrepaymentImpact(extraPayment);

    const monthsSaved = Math.max(0, baseImpact.months - newImpact.months);
    const yearsSaved = (monthsSaved / 12).toFixed(1);
    const interestSaved = Math.max(0, baseImpact.interest - newImpact.interest);

    let investmentValue = 0;
    const monthlyReturnRate = expectedReturnRate / 12;
    for (let i = 0; i < baseImpact.months; i++) {
        investmentValue = (investmentValue + extraPayment) * (1 + monthlyReturnRate);
    }
    
    const investmentGains = investmentValue - (extraPayment * baseImpact.months);

    return {
      yearsSaved,
      interestSaved,
      investmentGains,
      netDifference: investmentGains - interestSaved
    };
  }, [extraPayment, loanAmount, baseEmi, monthlyInterestRate, expectedReturnRate]);

  const verdictText = useMemo(() => {
    if (impactData.netDifference > 0) {
      return `Investing yields ${formatCurrency(Math.abs(impactData.netDifference), currency)} more than prepaying.`;
    }
    return `Prepaying saves ${formatCurrency(Math.abs(impactData.netDifference), currency)} more than investing.`;
  }, [impactData, currency]);

  useImperativeHandle(ref, () => ({
    getVerdict: () => verdictText,
  }));

  if (loanAmount <= 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Debt Accelerator
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          See the impact of paying extra towards your loan vs. investing that money in the market.
        </Typography>

        <Box sx={{ my: 4, px: { xs: 1, sm: 4 } }}>
          <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
            Extra Monthly Payment: {formatCurrency(extraPayment, currency)}
          </Typography>
          <Slider
            value={extraPayment}
            min={0}
            max={50000}
            step={1000}
            onChange={(e, val) => setExtraPayment(val)}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => formatCurrency(val, currency)}
            color="secondary"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: '#f8fdf8', border: '1px solid #c8e6c9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="success.main">Invest in Market</Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                Investing {formatCurrency(extraPayment, currency)} monthly at {expectedReturnRate * 100}% returns.
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', my: 2 }}>
                +{formatCurrency(impactData.investmentGains, currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Estimated Gains
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: '#fff8f8', border: '1px solid #ffcdd2' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyOffIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" color="error.main">Prepay Loan</Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                Paying {formatCurrency(extraPayment, currency)} extra towards your loan principal.
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', my: 2 }}>
                {formatCurrency(impactData.interestSaved, currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Total Interest Saved
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: 'error.dark' }}>
                Debt-free {impactData.yearsSaved} years sooner!
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="subtitle1">
                <strong>Verdict: </strong>
                {verdictText}
            </Typography>
        </Box>

      </CardContent>
    </Card>
  );
});

export default DebtAccelerator;
