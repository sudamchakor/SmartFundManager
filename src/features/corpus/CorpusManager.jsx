import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeAsset,
  selectAllAssets,
  selectTotalCorpus,
  selectWeightedAverageReturn,
} from "./corpusSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Divider,
  CardHeader,
  Stack,
  Tooltip,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { formatCurrency } from "../../utils/formatting";

const CorpusManager = ({ onOpenModal }) => {
  const dispatch = useDispatch();
  const assets = useSelector(selectAllAssets);
  const totalCorpus = useSelector(selectTotalCorpus);
  const weightedAverageReturn = useSelector(selectWeightedAverageReturn);

  const handleRemoveAsset = (id) => {
    dispatch(removeAsset(id));
  };

  // Helper to determine color based on asset name (simple logic)
  const getAssetColor = (label) => {
    const l = label.toLowerCase();
    if (l.includes("equity") || l.includes("stock")) return "#2e7d32"; // Green
    if (l.includes("debt") || l.includes("bond") || l.includes("fd"))
      return "#0288d1"; // Blue
    return "#7b1fa2"; // Purple/Other
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 1,
      }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalanceWalletIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Investment Corpus
            </Typography>
          </Stack>
        }
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => onOpenModal("corpus", null, "add")}
            sx={{ borderRadius: 1.5, textTransform: "none", px: 2 }}
          >
            Add Asset
          </Button>
        }
      />
      <Divider />

      <CardContent
        sx={{ flexGrow: 1, p: 2, overflowY: "auto", maxHeight: "400px" }}
      >
        <Stack spacing={1.5}>
          {assets.map((asset) => {
            const expectedReturnNum = parseFloat(asset.expectedReturn);
            const assetColor = getAssetColor(asset.label);

            return (
              <Box
                key={asset.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.100",
                  borderLeft: `5px solid ${assetColor}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "#f8faff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, color: "#333" }}
                  >
                    {asset.label}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUpIcon sx={{ fontSize: 14, color: assetColor }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      {!isNaN(expectedReturnNum)
                        ? expectedReturnNum.toFixed(2)
                        : "0.00"}
                      % Return
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 800, color: "text.primary" }}
                  >
                    {formatCurrency(asset.value)}
                  </Typography>

                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onOpenModal("corpus", asset, "edit")}
                        sx={{ bgcolor: "#f0f7ff", mr: 0.5 }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveAsset(asset.id)}
                        sx={{ bgcolor: "#fff0f0" }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </CardContent>

      {/* Premium LCD-Style Footer */}
      <Box
        sx={{
          p: 2,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "primary.contrastText",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, fontWeight: 700, textTransform: "uppercase" }}
            >
              Total Corpus
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {formatCurrency(totalCorpus)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              textAlign: "right",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, fontWeight: 700, textTransform: "uppercase" }}
            >
              Avg. Return
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {weightedAverageReturn.toFixed(2)}%
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default CorpusManager;
