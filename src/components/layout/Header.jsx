import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Collapse,
  Button,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as TaxIcon,
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
  FileDownload as ExportIcon,
  HelpOutline as HelpIcon,
  Person as PersonIcon,
  EmojiEvents as GoalsIcon,
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  ExpandLess,
  ExpandMore,
  Payments as PersonalLoanIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { useSelector, useDispatch } from "react-redux";
import { selectCalculatedValues } from "../../features/emiCalculator/utils/emiCalculator";
import { resetEmiState } from "../../store/emiSlice";
import { useSnackbar } from "notistack";
import storage from "redux-persist/lib/storage";

const calculators = [
  {
    path: "/calculator",
    label: "Home Loan EMI",
    icon: <CalculateIcon />,
    color: "#BBDEFB",
  },
  {
    path: "/credit-card-emi",
    label: "Credit Card EMI",
    icon: <CreditCardIcon />,
    color: "#C8E6C9",
  },
  {
    path: "/investment",
    label: "Investment",
    icon: <TrendingUpIcon />,
    color: "#B3E5FC",
  },
  {
    path: "/personal-loan",
    label: "Personal Loan",
    icon: <PersonalLoanIcon />,
    color: "#FFE0B2",
  },
  {
    path: "/tax-calculator",
    label: "Tax Calculator",
    icon: <TaxIcon />,
    color: "#FFCDD2",
  },
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const calculatedValues = useSelector(selectCalculatedValues);

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCalculators, setOpenCalculators] = useState(false);

  const currentCalc =
    calculators.find((c) => location.pathname.startsWith(c.path)) ||
    calculators[0];

  const handleExport = async (format) => {
    setExportAnchorEl(null);
    if (format === "pdf") {
      window.print();
    } else if (format === "excel") {
      if (!calculatedValues?.schedule)
        return enqueueSnackbar("No data to export", { variant: "info" });
      const ws = XLSX.utils.json_to_sheet(calculatedValues.schedule);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Schedule");
      XLSX.writeFile(wb, "SmartFund_Export.xlsx");
    }
  };

  const handleResetData = async () => {
    if (window.confirm("This will clear all your data. Continue?")) {
      dispatch(resetEmiState());
      await storage.removeItem("persist:app_v1");
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
    setProfileAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT: Logo & Calculator Selector */}
        <Stack direction="row" spacing={2} alignItems="center">
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="start"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            onClick={() => handleNavigation("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
            }}
          >
            <CalculateIcon sx={{ color: "inherit", fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                display: { xs: "none", sm: "block" },
                color: "inherit",
              }}
            >
              SmartFund Manager
            </Typography>
          </Box>

          {!isMobile && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  height: 24,
                  alignSelf: "center",
                  mx: 1,
                  bgcolor: alpha("#fff", 0.3),
                }}
              />
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<ArrowDownIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "inherit",
                  "&:hover": { bgcolor: alpha("#fff", 0.1) },
                }}
              >
                {currentCalc.label}
              </Button>
            </>
          )}
        </Stack>

        {/* RIGHT: Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          {!isMobile && (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExportIcon />}
                onClick={(e) => setExportAnchorEl(e.currentTarget)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "inherit",
                  borderColor: alpha("#fff", 0.5),
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: alpha("#fff", 0.1),
                  },
                }}
              >
                Export
              </Button>

              <Tooltip title="Reset Local Data">
                <IconButton
                  onClick={handleResetData}
                  size="small"
                  color="inherit"
                >
                  <ResetIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Help & FAQ">
                <IconButton
                  onClick={() => handleNavigation("/faq")}
                  size="small"
                  color="inherit"
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* NEW: Direct Settings Icon for Desktop */}
              <Tooltip title="Settings">
                <IconButton
                  onClick={() => handleNavigation("/settings")}
                  size="small"
                  color="inherit"
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <IconButton
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            sx={{
              bgcolor: alpha("#fff", 0.1),
              color: "inherit",
              "&:hover": { bgcolor: alpha("#fff", 0.2) },
            }}
          >
            <ProfileIcon />
          </IconButton>
        </Stack>

        {/* --- DROPDOWN MENUS --- */}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {calculators.map((calc) => (
            <MenuItem
              key={calc.path}
              onClick={() => {
                handleNavigation(calc.path);
                setAnchorEl(null);
              }}
              selected={location.pathname.startsWith(calc.path)}
              sx={{ fontWeight: 600, gap: 1.5 }}
            >
              <Box sx={{ color: "primary.main", display: "flex" }}>
                {calc.icon}
              </Box>
              {calc.label}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={() => setExportAnchorEl(null)}
        >
          <MenuItem onClick={() => handleExport("pdf")}>Download PDF</MenuItem>
          <MenuItem onClick={() => handleExport("excel")}>
            Download Excel
          </MenuItem>
        </Menu>

        {/* UPDATED: Added Settings to Profile Dropdown */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={() => setProfileAnchorEl(null)}
        >
          <MenuItem onClick={() => handleNavigation("/profile?tab=personal")}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Personal Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/profile?tab=goals")}>
            <ListItemIcon>
              <GoalsIcon fontSize="small" />
            </ListItemIcon>
            Financial Goals
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleNavigation("/settings")}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Global Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleResetData} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <ResetIcon fontSize="small" color="error" />
            </ListItemIcon>
            Reset All Data
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, px: 1 }}>
              SmartFund
              <Box component="span" sx={{ color: "primary.main" }}>
                {" "}
                Manager
              </Box>
            </Typography>
          </Box>
          <Divider />

          <List sx={{ pt: 0 }}>
            {/* Calculators List */}
            <ListItemButton
              onClick={() => setOpenCalculators(!openCalculators)}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <ListItemIcon>
                <CalculateIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Calculators"
                primaryTypographyProps={{ fontWeight: 700 }}
              />
              {openCalculators ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openCalculators} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {calculators.map((calc) => (
                  <ListItemButton
                    key={calc.path}
                    sx={{ pl: 4 }}
                    onClick={() => handleNavigation(calc.path)}
                    selected={location.pathname.startsWith(calc.path)}
                  >
                    <ListItemIcon>{calc.icon}</ListItemIcon>
                    <ListItemText
                      primary={calc.label}
                      primaryTypographyProps={{ fontSize: "0.9rem" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <Divider />

            {/* Profile & Settings List */}
            <ListItemButton
              onClick={() => handleNavigation("/profile?tab=personal")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/settings")}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/faq")}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help & FAQ" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
