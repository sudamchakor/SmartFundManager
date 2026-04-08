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
} from "@mui/material";
import { useEmiContext } from "../context/EmiContext";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// Define a common style for cell borders for better readability and maintenance.
const cellBorderStyle = {
  border: "1px solid rgba(224, 224, 224, 1)",
};

const Row = ({ yearData, currency }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      {/* Main row for the year */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={cellBorderStyle}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={cellBorderStyle}>
          {yearData.year}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {currency}
          {yearData.totalPrincipal}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {currency}
          {yearData.totalInterest}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {currency}
          {yearData.totalPrepayment}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {currency}
          {yearData.totalPrincipal +
            yearData.totalInterest +
            yearData.totalPrepayment}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {currency}
          {yearData.yearEndBalance}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {yearData.paidPercent}%
        </TableCell>
      </TableRow>
      {/* Collapsible row for the months */}
      <TableRow>
        <TableCell style={{ padding: 0, border: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table aria-label="purchases">
                <TableBody>
                  {yearData.months.map((monthRow) => (
                    <TableRow key={monthRow.date}>
                      {/* Empty cell to align with the expand icon column */}
                      <TableCell sx={cellBorderStyle} />
                      <TableCell
                        component="th"
                        scope="row"
                        sx={cellBorderStyle}
                      >
                        {monthRow.date.split(" ")[0]}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {currency}
                        {monthRow.principal}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {currency}
                        {monthRow.interest}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {currency}
                        {monthRow.prepayment}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {currency}
                        {monthRow.totalPayment}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {currency}
                        {monthRow.balance}
                      </TableCell>
                      <TableCell align="right" sx={cellBorderStyle}>
                        {monthRow.paidPercent}%
                      </TableCell>
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
      years[year].totalPrincipal += Math.round(row.principal);
      years[year].totalInterest += Math.round(row.interest);
      years[year].totalPrepayment += Math.round(row.prepayment);
      years[year].yearEndBalance = Math.round(row.balance);
      years[year].paidPercent = Math.round(row.paidPercent);
      years[year].months.push(row);
    });
    return Object.values(years);
  }, [schedule]);

  // Define a common style for header cells.
  const headerCellStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    ...cellBorderStyle,
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyle} />
            <TableCell sx={headerCellStyle}>Year</TableCell>
            <TableCell align="right" sx={headerCellStyle}>
              Principal
            </TableCell>
            <TableCell
              align="right"
              sx={{
                ...headerCellStyle,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              Interest
            </TableCell>
            <TableCell
              align="right"
              sx={{
                ...headerCellStyle,
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
              }}
            >
              Prepayment
            </TableCell>
            <TableCell align="right" sx={headerCellStyle}>
              Total Payment
            </TableCell>
            <TableCell align="right" sx={headerCellStyle}>
              Balance
            </TableCell>
            <TableCell sx={headerCellStyle}>Loan Paid To Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedSchedule.map((yearData) => (
            <Row
              key={yearData.year}
              yearData={yearData}
              currency={currency}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentScheduleTable;
