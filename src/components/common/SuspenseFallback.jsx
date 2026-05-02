import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const SuspenseFallback = ({ message = "Loading financial data...", transparent = false }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                minHeight: '400px',
                // Adapts background to theme mode (Light/Dark)
                backgroundColor: transparent ? 'transparent' : theme.palette.background.default,
                // Smooth entry animation
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            }}
        >
            <CircularProgress
                size={50}
                thickness={4}
                sx={{
                    color: theme.palette.primary.main,
                    mb: 2
                }}
            />

            {/* Adding a message improves UX by explaining the wait */}
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default SuspenseFallback;