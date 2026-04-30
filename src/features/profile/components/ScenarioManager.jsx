import React from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setScenario, selectScenario } from "../../../store/profileSlice";

const ScenarioManager = () => {
  const dispatch = useDispatch();
  const currentScenario = useSelector(selectScenario);

  const handleScenarioChange = (event) => {
    dispatch(setScenario(event.target.value));
  };

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Scenario Manager
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="scenario"
          name="scenario-radio-buttons-group"
          value={currentScenario}
          onChange={handleScenarioChange}
        >
          <FormControlLabel
            value="current"
            control={<Radio />}
            label="Current Path"
          />
          <FormControlLabel
            value="frugal"
            control={<Radio />}
            label="Frugal Mode"
          />
          <FormControlLabel
            value="aggressive"
            control={<Radio />}
            label="Aggressive Growth"
          />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

export default ScenarioManager;
