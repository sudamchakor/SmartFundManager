import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { useEmiContext } from "../context/EmiContext";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Row = ({ yearData, currency, theme }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {yearData.year}
        </TableCell>
        <TableCell align="right">{currency}{yearData.totalPrincipal.toFixed(2)}</TableCell>
        <TableCell align="right">{currency}{yearData.totalInterest.toFixed(2)}</TableCell>
        <TableCell align="right">{currency}{yearData.totalPrepayment.toFixed(2)}</TableCell>
        <TableCell align="right">{currency}{(yearData.totalPrincipal + yearData.totalInterest + yearData.totalPrepayment).toFixed(2)}</TableCell>
        <TableCell align="right">{currency}{yearData.yearEndBalance.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Monthly Breakdown
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Principal</TableCell>
                    <TableCell align="right">Interest</TableCell>
                    <TableCell align="right">Prepayment</TableCell>
                    <TableCell align="right">Total Payment</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearData.months.map((monthRow) => (
                    <TableRow key={monthRow.date}>
                      <TableCell component="th" scope="row">
                        {monthRow.date}
                      </TableCell>
                      <TableCell align="right">{currency}{monthRow.principal.toFixed(2)}</TableCell>
                      <TableCell align="right">{currency}{monthRow.interest.toFixed(2)}</TableCell>
                      <TableCell align="right">{currency}{monthRow.prepayment.toFixed(2)}</TableCell>
                      <TableCell align="right">{currency}{monthRow.totalPayment.toFixed(2)}</TableCell>
                      <TableCell align="right">{currency}{monthRow.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const PaymentScheduleTable = () => {
  const { calculatedValues, currency } = useEmiContext();
  const schedule = calculatedValues.schedule;
  const theme = useTheme();

  const groupedSchedule = useMemo(() => {
    const years = {};
    schedule.forEach((row) => {
      const year = row.date.split(" ")[1];
      if (!years[year]) {
        years[year] = {
          year: year,
          totalPrincipal: 0,
          totalInterest: 0,
          totalPrepayment: 0,
          yearEndBalance: 0,
          months: [],
        };
      }
      years[year].totalPrincipal += row.principal;
      years[year].totalInterest += row.interest;
      years[year].totalPrepayment += row.prepayment;
      years[year].yearEndBalance = row.balance;
      years[year].months.push(row);
    });
    return Object.values(years);
  }, [schedule]);

  const headerCellStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyle} />
            <TableCell sx={headerCellStyle}>Year</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Principal</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>Interest</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.warning.main, color: theme.palette.warning.contrastText }}>Prepayment</TableCell>
            <TableCell align="right" sx={headerCellStyle}>Total Payment</TableCell>
            <TableCell align="right" sx={headerCellStyle}>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedSchedule.map((yearData) => (
            <Row key={yearData.year} yearData={yearData} currency={currency} theme={theme} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentScheduleTable;