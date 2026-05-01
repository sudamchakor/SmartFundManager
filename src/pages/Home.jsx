import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Container,
  Grow,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OnboardingModal from "../features/profile/tabs/OnboardingModal";

const features = [
  {
    title: "User Profile",
    description: "Manage your incomes, expenses, and financial goals.",
    icon: <AccountCircleIcon sx={{ fontSize: 40 }} />,
    path: "/profile",
    color: "#7b1fa2", // Purple
  },
  {
    title: "EMI Calculator",
    description: "Calculate your monthly EMI and view amortization schedule.",
    icon: <CalculateIcon sx={{ fontSize: 40 }} />,
    path: "/calculator",
    color: "#1976d2", // Blue
  },
  {
    title: "Credit Card EMI",
    description: "Plan your credit card dues and EMI conversions.",
    icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
    path: "/credit-card-emi",
    color: "#2e7d32", // Green
  },
  {
    title: "Investment Calculator",
    description: "Calculate SIP, Lumpsum returns and wealth accumulation.",
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    path: "/investment/sip",
    color: "#0288d1", // Cyan
  },
  {
    title: "Personal Loan",
    description: "Estimate personal loan EMIs and interest payouts.",
    icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
    path: "/personal-loan",
    color: "#ed6c02", // Orange
  },
  {
    title: "Tax Calculator",
    description: "Calculate your income tax under new/old regimes.",
    icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
    path: "/tax-calculator",
    color: "#d32f2f", // Red
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
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 900,
            color: "#1a1a1a",
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          SmartFund{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Manager
          </Box>
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 500, opacity: 0.8 }}
        >
          Your all-in-one financial command center for planning, tracking, and
          growth.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Grow in={true} timeout={(index + 1) * 200}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                    transform: "translateY(-8px)",
                    borderColor: feature.color,
                    "& .arrow-icon": {
                      transform: "translateX(4px)",
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(feature.path)}
                  sx={{
                    height: "100%",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Icon Container */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 72,
                      height: 72,
                      borderRadius: 3,
                      bgcolor: `${feature.color}10`, // 10% opacity version of the color
                      color: feature.color,
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <CardContent sx={{ p: 0, width: "100%" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "#1a1a1a" }}
                      >
                        {feature.title}
                      </Typography>
                      <ChevronRightIcon
                        className="arrow-icon"
                        sx={{
                          fontSize: 20,
                          color: feature.color,
                          opacity: 0,
                          transition: "all 0.2s ease",
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <OnboardingModal open={showOnboarding} onClose={handleCloseOnboarding} />
    </Container>
  );
}
