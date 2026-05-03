import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { selectCalculatedValues } from '../../features/emiCalculator/utils/emiCalculator';
import { selectExpenses, selectCurrency } from '../../store/emiSlice';
import {
  Box,
  Typography,
  Grid,
  Stack,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import { formatCurrency } from '../../utils/formatting';
import DetailRow from '../common/DetailRow';

const PieChartComponent = () => {
  const theme = useTheme();
  const calculatedValues = useSelector(selectCalculatedValues);
  const expenses = useSelector(selectExpenses);
  const currency = useSelector(selectCurrency);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  if (!calculatedValues?.schedule?.length)
    return <Typography color="text.disabled">No data available</Typography>;

  const downPaymentFees =
    calculatedValues.marginInRs +
    calculatedValues.feesInRs +
    calculatedValues.oneTimeInRs;
  const principal = calculatedValues.totalPrincipal;
  const prepayments = calculatedValues.totalPrepayments;
  const interest = calculatedValues.totalInterest;
  const taxesInsMaint =
    (calculatedValues.taxesYearlyInRs + calculatedValues.homeInsYearlyInRs) *
      (calculatedValues.schedule.length / 12) +
    expenses.maintenance * calculatedValues.schedule.length;

  const chartData = [
    { name: 'Initial', value: downPaymentFees, color: COLORS[0] },
    { name: 'Principal', value: principal, color: COLORS[1] },
    { name: 'Prepay', value: prepayments, color: COLORS[2] },
    { name: 'Interest', value: interest, color: COLORS[3] },
    { name: 'Maint', value: taxesInsMaint, color: COLORS[4] },
  ].filter((d) => d.value > 0);

  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ height: 260, width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="75%"
                outerRadius="95%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v, currency)} />
            </PieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              Total Cost
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {formatCurrency(calculatedValues.totalPayments, currency)}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <DetailRow
            label="Down Payment"
            value={formatCurrency(downPaymentFees, currency)}
            indicatorColor={COLORS[0]}
          />
          <DetailRow
            label="Principal"
            value={formatCurrency(principal, currency)}
            indicatorColor={COLORS[1]}
          />
          <DetailRow
            label="Prepayments"
            value={formatCurrency(prepayments, currency)}
            indicatorColor={COLORS[2]}
          />
          <DetailRow
            label="Interest"
            value={formatCurrency(interest, currency)}
            indicatorColor={COLORS[3]}
          />
          <DetailRow
            label="Taxes/Maint"
            value={formatCurrency(taxesInsMaint, currency)}
            indicatorColor={COLORS[4]}
          />

          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: '1px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.3),
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Grand Total
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: 'primary.main' }}
              >
                {formatCurrency(calculatedValues.totalPayments, currency)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PieChartComponent;
