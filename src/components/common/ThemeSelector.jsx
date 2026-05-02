import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";

export const themes = [
  {
    name: "DodgerBlue", // M3 Professional Baseline
    value: "dodgerblue",
    colors: ["#0061A4", "#D1E4FF", "#F8FAFF", "#001D35", "#535F70"],
  },
  {
    name: "Dark", // M3 Charcoal (Standard Dark)
    value: "dark",
    colors: ["#D0BCFF", "#381E72", "#1C1B1F", "#E6E1E5", "#938F99"],
  },
  {
    name: "Zinc", // Most popular for Dashboards (Neutral)
    value: "zinc",
    colors: ["#18181B", "#F4F4F5", "#FFFFFF", "#09090B", "#71717A"],
  },
  {
    name: "Emerald", // High-Trust Financial Green
    value: "green",
    colors: ["#006D3A", "#D3E8D3", "#F1F8F1", "#00210E", "#748C7D"],
  },
  {
    name: "Rose", // Trending Soft Aesthetic
    value: "rose",
    colors: ["#9C4275", "#FFD8EB", "#FFF8F9", "#201A1D", "#81737A"],
  },
  {
    name: "Amber", // High-Contrast Warning/Warning
    value: "yellow",
    colors: ["#7A5900", "#FFDF9E", "#FFF8F1", "#261900", "#4D4639"],
  },
  {
    name: "Indigo", // Premium "Fintech" Look
    value: "indigo",
    colors: ["#4355B9", "#DEE0FF", "#FEFBFF", "#001158", "#5B5D72"],
  },
];

const ThemeSelector = ({ selectedTheme, onThemeChange, disabled }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      {themes.map((themeOption) => (
        // xs={12} makes it 1 per row on mobile
        // sm={6}  makes it 2 per row on tablets
        // md={2.4} keeps it at 5 per row on desktop
        <Grid item xs={12} sm={6} md={2.4} key={themeOption.value}>
          <Card
            variant="outlined"
            sx={{
              borderColor:
                selectedTheme === themeOption.value
                  ? "primary.main"
                  : alpha(theme.palette.divider, 0.2),
              borderWidth: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              boxShadow: selectedTheme === themeOption.value ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}` : 0,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            }}
          >
            <CardActionArea
              onClick={() => onThemeChange(themeOption.value)}
              disabled={disabled}
            >
              {/* Responsive height: shorter on mobile to prevent long scrolling */}
              <Stack direction="row" sx={{ height: { xs: 30, sm: 40 } }}>
                {themeOption.colors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: "100%",
                      width: `${100 / themeOption.colors.length}%`,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </Stack>
              <Typography
                variant="caption"
                align="center"
                display="block"
                sx={{
                  py: 0.5,
                  fontWeight: selectedTheme === themeOption.value ? 600 : 400,
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}
              >
                {themeOption.name}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default ThemeSelector;
