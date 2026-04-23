import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: "center",
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
        <Link
          color="inherit"
          href="/emiCalculator/privacy-policy"
          underline="hover"
        >
          Privacy Policy
        </Link>
        <Link
          color="inherit"
          href="/emiCalculator/terms-of-service"
          underline="hover"
        >
          Terms of Service
        </Link>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {"Copyright © "}
        <Link color="inherit" href="https://yourwebsite.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
};

export default Footer;
