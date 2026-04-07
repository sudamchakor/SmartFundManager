import React from "react";
import { Box, Typography, Grid, Card, CardActionArea, Stack } from "@mui/material";

const themes = [
  {
    name: "Light",
    value: "light",
    colors: ["#2a9d8f", "#264653", "#e9c46a", "#f4a261", "#e76f51"],
  },
  {
    name: "Dark",
    value: "dark",
    colors: ["#90CAF9", "#BBDEFB", "#121212", "#1E1E1E", "#E0E0E0"],
  },
  {
    name: "Blue",
    value: "blue",
    colors: ["#0077b6", "#00b4d8", "#caf0f8", "#023e8a", "#0096c7"],
  },
  {
    name: "Green",
    value: "green",
    colors: ["#40916c", "#52b788", "#d8f3dc", "#2d6a4f", "#74c69d"],
  },
  {
    name: "Yellow",
    value: "yellow",
    colors: ["#fb8500", "#ffb703", "#fff3e0", "#023047", "#219ebc"],
  },
  {
    name: "DodgerBlue",
    value: "dodgerblue",
    colors: ["#1E90FF", "#6495ED", "#E0FFFF", "#F0F8FF", "#191970"],
  },
];

const ThemeSelector = ({ selectedTheme, onThemeChange, disabled }) => {
  return (
    <Grid container spacing={2}>
      {themes.map((theme) => (
        <Grid item xs={2.4} key={theme.value}>
          <Card
            variant="outlined"
            sx={{
              borderColor:
                selectedTheme === theme.value
                  ? "primary.main"
                  : "transparent",
              borderWidth: 2,
            }}
          >
            <CardActionArea
              onClick={() => onThemeChange(theme.value)}
              disabled={disabled}
            >
              <Stack direction="row" sx={{ height: 60 }}>
                {theme.colors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: "100%",
                      width: "20%",
                      backgroundColor: color,
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" align="center" display="block" p={1}>
                {theme.name}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ThemeSelector;