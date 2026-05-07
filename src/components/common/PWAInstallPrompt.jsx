import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import usePWAInstall from '../../hooks/usePWAInstall';

const PWAInstallPrompt = () => {
  const { isInstallable, handleInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      // Delay showing the prompt slightly to not overwhelm the user immediately
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowPrompt(false);
  };

  const onInstallClick = async () => {
    await handleInstall();
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      autoHideDuration={60000} // Give users time to notice it
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        variant="filled"
        sx={{ width: '100%', alignItems: 'center' }}
        onClose={handleClose}
        action={
          <Button color="inherit" size="small" onClick={onInstallClick} sx={{ fontWeight: 'bold' }}>
            INSTALL APP
          </Button>
        }
      >
        Install SmartFund Manager on your home screen for quick access!
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;