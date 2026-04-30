import React from "react";
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CalculateIcon from '@mui/icons-material/Calculate';
import { updateGoalPriority } from '../../store/profileSlice';
import { formatCurrency } from '../../utils/formatting';

export const EditableGoalItem = ({
  goal,
  currency,
  onEdit,
  onDelete,
  onOpenBridgeGapModal,
}) => {
  const dispatch = useDispatch();

  const handlePriorityChange = (e) => {
    dispatch(updateGoalPriority({ goalId: goal.id, priority: e.target.value }));
  };

  const getPriorityProps = (priority) => {
    switch (priority) {
      case 1: return { label: 'High', color: 'error' };
      case 2: return { label: 'Medium', color: 'warning' };
      case 3: return { label: 'Low', color: 'info' };
      default: return { label: 'Medium', color: 'warning' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Fully Funded': return 'success';
      case 'Partially Funded': return 'warning';
      case 'At Risk': return 'error';
      default: return 'default';
    }
  };

  const priorityProps = getPriorityProps(goal.priority);

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {goal.name}
            </Typography>
            <Chip label={priorityProps.label} color={priorityProps.color} size="small" />
          </Box>

          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mb: 0.5 }}>
            Target: {formatCurrency(goal.targetAmount, currency)}
          </Typography>

          {goal.inflationAdjustedTarget && (
            <Tooltip title="This is the target amount adjusted for inflation in today's money.">
              <Typography variant="caption" sx={{ color: "text.secondary", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <InfoIcon fontSize="small" />
                Real Value: {formatCurrency(goal.inflationAdjustedTarget, currency)}
              </Typography>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={() => onEdit(goal)} color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(goal.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={goal.priority || 2}
            onChange={handlePriorityChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={1}>High Priority</MenuItem>
            <MenuItem value={2}>Medium Priority</MenuItem>
            <MenuItem value={3}>Low Priority</MenuItem>
          </Select>
        </FormControl>
        
        <Chip label={goal.status} color={getStatusColor(goal.status)} />
      </Box>

      {(goal.status === 'Partially Funded' || goal.status === 'At Risk') && (
        <Button
          variant="outlined"
          size="small"
          color="warning"
          startIcon={<CalculateIcon />}
          onClick={() => onOpenBridgeGapModal(goal)}
          sx={{ mt: 2, width: '100%' }}
        >
          Calculate Required Monthly SIP
        </Button>
      )}
    </Paper>
  );
};

export default EditableGoalItem;
