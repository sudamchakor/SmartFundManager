import React from "react";
import { Box, Typography, Container } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          1. Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to EMI Calculator. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          2. Use of Service
        </Typography>
        <Typography variant="body1" paragraph>
          Our EMI Calculator provides tools and information for calculating Equated Monthly Installments. This service is intended for informational purposes only and does not constitute financial advice. You are responsible for verifying the accuracy of any calculations and for making your own financial decisions.
        </Typography>
        <Typography variant="body1" paragraph>
          You agree not to use the service for any unlawful purpose or in any way that could harm, disable, overburden, or impair the website.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          3. Accuracy of Information
        </Typography>
        <Typography variant="body1" paragraph>
          While we strive to provide accurate and up-to-date information, we do not warrant the completeness, reliability, or accuracy of any information or calculations provided through our service. We are not liable for any errors or omissions, or for any actions taken based on the information provided.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          4. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          All content, trademarks, service marks, and logos on the EMI Calculator website are the property of EMI Calculator or its licensors and are protected by intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content without our express written permission.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          5. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          To the fullest extent permitted by applicable law, EMI Calculator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the service; (b) any conduct or content of any third party on the service; (c) any content obtained from the service; and (d) unauthorized access, use or alteration of your transmissions or content.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          6. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          7. Governing Law
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          8. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about these Terms, please contact us at [Your Contact Email].
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
