import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  selectCurrentAge,
  selectRetirementAge,
} from '../../../store/profileSlice';

const AssetAllocationChart = forwardRef((props, ref) => {
  const currentAge = useSelector(selectCurrentAge);
  const retirementAge = useSelector(selectRetirementAge);
  const theme = useTheme();
  const componentRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getRef: () => componentRef
  }));

  const glidePathData = useMemo(() => {
    const data = [];
    const maxAge = retirementAge;
    const startAge = currentAge;

    for (let age = startAge; age <= maxAge; age++) {
      // Simplified glide path logic: 
      // E.g., 100 - age rule for equity, then adjusted
      // Let's create a smooth transition where Equity drops and Debt rises as age approaches retirement.
      
      const yearsToRetirement = maxAge - age;
      const totalYears = maxAge - startAge;
      
      // Let's say at startAge, Equity is 80%, Debt is 20%
      // At retirementAge, Equity is 40%, Debt is 60%
      // This is a linear interpolation
      
      const equityStart = 80;
      const equityEnd = 40;
      
      let equityPercent = equityEnd;
      if (totalYears > 0) {
          equityPercent = equityEnd + ((yearsToRetirement / totalYears) * (equityStart - equityEnd));
      }

      const debtPercent = 100 - equityPercent;

      data.push({
        age,
        Equity: Number(equityPercent.toFixed(2)),
        Debt: Number(debtPercent.toFixed(2)),
      });
    }
    return data;
  }, [currentAge, retirementAge]);

  return (
    <Card sx={{ height: '100%', mt: 3, mb: 4 }} ref={componentRef}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Asset Allocation Glide Path
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Visualizing the shift from high-growth Equity (12% expected return) to safer Debt (7% expected return) as you approach age {retirementAge} to protect your accumulated wealth.
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={glidePathData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`} 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={(label) => `Age: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Debt - Bottom Layer (Safer) */}
              <Area 
                type="monotone" 
                dataKey="Debt" 
                stackId="1" 
                stroke={theme.palette.info.main} 
                fill={theme.palette.info.light} 
                name="Debt (7% Return)"
              />
              
              {/* Equity - Top Layer (Riskier) */}
              <Area 
                type="monotone" 
                dataKey="Equity" 
                stackId="1" 
                stroke={theme.palette.primary.main} 
                fill={theme.palette.primary.light} 
                name="Equity (12% Return)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

export default AssetAllocationChart;
