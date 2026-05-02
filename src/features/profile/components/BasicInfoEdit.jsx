import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import SliderInput from "../../../components/common/SliderInput";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  selectName,
  selectOccupation,
  selectRiskTolerance,
  selectCareerGrowthRate,
  selectGeneralInflationRate,
  setBasicInfo,
  setCurrentAge,
  setRetirementAge,
  setCareerGrowthRate,
  setGeneralInflationRate,
} from "../../../store/profileSlice";
import { labelStyle, getWellInputStyle } from "../../../styles/formStyles";

export default function BasicInfoEdit({
  currentAge,
  retirementAge,
  onSave,
  onCancel,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const currentName = useSelector(selectName);
  const currentOccupation = useSelector(selectOccupation);
  const currentRiskTolerance = useSelector(selectRiskTolerance);
  const currentCareerGrowthRate = useSelector(selectCareerGrowthRate);
  const currentGeneralInflationRate = useSelector(selectGeneralInflationRate);

  const [tempName, setTempName] = useState(currentName);
  const [tempOccupation, setTempOccupation] = useState(currentOccupation);
  const [tempRiskTolerance, setTempRiskTolerance] =
    useState(currentRiskTolerance);
  const [tempCurrentAge, setTempCurrentAge] = useState(currentAge);
  const [tempRetirementAge, setTempRetirementAge] = useState(retirementAge);
  const [tempCareerGrowthRate, setTempCareerGrowthRate] = useState(
    currentCareerGrowthRate,
  );
  const [tempGeneralInflationRate, setTempGeneralInflationRate] = useState(
    currentGeneralInflationRate,
  );

  const handleSave = () => {
    if (tempRetirementAge <= tempCurrentAge) {
      alert(
        "Time travel not yet supported! Retirement age must be greater than current age.",
      );
      return;
    }
    dispatch(
      setBasicInfo({
        name: tempName,
        age: tempCurrentAge,
        occupation: tempOccupation,
        riskTolerance: tempRiskTolerance,
      }),
    );
    dispatch(setCurrentAge(tempCurrentAge));
    dispatch(setRetirementAge(tempRetirementAge));
    dispatch(setCareerGrowthRate(tempCareerGrowthRate));
    dispatch(setGeneralInflationRate(tempGeneralInflationRate));
    onSave(tempCurrentAge, tempRetirementAge); // Still call onSave for age updates
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography sx={labelStyle} id="name-label">Name</Typography>
          <TextField
            aria-labelledby="name-label"
            fullWidth
            variant="standard"
            size="small"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            InputProps={{ disableUnderline: true, sx: getWellInputStyle(theme) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={labelStyle} id="occupation-label">Occupation</Typography>
          <TextField
            aria-labelledby="occupation-label"
            fullWidth
            variant="standard"
            size="small"
            value={tempOccupation}
            onChange={(e) => setTempOccupation(e.target.value)}
            InputProps={{ disableUnderline: true, sx: getWellInputStyle(theme) }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <SliderInput
            label="Current Age"
            value={tempCurrentAge}
            onChange={(val) => setTempCurrentAge(val)}
            min={18}
            max={100}
            step={1}
            showInput={true}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <SliderInput
            label="Target Retirement Age"
            value={tempRetirementAge}
            onChange={(val) => setTempRetirementAge(val)}
            min={tempCurrentAge + 1}
            max={100}
            step={1}
            warningThreshold={60}
            warningText="In India, the standard retirement age is 60. Working beyond this may impact retirement planning. However, you can adjust this based on your personal circumstances."
            tooltipText="Set your target retirement age. Standard in India is 60."
            showInput={true}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <SliderInput
            label="Expected Career Growth (%)"
            value={(tempCareerGrowthRate * 100).toFixed(1)}
            onChange={(val) => setTempCareerGrowthRate(val / 100)}
            min={0}
            max={20}
            step={0.1}
            showInput={true}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <SliderInput
            label="Expected Inflation Rate (%)"
            value={(tempGeneralInflationRate * 100).toFixed(1)}
            onChange={(val) => setTempGeneralInflationRate(val / 100)}
            min={0}
            max={20}
            step={0.1}
            showInput={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography sx={labelStyle} id="risk-tolerance-label">Risk Tolerance</Typography>
          <FormControl variant="standard" size="small" fullWidth>
            <Select
              labelId="risk-tolerance-label"
              value={tempRiskTolerance}
              onChange={(e) => setTempRiskTolerance(e.target.value)}
              disableUnderline
              sx={getWellInputStyle(theme)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button size="small" onClick={onCancel} startIcon={<CloseIcon />}>
          Cancel
        </Button>
      </Box>
    </>
  );
}
