import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  SettingsOutlined as SettingsIcon,
  PaletteOutlined as PaletteIcon,
  PaymentsOutlined as CurrencyIcon,
  CloudSyncOutlined as SyncIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAutoSave,
  selectCurrency,
  selectThemeMode,
  setAutoSave,
  setCurrency,
  setThemeMode,
} from "../store/emiSlice";
import ThemeSelector from "../components/common/ThemeSelector";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const themeMode = useSelector(selectThemeMode);
  const currency = useSelector(selectCurrency);
  const autoSave = useSelector(selectAutoSave);

  const [useSystemDefault, setUseSystemDefault] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (useSystemDefault) {
      dispatch(setThemeMode(prefersDarkMode ? "dark" : "light"));
    }
  }, [useSystemDefault, prefersDarkMode, dispatch]);

  useEffect(() => {
    setOpenToast(true);
    const timer = setTimeout(() => setOpenToast(false), 1500);
    return () => clearTimeout(timer);
  }, [themeMode, currency, autoSave]);

  // Reusable label style for Command Center aesthetic
  const sectionLabelStyle = {
    fontWeight: 800,
    textTransform: "uppercase",
    fontSize: "0.75rem",
    color: "text.secondary",
    letterSpacing: 1,
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        {/* Technical Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <SettingsIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: -0.5,
              }}
            >
              Global Settings
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Configure your system preferences and localization parameters.
            </Typography>
          </Box>
        </Stack>

        {/* Main Settings Panel */}
        <Box
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
            bgcolor: theme.palette.background.paper,
            boxShadow: `0 4px 24px ${alpha(theme.palette.common.black || "#000", 0.02)}`,
          }}
        >
          <Stack spacing={4}>
            {/* --- 1. Theme Section --- */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <PaletteIcon
                    sx={{ fontSize: "1.2rem", color: "text.secondary" }}
                  />
                  <Typography sx={sectionLabelStyle}>
                    Theme Selection
                  </Typography>
                </Stack>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={useSystemDefault}
                      onChange={(e) => setUseSystemDefault(e.target.checked)}
                      sx={{
                        color: "text.secondary",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "text.secondary" }}
                    >
                      SYSTEM DEFAULT
                    </Typography>
                  }
                />
              </Stack>
              <ThemeSelector
                selectedTheme={themeMode}
                onThemeChange={(newTheme) => dispatch(setThemeMode(newTheme))}
                disabled={useSystemDefault}
              />
            </Box>

            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

            {/* --- 2. Currency Section --- */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <CurrencyIcon
                  sx={{ fontSize: "1.2rem", color: "text.secondary" }}
                />
                <Typography sx={sectionLabelStyle}>
                  Localization Currency
                </Typography>
              </Stack>
              <Select
                value={currency}
                onChange={(e) => dispatch(setCurrency(e.target.value))}
                disableUnderline
                variant="standard"
                fullWidth
                sx={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  color: "primary.main",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                  "& .MuiSelect-select": { paddingRight: "32px !important" },
                  "& .MuiSvgIcon-root": { color: "primary.main" },
                }}
              >
                <MenuItem value="₹" sx={{ fontWeight: 700 }}>
                  INR - Indian Rupee (₹)
                </MenuItem>
                <MenuItem value="$" sx={{ fontWeight: 700 }}>
                  USD - US Dollar ($)
                </MenuItem>
                <MenuItem value="€" sx={{ fontWeight: 700 }}>
                  EUR - Euro (€)
                </MenuItem>
                <MenuItem value="£" sx={{ fontWeight: 700 }}>
                  GBP - British Pound (£)
                </MenuItem>
              </Select>
            </Box>

            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

            {/* --- 3. Autosave Toggle Section --- */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <SyncIcon
                    sx={{
                      fontSize: "1.2rem",
                      color: "text.secondary",
                      mt: 0.2,
                    }}
                  />
                  <Box>
                    <Typography sx={{ ...sectionLabelStyle, mb: 0.5 }}>
                      Autosave Protocol
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                      Continuously sync financial data to local browser storage.
                    </Typography>
                  </Box>
                </Stack>
                <Switch
                  checked={!!autoSave}
                  onChange={(e) => dispatch(setAutoSave(e.target.checked))}
                  color="primary"
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Global Toast Notification */}
        <Snackbar
          open={openToast}
          autoHideDuration={1500}
          onClose={() => setOpenToast(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ mb: 6 }} // Lifted slightly so it doesn't collide with the global footer
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
            }}
          >
            System Parameters Updated
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
