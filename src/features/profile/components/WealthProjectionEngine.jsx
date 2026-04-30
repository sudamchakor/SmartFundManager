import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Slider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import {
  selectWealthProjection,
  selectFinancialIndependenceYear,
  selectExpectedReturnRate,
  selectStepUpPercentage,
  setExpectedReturnRate,
  setStepUpPercentage,
} from "../../../store/profileSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Bar,
} from "recharts";
import { formatCurrency } from "../../../utils/formatting";
import { selectCurrency } from "../../../store/emiSlice";

// Helper function to format large numbers for Y-axis ticks
const formatLargeNumber = (num, currency) => {
  const absNum = Math.abs(num);
  let formattedNum;

  if (absNum >= 10000000) {
    // Crores
    formattedNum = `${(num / 10000000).toFixed(1)}Cr`;
  } else if (absNum >= 100000) {
    // Lakhs
    formattedNum = `${(num / 100000).toFixed(1)}L`;
  } else if (absNum >= 1000) {
    // Thousands
    formattedNum = `${(num / 1000).toFixed(1)}K`;
  } else {
    formattedNum = num.toString();
  }

  // Prepend currency symbol if available
  if (currency === "INR") {
    return `₹${formattedNum}`;
  } else if (currency === "USD") {
    return `$${formattedNum}`;
  }
  // Default or other currencies
  return `${currency} ${formattedNum}`;
};

const DataCard = ({ title, value, subValue }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" } }} // Adjusted for responsiveness
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontSize: { xs: "1.2rem", sm: "1rem", md: "1rem" },
          fontWeight: "bold",
        }} // Adjusted for responsiveness
      >
        {value}
      </Typography>
      {subValue && (
        <Typography variant="body2" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1">{`Age: ${label}`}</Typography>
        {payload.map((p) => (
          <Typography key={p.name} style={{ color: p.color }}>
            {`${p.name}: ${formatCurrency(p.value, currency)}`}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

const WealthProjectionEngine = () => {
  const dispatch = useDispatch();
  const projectionData = useSelector(selectWealthProjection);
  const financialIndependence = useSelector(selectFinancialIndependenceYear);
  const expectedReturnRate = useSelector(selectExpectedReturnRate);
  const stepUpPercentage = useSelector(selectStepUpPercentage);
  const currency = useSelector(selectCurrency);
  const theme = useTheme(); // Use the theme hook

  const handleReturnRateChange = (event, newValue) => {
    dispatch(setExpectedReturnRate(newValue / 100));
  };

  const handleStepUpChange = (event, newValue) => {
    dispatch(setStepUpPercentage(newValue / 100));
  };

  const finalProjection =
    projectionData.length > 0 ? projectionData[projectionData.length - 1] : {};
  const projectedCorpus = finalProjection.totalWealth || 0;
  const inflationAdjustedValue = finalProjection.inflationAdjustedWealth || 0;
  const passiveIncome = projectedCorpus * 0.04;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }} // Adjusted for responsiveness
      >
        Wealth Creation & Projection Engine
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Projected Corpus at 55"
            value={formatCurrency(projectedCorpus, currency)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Inflation-Adjusted Value"
            value={formatCurrency(inflationAdjustedValue, currency)}
            subValue="(Real Wealth)"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Passive Income Potential"
            value={`${formatCurrency(passiveIncome, currency)} / year`}
            subValue="(4% Withdrawal Rule)"
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }} // Adjusted for responsiveness
          >
            Investment Strategy
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Expected Return %
              </Typography>
              <Slider
                value={expectedReturnRate * 100}
                onChange={handleReturnRateChange}
                aria-labelledby="return-rate-slider"
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={8}
                max={15}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Annual Step-up %
              </Typography>
              <Slider
                value={stepUpPercentage * 100}
                onChange={handleStepUpChange}
                aria-labelledby="step-up-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={20}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }} // Adjusted for responsiveness
              >
                Inflation-Adjusted Wealth Growth
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={projectionData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10 }}
                    minTickGap={10}
                  />
                  <YAxis
                    tickFormatter={(tick) => formatLargeNumber(tick, currency)}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="inflationAdjustedWealth"
                    name="Real Wealth"
                    stroke={theme.palette.primary.main} // Using theme color
                    fill={theme.palette.primary.main} // Using theme color
                  />
                  <Area
                    type="monotone"
                    dataKey="totalInvested"
                    name="Total Invested"
                    stroke={theme.palette.info.main} // Using theme color
                    fill={theme.palette.info.main} // Using theme color
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }} // Adjusted for responsiveness
              >
                Year-on-Year Cash Flow
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={projectionData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    interval="preserveStart"
                    tick={{ fontSize: 10 }}
                    minTickGap={5}
                  />
                  <YAxis
                    tickFormatter={(tick) => formatLargeNumber(tick, currency)}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="annualIncome"
                    name="Income"
                    stroke={theme.palette.primary.main} // Using theme color
                    fill={theme.palette.primary.main} // Using theme color
                  />
                  <Line
                    type="monotone"
                    dataKey="annualExpenses"
                    name="Expenses"
                    stroke={theme.palette.error.light} // Using theme color
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="annualInvestment"
                    name="Investments"
                    stroke={theme.palette.primary.dark} // Using theme color
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {financialIndependence ? (
        <Typography
          variant="h4"
          align="center"
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "success.main",
            borderRadius: 2,
            fontSize: { xs: "1rem", sm: "1rem", md: "1.25rem" },
            color: "white",
          }} // Adjusted for responsiveness
        >
          Financial Independence Achievable by Age{" "}
          <strong>{financialIndependence.age}</strong>!
        </Typography>
      ) : (
        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "error.light",
            borderRadius: 2,
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            color: "white",
          }} // Adjusted for responsiveness
        >
          Financial Independence Not Achievable!
        </Typography>
      )}
    </Box>
  );
};

export default WealthProjectionEngine;
