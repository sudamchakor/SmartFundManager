import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Skeleton,
  useTheme,
  alpha,
  Stack,
  Divider,
} from "@mui/material";
import {
  ArrowRightAlt as ArrowRightAltIcon,
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  SettingsOutlined as SettingsIcon,
  AccountBalance as TaxIcon,
  CheckCircle as SuccessIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import DataCard from "../components/common/DataCard";
import ExemptionRow from "../components/common/ExemptionRow";
import {
  updateMonthData,
  updateSettings,
  updateDeclaration,
  addDynamicRow,
  editDynamicRow,
  deleteDynamicRow,
  updateHouseProperty,
  updateAge,
  selectSettings,
  selectCalculatedDeclarations,
  selectDynamicRows,
  selectHouseProperty,
  selectAge,
  selectCalculatedSalary,
  selectTaxComparison,
} from "../store/taxSlice";

const TaxDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Dynamic Row Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalType, setModalType] = useState("income");
  const [modalRowId, setModalRowId] = useState("");
  const [modalLabel, setModalLabel] = useState("");

  // Settings Modal State
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = useSelector(selectSettings);
  const declarations = useSelector(selectCalculatedDeclarations);
  const dynamicRows = useSelector(selectDynamicRows);
  const houseProperty = useSelector(selectHouseProperty);
  const age = useSelector(selectAge);
  const calculatedSalary = useSelector(selectCalculatedSalary);
  const taxComparison = useSelector(selectTaxComparison);

  if (!mounted) return null;

  const handleMonthChange = (index, field, value) => {
    setIsUpdating(true);
    dispatch(
      updateMonthData({ index, field, value, populateRemaining: false }),
    );
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handlePopulateRowFromCurrent = (index, field) => {
    setIsUpdating(true);
    dispatch(
      updateMonthData({
        index,
        field,
        value: calculatedSalary.months[index][field],
        populateRemaining: true,
      }),
    );
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleSettingChange = (field, value) => {
    setIsUpdating(true);
    dispatch(updateSettings({ [field]: value }));
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleDeclarationChange = (section, field, subfield, value) => {
    setIsUpdating(true);
    if (subfield) {
      dispatch(
        updateDeclaration({ section, field, value: { [subfield]: value } }),
      );
    } else {
      dispatch(updateDeclaration({ section, field, value }));
    }
    setTimeout(() => setIsUpdating(false), 300);
  };

  const openAddModal = (type) => {
    setModalType(type);
    setModalMode("add");
    setModalLabel("");
    setModalOpen(true);
  };

  const openEditModal = (type, id, currentLabel) => {
    setModalType(type);
    setModalMode("edit");
    setModalRowId(id);
    setModalLabel(currentLabel);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (modalLabel.trim() === "") return;
    if (modalMode === "add") {
      dispatch(addDynamicRow({ type: modalType, label: modalLabel }));
    } else {
      dispatch(
        editDynamicRow({ type: modalType, id: modalRowId, label: modalLabel }),
      );
    }
    setModalOpen(false);
  };

  // Shared Styles for the Command Center Aesthetic
  const labelStyle = {
    fontWeight: 800,
    textTransform: "uppercase",
    fontSize: "0.65rem",
    color: "text.disabled",
    letterSpacing: 1,
    mb: 0.5,
  };

  const wellInputStyle = {
    fontWeight: 800,
    fontSize: "0.85rem",
    bgcolor: alpha(theme.palette.primary.main, 0.04),
    color: "primary.main",
    px: 1,
    py: 0.5,
    borderRadius: 1,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    textAlign: "right",
    "& input": { textAlign: "right", p: 0 },
    transition: "all 0.2s",
    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
    "&.Mui-disabled": {
      bgcolor: alpha(theme.palette.text.disabled, 0.05),
      color: "text.secondary",
      borderColor: "transparent",
    },
  };

  // Table Cell Renderer
  const renderCell = (month, index, field, isCalculated = false) => {
    const isHovered = hoveredCell === `${index}-${field}`;

    return (
      <TableCell
        key={field}
        onMouseEnter={() =>
          !isCalculated && setHoveredCell(`${index}-${field}`)
        }
        onMouseLeave={() => !isCalculated && setHoveredCell(null)}
        sx={{
          position: "relative",
          p: 0.5,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TextField
          variant="standard"
          size="small"
          value={
            isCalculated
              ? Math.round(month[field] || 0)
              : month[field] || (month[field] === 0 ? "0" : "")
          }
          onChange={(e) =>
            !isCalculated && handleMonthChange(index, field, e.target.value)
          }
          disabled={isCalculated}
          InputProps={{
            disableUnderline: true,
            sx: { ...wellInputStyle, minWidth: 60, width: "100%" },
          }}
        />
        {isHovered && index < 11 && !isCalculated && (
          <Tooltip title={`Populate remaining months`} placement="top" arrow>
            <IconButton
              size="small"
              onClick={() => handlePopulateRowFromCurrent(index, field)}
              sx={{
                position: "absolute",
                right: -8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 2px 8px ${alpha(theme.palette.common.black || "#000", 0.2)}`,
                padding: "2px",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              <ArrowRightAltIcon fontSize="small" color="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    );
  };

  const earningsFixed = [
    {
      label: "Basic",
      field: "basic",
      includeField: "includePfBasic",
      tooltip:
        "Basic Salary Component - Fully taxable, forms base for PF and HRA calculation.",
    },
    {
      label: "DA",
      field: "da",
      includeField: "includePfDa",
      tooltip:
        "Dearness Allowance - Fully taxable, added to Basic for PF/HRA if it forms part of retirement benefits.",
    },
    {
      label: "Convey",
      field: "convey",
      includeField: "includePfConvey",
      tooltip: "Conveyance Allowance",
    },
    {
      label: "HRA",
      field: "hra",
      includeField: "includePfHra",
      tooltip: "House Rent Allowance - Partially exempt u/s 10(13A)",
    },
    {
      label: "Ch. Educ",
      field: "chEduc",
      includeField: "includePfChEduc",
      tooltip:
        "Children Education Allowance - Exempt up to ₹100 per month per child",
    },
    {
      label: "Medical",
      field: "medical",
      includeField: "includePfMedical",
      tooltip: "Medical Allowance - Fully taxable.",
    },
    {
      label: "LTA",
      field: "lta",
      includeField: "includePfLta",
      tooltip: "Leave Travel Allowance",
    },
    {
      label: "Uniform All.",
      field: "uniformAll",
      includeField: "includePfUniformAll",
      tooltip: "Uniform Allowance",
    },
    {
      label: "Car allow",
      field: "carAllow",
      includeField: "includePfCarAllow",
      tooltip: "Car Allowance",
    },
  ];

  const deductionsFixed = [
    {
      label: "Prof tax",
      field: "profTax",
      tooltip: "Professional Tax - Deductible from gross salary u/s 16(iii)",
    },
    {
      label: "PF",
      field: "pf",
      calculated: true,
      tooltip: "Provident Fund (Employee Contribution)",
    },
    {
      label: "VPF",
      field: "vpf",
      calculated: true,
      tooltip: "Voluntary Provident Fund",
    },
    { label: "IT", field: "it", tooltip: "Income Tax Deducted (TDS)" },
    {
      label: "Rent",
      field: "rent",
      tooltip: "Rent Paid - Used to calculate HRA Exemption.",
    },
    {
      label: "Life Insur.",
      field: "lifeInsur",
      tooltip: "Life Insurance Premium",
    },
  ];

  const otherFields = [
    { label: "Loan/Wdwl", field: "loanWdwl", tooltip: "Loan or Withdrawal" },
    { label: "OB", field: "ob", tooltip: "Opening Balance" },
    { label: "Int", field: "int", tooltip: "Interest" },
    { label: "CB", field: "cb", tooltip: "Closing Balance" },
  ];

  const renderRow = (
    label,
    field,
    isCalculated = false,
    isDynamic = false,
    dynamicType = null,
    id = null,
    tooltipText = null,
  ) => (
    <TableRow key={field}>
      <TableCell
        component="th"
        scope="row"
        sx={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          minWidth: 100,
          maxWidth: 120,
          p: 1,
          bgcolor: theme.palette.background.paper,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Tooltip title={tooltipText || label} placement="right" arrow>
            <Typography
              variant="caption"
              sx={{
                fontWeight: isCalculated ? 900 : 700,
                color: isCalculated ? "primary.main" : "text.primary",
                textTransform: isCalculated ? "uppercase" : "none",
              }}
            >
              {label}
            </Typography>
          </Tooltip>
          {isDynamic && (
            <Box>
              <IconButton
                size="small"
                onClick={() => openEditModal(dynamicType, id, label)}
                sx={{ p: 0.2 }}
              >
                <EditIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  dispatch(deleteDynamicRow({ type: dynamicType, id }))
                }
                sx={{ p: 0.2 }}
              >
                <DeleteIcon sx={{ fontSize: "1rem", color: "error.main" }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </TableCell>
      {calculatedSalary.months.map((month, index) =>
        renderCell(month, index, field, isCalculated),
      )}
    </TableRow>
  );

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      {isUpdating && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.background.default, 0.5),
            backdropFilter: "blur(4px)",
            zIndex: 999,
            borderRadius: 3,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 3, opacity: 0.2 }}
          />
        </Box>
      )}

      {/* Technical Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <TaxIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: -0.5,
              }}
            >
              Indian Tax Engine (FY 2025-26)
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Compute comparative tax liabilities across legislative regimes.
            </Typography>
          </Box>
        </Stack>
        <Tooltip title="System Configuration & Rules" arrow>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsModalOpen(true)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            Config
          </Button>
        </Tooltip>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Column: Heavy Data Entry */}
        <Grid item xs={12} lg={8}>
          {/* Main Salary Spreadsheet */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1.5,
              }}
            >
              Monthly Salary Parameters
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 4px 24px ${alpha(theme.palette.common.black || "#000", 0.02)}`,
                overflow: "hidden",
              }}
            >
              <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          bgcolor: alpha(theme.palette.background.paper, 0.9),
                          backdropFilter: "blur(10px)",
                          zIndex: 2,
                          minWidth: 100,
                          maxWidth: 120,
                          borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        }}
                      ></TableCell>
                      {calculatedSalary.months.map((m) => (
                        <TableCell
                          key={m.month}
                          align="center"
                          sx={{
                            minWidth: 60,
                            py: 1,
                            fontWeight: 800,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            color: "text.secondary",
                            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          }}
                        >
                          {m.month}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earningsFixed.map((item) =>
                      renderRow(
                        item.label,
                        item.field,
                        false,
                        false,
                        null,
                        null,
                        item.tooltip,
                      ),
                    )}
                    {dynamicRows.income.map((item) =>
                      renderRow(
                        item.label,
                        item.id,
                        false,
                        true,
                        "income",
                        item.id,
                      ),
                    )}
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{
                          p: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => openAddModal("income")}
                          sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                          Inject Income Row
                        </Button>
                      </TableCell>
                    </TableRow>
                    {renderRow(
                      "Gross Total",
                      "total",
                      true,
                      false,
                      null,
                      null,
                      "Total Monthly Gross Earnings",
                    )}

                    {deductionsFixed.map((item) =>
                      renderRow(
                        item.label,
                        item.field,
                        item.calculated,
                        false,
                        null,
                        null,
                        item.tooltip,
                      ),
                    )}
                    {dynamicRows.deduction.map((item) =>
                      renderRow(
                        item.label,
                        item.id,
                        false,
                        true,
                        "deduction",
                        item.id,
                      ),
                    )}
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{
                          p: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => openAddModal("deduction")}
                          sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                          Inject Deduction Row
                        </Button>
                      </TableCell>
                    </TableRow>
                    {renderRow(
                      "Tot Deduct",
                      "totDed",
                      true,
                      false,
                      null,
                      null,
                      "Total Monthly Deductions",
                    )}
                    {renderRow(
                      "Net Pay",
                      "net",
                      true,
                      false,
                      null,
                      null,
                      "Net Monthly Salary",
                    )}
                    {otherFields.map((item) =>
                      renderRow(
                        item.label,
                        item.field,
                        false,
                        false,
                        null,
                        null,
                        item.tooltip,
                      ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DataCard title="A. Sec 10 & 17 Exemptions">
                <Stack spacing={1.5}>
                  <ExemptionRow
                    label="HRA Exemption"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.hra.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "hra",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.hra.limited}
                  />
                  <ExemptionRow
                    label="Transport Exemption"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.transport.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "transport",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.transport.limited}
                  />
                  <ExemptionRow
                    label="Gratuity / Other"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.gratuity.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "gratuity",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.gratuity.limited}
                  />
                  <ExemptionRow
                    label="Children's Ed. Allowance"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.childrenEduc.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "childrenEduc",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.childrenEduc.limited}
                  />
                  <ExemptionRow
                    label="LTA Exemption"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.lta.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "lta",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.lta.limited}
                  />
                  <ExemptionRow
                    label="Uniform Expenses"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.exemptions.uniform.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "exemptions",
                            "uniform",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.exemptions.uniform.limited}
                  />

                  <Divider
                    sx={{
                      my: 1,
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "text.secondary",
                      }}
                    >
                      Total Allowances
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 900, color: "text.primary" }}
                    >
                      ₹{" "}
                      {Math.round(
                        declarations.exemptions.totalLimited,
                      ).toLocaleString("en-IN")}
                    </Typography>
                  </Stack>
                </Stack>
              </DataCard>

              <DataCard title="B. Other Income">
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={labelStyle}>
                      Annual/Performance Bonus
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.otherIncome.bonus}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "otherIncome",
                          "bonus",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>
                      Savings/Deposit Interest
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.otherIncome.savingsInt}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "otherIncome",
                          "savingsInt",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>
                      Dividends (MFs/Stocks)
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.otherIncome.dividends}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "otherIncome",
                          "dividends",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>Capital Gains</Typography>
                    <TextField
                      variant="standard"
                      value={declarations.otherIncome.capitalGains}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "otherIncome",
                          "capitalGains",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>
                      Digital Assets (Crypto 30%)
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.otherIncome.crypto}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "otherIncome",
                          "crypto",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                </Stack>
              </DataCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <DataCard title="C. Chapter VI-A Deductions">
                <Stack spacing={1.5}>
                  <ExemptionRow
                    label="80D - Health Insurance"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80D.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80D",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80D.limited}
                  />
                  <ExemptionRow
                    label="80DD/DDB - Medical"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80DD_DDB.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80DD_DDB",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80DD_DDB.limited}
                  />
                  <ExemptionRow
                    label="80E/EEB - Loan Interest"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80E_EEB.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80E_EEB",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80E_EEB.limited}
                  />
                  <ExemptionRow
                    label="80G - Charity Donations"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80G.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80G",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80G.limited}
                  />
                  <ExemptionRow
                    label="80GG - Rent (No HRA)"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80GG.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80GG",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80GG.limited}
                  />
                  <ExemptionRow
                    label="80TTA/U - Bank Interest"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={declarations.deductions.sec80TTA_U.produced}
                        onChange={(e) =>
                          handleDeclarationChange(
                            "deductions",
                            "sec80TTA_U",
                            "produced",
                            e.target.value,
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={declarations.deductions.sec80TTA_U.limited}
                  />
                  <ExemptionRow
                    label="Sec 24(b) - Home Loan"
                    produced={
                      <TextField
                        variant="standard"
                        size="small"
                        value={houseProperty.interest}
                        onChange={(e) =>
                          dispatch(
                            updateHouseProperty({ interest: e.target.value }),
                          )
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: wellInputStyle,
                        }}
                      />
                    }
                    limited={Math.min(
                      parseFloat(houseProperty.interest) || 0,
                      200000,
                    )}
                  />
                </Stack>
              </DataCard>

              <DataCard title="D. Sec 80C Investments">
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={labelStyle}>
                      NPS: Employee (80CCD(1))
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.sec80C.npsEmployee}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "sec80C",
                          "npsEmployee",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>
                      NPS: Employer (80CCD(2))
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.sec80C.npsEmployer}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "sec80C",
                          "npsEmployer",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>
                      Standard 80C (PPF, ELSS)
                    </Typography>
                    <TextField
                      variant="standard"
                      value={declarations.sec80C.standard80C}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "sec80C",
                          "standard80C",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}>Superannuation</Typography>
                    <TextField
                      variant="standard"
                      value={declarations.sec80C.superannuation}
                      onChange={(e) =>
                        handleDeclarationChange(
                          "sec80C",
                          "superannuation",
                          null,
                          e.target.value,
                        )
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: wellInputStyle,
                      }}
                    />
                  </Box>

                  <Divider
                    sx={{
                      my: 1,
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "text.secondary",
                      }}
                    >
                      Total 80C Claimed
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 900, color: "text.primary" }}
                    >
                      ₹{" "}
                      {Math.round(declarations.sec80C.limited).toLocaleString(
                        "en-IN",
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </DataCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Tax Verdict Terminal */}
        <Grid item xs={12} lg={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              position: "sticky",
              top: 24,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              boxShadow: `0 12px 40px ${alpha(theme.palette.common.black || "#000", 0.05)}`,
              backdropFilter: "blur(20px)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                color: "text.disabled",
                letterSpacing: 1.5,
                display: "block",
                mb: 2,
              }}
            >
              System Output
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                Recommended Regime
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: "primary.main",
                  letterSpacing: -1,
                  lineHeight: 1.2,
                  mt: 0.5,
                }}
              >
                {taxComparison.optimal}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 4,
                p: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <SuccessIcon sx={{ color: "success.main" }} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: "success.dark",
                    textTransform: "uppercase",
                  }}
                >
                  Maximum Efficiency
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Saves{" "}
                  <strong>
                    ₹{" "}
                    {Math.round(taxComparison.savings).toLocaleString("en-IN")}
                  </strong>{" "}
                  in liabilities.
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              {/* Old Regime Terminal Box */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.divider, 0.03),
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: "text.secondary",
                    mb: 1,
                    display: "block",
                  }}
                >
                  Old Regime Projection
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Taxable Income
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    ₹{" "}
                    {Math.round(
                      taxComparison.oldRegime.taxableIncome,
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Total Liability
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                      color:
                        taxComparison.optimal === "Old Regime"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    ₹{" "}
                    {Math.round(taxComparison.oldRegime.tax).toLocaleString(
                      "en-IN",
                    )}
                  </Typography>
                </Stack>
              </Box>

              {/* New Regime Terminal Box */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.divider, 0.03),
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: "text.secondary",
                    mb: 1,
                    display: "block",
                  }}
                >
                  New Regime Projection
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Taxable Income
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    ₹{" "}
                    {Math.round(
                      taxComparison.newRegime.taxableIncome,
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Total Liability
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                      color:
                        taxComparison.optimal === "New Regime"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    ₹{" "}
                    {Math.round(taxComparison.newRegime.tax).toLocaleString(
                      "en-IN",
                    )}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: 800,
                borderRadius: 2,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Export Report
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Dynamic Row Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 24px 64px ${alpha(theme.palette.common.black || "#000", 0.2)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {modalMode === "add" ? "Inject Data Row" : "Modify Data Row"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={labelStyle}>Row Identifier</Typography>
          <TextField
            autoFocus
            variant="standard"
            fullWidth
            value={modalLabel}
            onChange={(e) => setModalLabel(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                ...wellInputStyle,
                textAlign: "left",
                "& input": { textAlign: "left" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setModalOpen(false)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleModalSave}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 800 }}
          >
            Apply Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Modal */}
      <Dialog
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 24px 64px ${alpha(theme.palette.common.black || "#000", 0.2)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>System Configuration</DialogTitle>
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <Typography sx={labelStyle}>Assessee Age</Typography>
              <TextField
                variant="standard"
                value={age}
                onChange={(e) => dispatch(updateAge(e.target.value))}
                fullWidth
                InputProps={{ disableUnderline: true, sx: wellInputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={labelStyle}>Metro City Residence?</Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={settings.isMetro}
                  onChange={(e) =>
                    handleSettingChange("isMetro", e.target.value)
                  }
                  disableUnderline
                  sx={wellInputStyle}
                >
                  <MenuItem value="Yes" sx={{ fontWeight: 700 }}>
                    Yes
                  </MenuItem>
                  <MenuItem value="No" sx={{ fontWeight: 700 }}>
                    No
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={labelStyle}>Employee PF Base (%)</Typography>
              <TextField
                variant="standard"
                value={settings.pfPercent}
                onChange={(e) =>
                  handleSettingChange("pfPercent", e.target.value)
                }
                fullWidth
                InputProps={{ disableUnderline: true, sx: wellInputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={labelStyle}>Voluntary PF Boost (%)</Typography>
              <TextField
                variant="standard"
                value={settings.vpfPercent}
                onChange={(e) =>
                  handleSettingChange("vpfPercent", e.target.value)
                }
                fullWidth
                InputProps={{ disableUnderline: true, sx: wellInputStyle }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 3,
                  mb: 1.5,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "primary.main",
                  letterSpacing: 0.5,
                }}
              >
                PF Inclusion Logic Engine
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: "hidden",
                }}
              >
                <Table size="small">
                  <TableBody>
                    {earningsFixed.map((item) => (
                      <TableRow
                        key={item.includeField}
                        sx={{ "&:last-child td": { borderBottom: 0 } }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          <Select
                            variant="standard"
                            value={
                              calculatedSalary.months[0][item.includeField] ||
                              "N"
                            }
                            onChange={(e) =>
                              dispatch(
                                updateMonthData({
                                  index: 0,
                                  field: item.includeField,
                                  value: e.target.value,
                                  populateRemaining: true,
                                }),
                              )
                            }
                            disableUnderline
                            sx={{
                              ...wellInputStyle,
                              py: 0,
                              px: 1,
                              "& .MuiSelect-select": { pr: 3 },
                            }}
                          >
                            <MenuItem value="Y" sx={{ fontWeight: 700 }}>
                              Included
                            </MenuItem>
                            <MenuItem value="N" sx={{ fontWeight: 700 }}>
                              Excluded
                            </MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {dynamicRows.income.map((item) => {
                      const fieldName = `includePf${item.id.charAt(0).toUpperCase() + item.id.slice(1)}`;
                      return (
                        <TableRow
                          key={fieldName}
                          sx={{ "&:last-child td": { borderBottom: 0 } }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                          >
                            {item.label}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                          >
                            <Select
                              variant="standard"
                              value={
                                calculatedSalary.months[0][fieldName] || "N"
                              }
                              onChange={(e) =>
                                dispatch(
                                  updateMonthData({
                                    index: 0,
                                    field: fieldName,
                                    value: e.target.value,
                                    populateRemaining: true,
                                  }),
                                )
                              }
                              disableUnderline
                              sx={{
                                ...wellInputStyle,
                                py: 0,
                                px: 1,
                                "& .MuiSelect-select": { pr: 3 },
                              }}
                            >
                              <MenuItem value="Y" sx={{ fontWeight: 700 }}>
                                Included
                              </MenuItem>
                              <MenuItem value="N" sx={{ fontWeight: 700 }}>
                                Excluded
                              </MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}
        >
          <Button
            onClick={() => setSettingsModalOpen(false)}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 800, px: 4 }}
          >
            Apply Config
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxDashboard;
