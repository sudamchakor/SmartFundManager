import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Container,
  Stack,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Calculate as CalculateIcon,
  AccountCircle as AccountCircleIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import OnboardingModal from "../features/profile/tabs/OnboardingModal";

// Staggered system boot-up animation
const moduleBootUp = keyframes`
  0% { opacity: 0; transform: translateY(20px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

// Mapped directly to MUI theme palette tokens instead of hardcoded hex values
const systemModules = [
  {
    title: "User Profile",
    description:
      "Manage your demographics, operational liabilities, and capital goals.",
    icon: <AccountCircleIcon sx={{ fontSize: 32 }} />,
    path: "/profile",
    colorToken: "secondary",
  },
  {
    title: "EMI Calculator",
    description:
      "Calculate monthly amortization schedules and prepayment impacts.",
    icon: <CalculateIcon sx={{ fontSize: 32 }} />,
    path: "/calculator",
    colorToken: "primary",
  },
  {
    title: "Credit Card EMI",
    description: "Simulate the exact cost of converting unsecured debt to EMI.",
    icon: <CreditCardIcon sx={{ fontSize: 32 }} />,
    path: "/credit-card-emi",
    colorToken: "success",
  },
  {
    title: "Investment Strategy",
    description:
      "Project long-term wealth accumulation and safe withdrawal rates.",
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    path: "/investment/sip",
    colorToken: "info",
  },
  {
    title: "Personal Loan",
    description:
      "Configure unsecured debt parameters to calculate monthly liabilities.",
    icon: <AccountBalanceIcon sx={{ fontSize: 32 }} />,
    path: "/personal-loan",
    colorToken: "warning",
  },
  {
    title: "Tax Optimization",
    description: "Compute income tax liabilities across legislative regimes.",
    icon: <ReceiptIcon sx={{ fontSize: 32 }} />,
    path: "/tax-calculator",
    colorToken: "error",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("hasOnboarded");
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem("hasOnboarded", "true");
    setShowOnboarding(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 8 }}>
      {/* Terminal Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8, position: "relative" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            mb: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          <DashboardIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 900,
            color: "text.primary",
            letterSpacing: "-0.04em",
            mb: 1.5,
          }}
        >
          SmartFund{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Manager
          </Box>
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Your centralized financial command center for precision planning,
          liability tracking, and capital growth.
        </Typography>
      </Box>

      {/* Grid Modules */}
      <Grid container spacing={3}>
        {systemModules.map((module, index) => {
          const colorToken = module.colorToken;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                onClick={() => navigate(module.path)}
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  boxShadow: `0 4px 24px ${alpha(theme.palette.common.black || "#000", 0.02)}`,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",

                  // Boot-up Animation
                  animation: `${moduleBootUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
                  animationDelay: `${index * 80}ms`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                    borderColor: alpha(theme.palette[colorToken].main, 0.3),
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 40px ${alpha(theme.palette[colorToken].main, 0.12)}`,
                    "& .arrow-icon": {
                      transform: "translateX(4px)",
                      opacity: 1,
                    },
                    "& .icon-well": {
                      bgcolor: alpha(theme.palette[colorToken].main, 0.15),
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                {/* Module Top Accent Line */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    bgcolor: alpha(theme.palette[colorToken].main, 0.4),
                  }}
                />

                {/* Tinted Icon Well */}
                <Box
                  className="icon-well"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: 2.5,
                    bgcolor: alpha(theme.palette[colorToken].main, 0.08),
                    color: `${colorToken}.main`,
                    mb: 4,
                    transition: "all 0.3s ease",
                  }}
                >
                  {module.icon}
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: alpha(theme.palette.text.secondary, 0.6),
                      letterSpacing: 1,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    System Module
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "text.primary",
                        letterSpacing: -0.5,
                      }}
                    >
                      {module.title}
                    </Typography>
                    <ChevronRightIcon
                      className="arrow-icon"
                      sx={{
                        fontSize: 22,
                        color: `${colorToken}.main`,
                        opacity: 0,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {module.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <OnboardingModal open={showOnboarding} onClose={handleCloseOnboarding} />
    </Container>
  );
}
