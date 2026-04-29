import React from "react";
import { Box } from "@mui/material";
import Settings from "../features/profile/tabs/Settings";

export default function SettingsPage() {
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Settings />
    </Box>
  );
}