import React from "react";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Divider,
  alpha,
  useTheme,
  Box,
} from "@mui/material";
import DataCard from "../common/DataCard";
import ExemptionRow from "../common/ExemptionRow";

const Declarations = ({
  declarations,
  houseProperty,
  handleDeclarationChange,
  updateHouseProperty,
  wellInputStyle,
  labelStyle,
}) => {
  const theme = useTheme();

  const createTextField = (
    section,
    field,
    subfield,
    currentValue,
    limit,
    isLimited = false,
  ) => {
    const isError = limit && currentValue > limit;
    const helperText = isError
      ? `Max limit is ₹${limit.toLocaleString("en-IN")}`
      : "";

    return (
      <TextField
        variant="standard"
        size="small"
        value={currentValue}
        onChange={(e) =>
          handleDeclarationChange(section, field, subfield, e.target.value)
        }
        error={isError}
        helperText={helperText}
        InputProps={{
          disableUnderline: true,
          sx: {
            ...wellInputStyle,
            ...(isError && {
              borderColor: theme.palette.error.main,
              "&:hover": {
                borderColor: theme.palette.error.dark,
              },
            }),
          },
        }}
        sx={{
          "& .MuiFormHelperText-root": {
            fontSize: "0.6rem",
            color: "error.main",
            position: "absolute",
            bottom: -18,
            right: 0,
            textAlign: "right",
          },
        }}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <DataCard title="A. Sec 10 & 17 Exemptions">
          <Stack spacing={1.5}>
            <ExemptionRow
              label="Standard Deduction"
              produced={
                <Typography sx={{ ...wellInputStyle, textAlign: "right" }}>
                  ₹75,000
                </Typography>
              }
              limited={75000}
            />
            <ExemptionRow
              label="HRA Exemption"
              produced={createTextField(
                "exemptions",
                "hra",
                "produced",
                declarations.exemptions.hra.produced,
              )}
              limited={declarations.exemptions.hra.limited}
            />
            <ExemptionRow
              label="Transport Exemption"
              produced={createTextField(
                "exemptions",
                "transport",
                "produced",
                declarations.exemptions.transport.produced,
                38400,
              )}
              limited={declarations.exemptions.transport.limited}
            />
            <ExemptionRow
              label="Gratuity / Other"
              produced={createTextField(
                "exemptions",
                "gratuity",
                "produced",
                declarations.exemptions.gratuity.produced,
              )}
              limited={declarations.exemptions.gratuity.limited}
            />
            <ExemptionRow
              label="Children's Ed. Allowance"
              produced={createTextField(
                "exemptions",
                "childrenEduc",
                "produced",
                declarations.exemptions.childrenEduc.produced,
                2400,
              )}
              limited={declarations.exemptions.childrenEduc.limited}
            />
            <ExemptionRow
              label="LTA Exemption"
              produced={createTextField(
                "exemptions",
                "lta",
                "produced",
                declarations.exemptions.lta.produced,
              )}
              limited={declarations.exemptions.lta.limited}
            />
            <ExemptionRow
              label="Uniform Expenses"
              produced={createTextField(
                "exemptions",
                "uniform",
                "produced",
                declarations.exemptions.uniform.produced,
              )}
              limited={declarations.exemptions.uniform.limited}
            />
          </Stack>
        </DataCard>

        <DataCard title="B. Other Income">
          <Stack spacing={2}>
            {createTextField(
              "otherIncome",
              "bonus",
              null,
              declarations.otherIncome.bonus,
            )}
            {createTextField(
              "otherIncome",
              "savingsInt",
              null,
              declarations.otherIncome.savingsInt,
            )}
            {createTextField(
              "otherIncome",
              "dividends",
              null,
              declarations.otherIncome.dividends,
            )}
            {createTextField(
              "otherIncome",
              "capitalGains",
              null,
              declarations.otherIncome.capitalGains,
            )}
            {createTextField(
              "otherIncome",
              "crypto",
              null,
              declarations.otherIncome.crypto,
            )}
          </Stack>
        </DataCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <DataCard title="C. Chapter VI-A Deductions">
          <Stack spacing={1.5}>
            <ExemptionRow
              label="80D - Health Insurance"
              produced={createTextField(
                "deductions",
                "sec80D",
                "produced",
                declarations.deductions.sec80D.produced,
                100000,
              )}
              limited={declarations.deductions.sec80D.limited}
            />
            <ExemptionRow
              label="80DD/DDB - Medical"
              produced={createTextField(
                "deductions",
                "sec80DD_DDB",
                "produced",
                declarations.deductions.sec80DD_DDB.produced,
                125000,
              )}
              limited={declarations.deductions.sec80DD_DDB.limited}
            />
            <ExemptionRow
              label="80E/EEB - Loan Interest"
              produced={createTextField(
                "deductions",
                "sec80E_EEB",
                "produced",
                declarations.deductions.sec80E_EEB.produced,
              )}
              limited={declarations.deductions.sec80E_EEB.limited}
            />
            <ExemptionRow
              label="80G - Charity Donations"
              produced={createTextField(
                "deductions",
                "sec80G",
                "produced",
                declarations.deductions.sec80G.produced,
              )}
              limited={declarations.deductions.sec80G.limited}
            />
            <ExemptionRow
              label="80GG - Rent (No HRA)"
              produced={createTextField(
                "deductions",
                "sec80GG",
                "produced",
                declarations.deductions.sec80GG.produced,
                60000,
              )}
              limited={declarations.deductions.sec80GG.limited}
            />
            <ExemptionRow
              label="80TTA/U - Bank Interest"
              produced={createTextField(
                "deductions",
                "sec80TTA_U",
                "produced",
                declarations.deductions.sec80TTA_U.produced,
                50000,
              )}
              limited={declarations.deductions.sec80TTA_U.limited}
            />
            <ExemptionRow
              label="Sec 24(b) - Home Loan"
              produced={createTextField(
                "houseProperty",
                "interest",
                null,
                houseProperty.interest,
                200000,
              )}
              limited={Math.min(
                parseFloat(houseProperty.interest) || 0,
                200000,
              )}
            />
          </Stack>
        </DataCard>

        <DataCard title="D. Sec 80C Investments">
          <Stack spacing={2}>
            {createTextField(
              "sec80C",
              "npsEmployee",
              null,
              declarations.sec80C.npsEmployee,
            )}
            {createTextField(
              "sec80C",
              "npsEmployer",
              null,
              declarations.sec80C.npsEmployer,
            )}
            {createTextField(
              "sec80C",
              "standard80C",
              null,
              declarations.sec80C.standard80C,
              150000,
            )}
            {createTextField(
              "sec80C",
              "superannuation",
              null,
              declarations.sec80C.superannuation,
            )}
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
  );
};

export default Declarations;
