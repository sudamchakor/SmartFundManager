import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectCurrentSurplus,
  selectDebtFreeCountdown,
} from "../store/profileSlice";
import { selectCurrency } from "../store/emiSlice";

// Feature Tabs
import PersonalProfileTab from "../features/profile/tabs/PersonalProfileTab";
import FutureGoalsTab from "../features/profile/tabs/FutureGoalsTab";
import WealthTab from "../features/profile/tabs/WealthTab";
import OnboardingModal from "../features/profile/tabs/OnboardingModal";
import FinancialModal from "../features/profile/components/FinancialModal";
import CustomTabPanel from "../components/CustomTabPanel";
import PreviewBanner from "../components/PreviewBanner";
import FloatingStatusIsland from "../components/FloatingStatusIsland";

export default function UserProfile() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab Logic
  const getTabIndex = (tabParam) => {
    const map = { goals: 1, wealth: 2 };
    return map[tabParam] || 0;
  };

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");

  const [tabValue, setTabValue] = useState(() => getTabIndex(tabParam));
  const [goalToEditId, setGoalToEditId] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Profile Status
  const [isProfileCreated, setIsProfileCreated] = useState(
    localStorage.getItem("isProfileCreated") === "true",
  );

  useEffect(() => {
    setTabValue(getTabIndex(tabParam));
    if (tabParam !== "goals") setGoalToEditId(null);
  }, [tabParam]);

  const handleTabChange = (event, newValue) => {
    const tabs = ["personal", "goals", "wealth"];
    navigate(`/profile?tab=${tabs[newValue]}`);
    setGoalToEditId(null);
  };

  const handleEditGoal = (goalId) => {
    setGoalToEditId(goalId);
    navigate(`/profile?tab=goals`);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Data Selectors
  const investableSurplus = useSelector(selectCurrentSurplus);
  const debtFreeCountdown = useSelector(selectDebtFreeCountdown);
  const currency = useSelector(selectCurrency);

  return (
    // FIX: Greatly increased 'pb' (padding-bottom) so the user can scroll past the floating footer
    <Box sx={{ width: "100%", pb: { xs: 16, sm: 20 } }}>
      {/* 1. Integrated Action Banner */}
      {!isProfileCreated && (
        <PreviewBanner onOpenOnboarding={() => setOnboardingOpen(true)} />
      )}

      {/* 2. Command Center Navigation (Tabs) */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: alpha(theme.palette.divider, 0.1),
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
          mb: 1,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            minHeight: 48,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              backgroundColor: "primary.main",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <Tab label="My Profile" />
          <Tab label="Financial Goals" />
          <Tab label="Wealth Dashboard" />
        </Tabs>
      </Box>

      {/* 3. Tab Content Area */}
      <Box>
        <CustomTabPanel value={tabValue} index={0}>
          <PersonalProfileTab
            onEditGoal={handleEditGoal}
            onOpenModal={handleModalOpen}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <FutureGoalsTab goalToEditId={goalToEditId} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <WealthTab />
        </CustomTabPanel>
      </Box>

      {/* Modals */}
      <OnboardingModal
        open={onboardingOpen}
        onClose={() => {
          setOnboardingOpen(false);
          setIsProfileCreated(
            localStorage.getItem("isProfileCreated") === "true",
          );
        }}
      />
      <FinancialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />

      {/* 4. High-End Floating Status Island */}
      <FloatingStatusIsland
        investableSurplus={investableSurplus}
        debtFreeCountdown={debtFreeCountdown}
        currency={currency}
      />
    </Box>
  );
}
