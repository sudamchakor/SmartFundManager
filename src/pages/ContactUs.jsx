import React from "react";
import { Box, Typography, Container } from "@mui/material";

const ContactUs = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us - Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          If you see this, the page is rendering correctly!
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactUs;
