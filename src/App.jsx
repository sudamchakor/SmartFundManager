import React, { useMemo, useEffect } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Typography, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HelmetProvider } from "react-helmet-async";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";

import { getAppTheme } from "./theme/ThemeConfig";
import { selectThemeMode, selectDesignSystem, selectVisualStyle } from "./store/emiSlice";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";
import UserProfile from "./pages/UserProfile";
import TaxCalculator from "./pages/TaxCalculator";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import FAQ from "./pages/FAQ";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Calculator from "./pages/Calculator";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import CreditCardEMICalculator from "./pages/CreditCardEmiCalculator";
import PersonalLoanCalculator from "./pages/PersonalLoanCalculator";

const AppContent = () => {
    const themeMode = useSelector(selectThemeMode);
    const designSystem = useSelector(selectDesignSystem);
    const visualStyle = useSelector(selectVisualStyle);

    const muiTheme = useMemo(() =>
            getAppTheme(themeMode, designSystem, visualStyle),
        [themeMode, designSystem, visualStyle]
    );

    useEffect(() => {
        document.body.setAttribute("data-theme", themeMode || "dodgerblue");
        document.body.setAttribute("data-arch", designSystem || "material");
        document.body.setAttribute("data-style", visualStyle || "flat");
    }, [themeMode, designSystem, visualStyle]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Header />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        // TOP OFFSET: Keeps header from hiding alerts and page titles
                        pt: { xs: '100px', md: '120px' },
                        // BOTTOM OFFSET: Clear room for the sticky surplus bar and footer
                        pb: { xs: '150px', md: '200px' },
                        transition: 'padding 0.3s ease'
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto', px: { xs: 2, md: 3 } }}>
                        <Routes>
                            {/* Redirects for GH Pages root path logic */}
                            <Route path="/smart-fund-manager" element={<Navigate to="/" replace />} />

                            {/* Core Dashboard Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/calculator" element={<Calculator />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/credit-card-emi" element={<CreditCardEMICalculator/>}/>
                            <Route path="/personal-loan" element={<PersonalLoanCalculator/>}/>
                            <Route path="/investment" element={<InvestmentCalculator />} />
                            <Route path="/investment/sip" element={<InvestmentCalculator />} />
                            <Route path="/investment/lumpsum" element={<InvestmentCalculator />} />
                            <Route path="/investment/step-up-sip" element={<InvestmentCalculator />} />
                            <Route path="/investment/swp" element={<InvestmentCalculator />} />
                            <Route path="/investment/fd" element={<InvestmentCalculator />} />
                            <Route path="/tax-calculator" element={<TaxCalculator />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-service" element={<TermsOfService />} />
                            <Route path="/contact-us" element={<ContactUs />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Box>
                </Box>

                <Footer />
            </Box>
        </ThemeProvider>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <HelmetProvider>
                        <AppContent />
                    </HelmetProvider>
                </LocalizationProvider>
            </PersistGate>
        </Provider>
    );
}