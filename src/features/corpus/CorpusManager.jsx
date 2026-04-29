import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addAsset,
  removeAsset,
  selectAllAssets,
  selectTotalCorpus,
  selectWeightedAverageReturn,
} from './corpusSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '../../utils/formatting';

const CorpusManager = () => {
  const dispatch = useDispatch();
  const assets = useSelector(selectAllAssets);
  const totalCorpus = useSelector(selectTotalCorpus);
  const weightedAverageReturn = useSelector(selectWeightedAverageReturn);

  const [open, setOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    label: '',
    value: '',
    expectedReturn: '',
    category: 'Equity',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleAddAsset = () => {
    const { label, value, expectedReturn, category } = newAsset;
    if (label && value && expectedReturn) {
      dispatch(addAsset(label, value, expectedReturn, category));
      setNewAsset({ label: '', value: '', expectedReturn: '', category: 'Equity' });
      handleClose();
    }
  };

  const handleRemoveAsset = (id) => {
    dispatch(removeAsset(id));
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="div">
              Investment Corpus
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Return</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.label}</TableCell>
                    <TableCell align="right">{formatCurrency(asset.value)}</TableCell>
                    <TableCell align="right">{asset.expectedReturn.toFixed(2)}%</TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAsset(asset.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Paper
        sx={{
          mt: 2,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          flexWrap: 'wrap', // Allow wrapping on small screens
          gap: 1,
        }}
      >
        <Typography variant="subtitle1">Total Corpus:</Typography>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(totalCorpus)}
        </Typography>
        <Typography variant="subtitle1">Avg. Return:</Typography>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {weightedAverageReturn.toFixed(2)}%
        </Typography>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Investment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="label"
            label="Asset Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAsset.label}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="value"
            label="Current Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newAsset.value}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <Typography>₹</Typography>,
            }}
          />
          <TextField
            margin="dense"
            name="expectedReturn"
            label="Expected Return"
            type="number"
            fullWidth
            variant="outlined"
            value={newAsset.expectedReturn}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <Typography>%</Typography>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAsset}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CorpusManager;