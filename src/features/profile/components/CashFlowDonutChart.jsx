import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Label,
} from "recharts";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCurrentSurplus } from "../../../store/profileSlice";

const PIE_CHART_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#9c27b0",
  "#2ecc71",
  "#f1c40f",
];

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{data.name}</p>
        <p style={{ margin: 0 }}>
          {`${currency}${Number(value).toLocaleString("en-IN")}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ viewBox, surplusValue, surplusFormatted }) => {
  const { cx, cy } = viewBox;
  const isDeficit = surplusValue < 0;
  const labelColor = isDeficit ? "#f44336" : "#2ecc71"; // Red for deficit, Emerald Green for positive

  return (
    <text
      x={cx}
      y={cy}
      fill={labelColor}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "16px", fontWeight: "bold" }}
    >
      <tspan x={cx} dy="-0.5em">
        {isDeficit ? "Current Deficit:" : "Current Surplus:"}
      </tspan>
      <tspan x={cx} dy="1.2em">
        {surplusFormatted}
      </tspan>
    </text>
  );
};

export default function CashFlowDonutChart({ donutData }) {
  const currency = useSelector(selectCurrency);
  const investableSurplus = useSelector(selectCurrentSurplus);

  const formatCurrency = (val) =>
    `${currency}${Math.abs(Number(val || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  let surplusFormatted;
  const absSurplus = Math.abs(investableSurplus);

  if (absSurplus >= 1000) {
    surplusFormatted = `${investableSurplus < 0 ? "-" : ""}${currency}${(absSurplus / 1000).toFixed(0)}k`;
  } else {
    surplusFormatted = `${investableSurplus < 0 ? "-" : ""}${formatCurrency(absSurplus)}`;
  }

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Monthly Cash Flow Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={donutData}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {donutData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
              />
            ))}
            <Label
              content={
                <CustomLabel
                  surplusValue={investableSurplus}
                  surplusFormatted={surplusFormatted}
                />
              }
              position="center"
            />
          </Pie>
          <RechartsTooltip content={<CustomTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
