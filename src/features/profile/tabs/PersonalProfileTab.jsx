import React, { useState } from "react";
import {
  Grid,
  Fab,
  Modal,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BasicInfoDisplay from "../components/BasicInfoDisplay";
import BasicInfoEdit from "../components/BasicInfoEdit";
import { AmountWithUnitInput } from "../../../components/common/CommonComponents"; // Keep AmountWithUnitInput
import SliderInput from "../../../components/common/SliderInput"; // Corrected import for SliderInput
import { useDispatch, useSelector } from "react-redux";
import {
  selectProfileExpenses,
  selectCurrentAge,
  selectRetirementAge,
  setCurrentAge,
  setRetirementAge,
  selectTotalMonthlyGoalContributions,
  selectIndividualGoalInvestmentContributions,
  selectGoals,
  selectCurrentSurplus,
  selectCareerGrowthRate,
  selectIncomes,
  selectGeneralInflationRate,
  selectTotalMonthlyIncome,
  selectTotalMonthlyExpenses,
  setCareerGrowthRate, // Import setCareerGrowthRate
  setGeneralInflationRate, // Import setGeneralInflationRate
  selectName,
  selectOccupation,
  selectRiskTolerance,
} from "../../../store/profileSlice";
import { selectCurrency } from "../../../store/emiSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import CashFlowDonutChart from "../components/CashFlowDonutChart";
import ProjectedCashFlowChart from "../components/ProjectedCashFlowChart";
import FinancialSection from "../components/FinancialSection";
import CorpusManager from "../../corpus/CorpusManager"; // Import CorpusManager

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "50%" },
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function PersonalProfileTab({ onEditGoal }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const currency = useSelector(selectCurrency);

  const expenses = useSelector(selectProfileExpenses) || [];
  const incomes = useSelector(selectIncomes) || [];
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate =
    typeof careerGrowthRaw === "object"
      ? careerGrowthRaw.value
      : careerGrowthRaw || 0;
  const careerGrowthType =
    typeof careerGrowthRaw === "object" ? careerGrowthRaw.type : "percentage";
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0.06;

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const emiState = useSelector(
    (state) => state.emi || state.emiCalculator || {},
  );

  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const individualGoalInvestments = useSelector(
    selectIndividualGoalInvestmentContributions,
  );
  const investableSurplus = useSelector(selectCurrentSurplus);
  const goals = useSelector(selectGoals) || [];
  const totalIncome = useSelector(selectTotalMonthlyIncome);
  const totalExpenses =
    useSelector(selectTotalMonthlyExpenses) +
    (monthlyEmi || 0) +
    totalMonthlyGoalContributions;

  const needsValue = expenses
    .filter((e) => e.category === "basic")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const wantsValue = expenses
    .filter((e) => e.category === "discretionary")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const donutData = [
    {
      name: "Needs",
      value: needsValue,
    },
    {
      name: "Wants",
      value: wantsValue,
    },
    { name: "Loan EMIs", value: monthlyEmi || 0 },
    {
      name: "Future Wealth (Goals)",
      value: totalMonthlyGoalContributions,
    },
    {
      name: "Surplus",
      value: investableSurplus > 0 ? investableSurplus : 0,
    },
  ].filter((item) => item.value > 0);

  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSaveBasicInfo = (newCurrentAge, newRetirementAge) => {
    dispatch(setCurrentAge(newCurrentAge));
    dispatch(setRetirementAge(newRetirementAge));
    setEditingBasicInfo(false);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} md={6}>
          {editingBasicInfo ? (
            <BasicInfoEdit
              currentAge={currentAge}
              retirementAge={retirementAge}
              onSave={handleSaveBasicInfo}
              onCancel={() => setEditingBasicInfo(false)}
            />
          ) : (
            <BasicInfoDisplay
              currentAge={currentAge}
              retirementAge={retirementAge}
              onEdit={() => setEditingBasicInfo(true)}
            />
          )}
        </Grid>

        {/* Corpus Manager */}
        <Grid item xs={12} md={6}>
          <CorpusManager />
        </Grid>

        {/* Income and Expense Details Row */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FinancialSection isIncome={true} isSmallScreen={isSmallScreen} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expense Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FinancialSection
              isIncome={false}
              onEditGoal={onEditGoal}
              isSmallScreen={isSmallScreen}
            />
          </Paper>
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", minHeight: 300 }}>
            <ProjectedCashFlowChart
              currentAge={currentAge}
              retirementAge={retirementAge}
              careerGrowthRate={careerGrowthRate}
              careerGrowthType={careerGrowthType}
              monthlyEmi={monthlyEmi}
              emiState={emiState}
              individualGoalInvestments={individualGoalInvestments}
              goals={goals}
              expenses={expenses}
              incomes={incomes}
              inflationRate={generalInflationRate}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", minHeight: 300 }}>
            <CashFlowDonutChart donutData={donutData} />
          </Box>
        </Grid>
      </Grid>

      {isSmallScreen && (
        <>
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1050,
            }}
            onClick={handleOpenMenu}
          >
            <AddIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleOpenModal("income")}>
              Add Income
            </MenuItem>
            <MenuItem onClick={() => handleOpenModal("expense")}>
              Add Expense
            </MenuItem>
          </Menu>
        </>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-item-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="add-item-modal-title"
            variant="h6"
            component="h2"
            sx={{ p: 2 }}
          >
            {modalType === "income" ? "Add New Income" : "Add New Expense"}
          </Typography>
          {modalType === "income" && (
            <FinancialSection
              isIncome={true}
              isModal={true}
              onCloseModal={handleCloseModal}
            />
          )}
          {modalType === "expense" && (
            <FinancialSection
              isIncome={false}
              isModal={true}
              onCloseModal={handleCloseModal}
              onEditGoal={onEditGoal}
            />
          )}
          <Button onClick={handleCloseModal} sx={{ mt: 2, m: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
