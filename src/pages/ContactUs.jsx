import React from "react";
import { Box, Typography, Container, TextField, Button, Grid, Link } from "@mui/material";
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
    },
  },
});

const ContactUs = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" paragraph>
          We'd love to hear from you! Please fill out the form below or reach out to us using the contact details provided.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box component="form" noValidate autoComplete="off" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
            <Typography variant="h5" gutterBottom>Send us a Message</Typography>
            <StyledTextField
              fullWidth
              label="Your Name"
              variant="outlined"
              required
            />
            <StyledTextField
              fullWidth
              label="Your Email"
              variant="outlined"
              type="email"
              required
            />
            <StyledTextField
              fullWidth
              label="Subject"
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              label="Your Message"
              variant="outlined"
              multiline
              rows={4}
              required
            />
            <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Send Message
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom>Contact Information</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Address:</strong> 123 EMI Street, Finance City, FC 12345
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Phone:</strong> <Link href="tel:+1234567890" color="inherit">(123) 456-7890</Link>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Email:</strong> <Link href="mailto:info@emicalculator.com" color="inherit">info@emicalculator.com</Link>
            </Typography>
            <Typography variant="body1">
              <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;
