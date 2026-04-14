import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SliderInput from "../common/SliderInput";

const InvestmentPlanInput = ({ plan, index, handlePlanChange, handleRemovePlan, isRemovable }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        p: 2,
        mb: 2,
        position: "relative",
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Plan {index + 1}
      </Typography>
      {isRemovable && (
        <IconButton
          aria-label="remove plan"
          onClick={() => handleRemovePlan(plan.id)}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <RemoveCircleOutlineIcon color="error" />
        </IconButton>
      )}
      <FormControl size="small" fullWidth sx={{ mb: 1.5 }}>
        <InputLabel>Investment Type</InputLabel>
        <Select
          value={plan.type}
          label="Investment Type"
          onChange={(e) =>
            handlePlanChange(plan.id, "type", e.target.value)
          }
        >
          <MenuItem value="sip">Standard SIP</MenuItem>
          <MenuItem value="lumpsum">Lumpsum</MenuItem>
          <MenuItem value="step_up_sip">Step-Up SIP</MenuItem>
          <MenuItem value="swp">SWP</MenuItem>
          <MenuItem value="fd">Fixed Deposit</MenuItem>
        </Select>
      </FormControl>

      {plan.type === "step_up_sip" && (
        <SliderInput
          label="Annual Step-Up Rate (%)"
          value={Number(plan.stepUpRate) || 0}
          onChange={(val) => handlePlanChange(plan.id, "stepUpRate", val)}
          min={0}
          max={20}
          step={0.5}
          showInput={true}
          unit="%"
        />
      )}

      <FormControlLabel
        control={
          <Switch
            checked={plan.isSafe}
            onChange={(e) =>
              handlePlanChange(plan.id, "isSafe", e.target.checked)
            }
            name={`isSafe-${plan.id}`}
            color="primary"
          />
        }
        label="Safe Investment Option"
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default InvestmentPlanInput;
