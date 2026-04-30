import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip as MuiTooltip,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import {
  selectWealthProjection,
  selectFinancialIndependenceYear,
  selectExpectedReturnRate,
  selectStepUpPercentage,
  selectPostTax,
  setExpectedReturnRate,
  setStepUpPercentage,
  setPostTax,
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
} from "recharts";
import { formatCurrency } from "../../../utils/formatting";
import { selectCurrency } from "../../../store/emiSlice";
import ScenarioManager from "./ScenarioManager"; // Import the new component

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

const cardStyle = {
  height: "100%",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
  position: "relative",
};

const DataCard = ({ title, value, subValue, tooltipText }) => (
  <Card sx={cardStyle}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" } }}
        >
          {title}
        </Typography>
        {tooltipText && (
          <MuiTooltip title={tooltipText} arrow placement="top">
            <IconButton size="small" sx={{ p: 0, ml: 1 }}>
              <InfoIcon fontSize="small" color="action" />
            </IconButton>
          </MuiTooltip>
        )}
      </Box>
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontSize: { xs: "1.2rem", sm: "1rem", md: "1rem" },
          fontWeight: "bold",
        }}
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

const WealthProjectionEngine = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const projectionData = useSelector(selectWealthProjection);
  const financialIndependence = useSelector(selectFinancialIndependenceYear);
  const expectedReturnRate = useSelector(selectExpectedReturnRate);
  const stepUpPercentage = useSelector(selectStepUpPercentage);
  const postTax = useSelector(selectPostTax);
  const currency = useSelector(selectCurrency);
  const theme = useTheme();

  const handleReturnRateChange = (event, newValue) => {
    dispatch(setExpectedReturnRate(newValue / 100));
  };

  const handleStepUpChange = (event, newValue) => {
    dispatch(setStepUpPercentage(newValue / 100));
  };

  const handlePostTaxToggle = (event) => {
    dispatch(setPostTax(event.target.checked));
  };

  const finalProjection =
    projectionData.length > 0 ? projectionData[projectionData.length - 1] : {};
  const projectedCorpus = finalProjection.totalWealth || 0;
  const inflationAdjustedValue = finalProjection.inflationAdjustedWealth || 0;
  const passiveIncome = projectedCorpus * 0.04;

  const dashboardRef = useRef(null);
  const areaChartRef = useRef(null);
  const composedChartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getSummaryData: () => [
      { title: "Projected Corpus at 55", value: formatCurrency(projectedCorpus, currency) },
      { title: "Inflation-Adjusted Value", value: formatCurrency(inflationAdjustedValue, currency) },
      { title: "Passive Income Potential", value: `${formatCurrency(passiveIncome, currency)} / year` }
    ],
    getDashboardRef: () => dashboardRef,
    getChartRefs: () => [
      { ref: areaChartRef, name: 'areaChart' },
      { ref: composedChartRef, name: 'composedChart' }
    ]
  }));


  return (
    <Box sx={{ mt: 4 }} ref={dashboardRef}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, mb: 0 }}
        >
          Wealth Creation & Projection Engine
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={postTax}
              onChange={handlePostTaxToggle}
              name="postTaxToggle"
              color="primary"
            />
          }
          label="Post-Tax View"
        />
      </Box>

      {/* Add ScenarioManager here */}
      <ScenarioManager />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Projected Corpus at 55"
            value={formatCurrency(projectedCorpus, currency)}
            tooltipText="Estimated total wealth at retirement age, before inflation adjustments."
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Inflation-Adjusted Value"
            value={formatCurrency(inflationAdjustedValue, currency)}
            subValue="(Real Wealth)"
            tooltipText="The purchasing power of your projected corpus in today's money, assuming constant inflation."
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DataCard
            title="Passive Income Potential"
            value={`${formatCurrency(passiveIncome, currency)} / year`}
            subValue="(4% Withdrawal Rule)"
            tooltipText="Based on the 4% rule: withdrawing 4% of your portfolio annually, adjusted for inflation, is generally considered safe for a 30-year retirement."
          />
        </Grid>
      </Grid>

      <Accordion defaultExpanded={false} sx={{ mb: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="investment-strategy-content"
          id="investment-strategy-header"
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
            >
              Investment Strategy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Strategy: {Math.round(expectedReturnRate * 100)}% Return /{" "}
              {Math.round(stepUpPercentage * 100)}% Step-up
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
              >
                Inflation-Adjusted Wealth Growth
              </Typography>
              <Box ref={areaChartRef}>
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
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalInvested"
                      name="Total Invested"
                      stroke={theme.palette.info.main}
                      fill={theme.palette.info.main}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
              >
                Year-on-Year Cash Flow
              </Typography>
              <Box ref={composedChartRef}>
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
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                    />
                    <Line
                      type="monotone"
                      dataKey="annualExpenses"
                      name="Expenses"
                      stroke={theme.palette.error.light}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="annualInvestment"
                      name="Investments"
                      stroke={theme.palette.primary.dark}
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
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
          }}
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
          }}
        >
          Financial Independence Not Achievable!
        </Typography>
      )}
    </Box>
  );
});

export default WealthProjectionEngine;
