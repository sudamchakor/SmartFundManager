import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { selectGoalCoverage, reorderGoals } from '../../../store/profileSlice';
import { selectCurrency } from '../../../store/emiSlice';
import { formatCurrency } from '../../../utils/formatting';

const GoalCoverage = forwardRef((props, ref) => {
  const goalCoverage = useSelector(selectGoalCoverage);
  const currency = useSelector(selectCurrency);
  const dispatch = useDispatch();
  const componentRef = useRef(null);

  const [localGoals, setLocalGoals] = useState([]);

  useEffect(() => {
      setLocalGoals(goalCoverage);
  }, [goalCoverage]);

  useImperativeHandle(ref, () => ({
    getRef: () => componentRef
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Fully Funded':
        return 'success';
      case 'Partially Funded':
        return 'warning';
      case 'At Risk':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDragStart = (e, index) => {
      e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
      e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      const sourceIndex = e.dataTransfer.getData('text/plain');
      if (sourceIndex === '') return;
      
      const newGoals = [...localGoals];
      const [draggedGoal] = newGoals.splice(sourceIndex, 1);
      newGoals.splice(targetIndex, 0, draggedGoal);
      
      // Re-assign priorities based on new order
      const updatedGoals = newGoals.map((goal, index) => ({
          ...goal,
          priority: index + 1
      }));

      setLocalGoals(updatedGoals);
      // Dispatch the new order back to Redux so the selector recalculates
      dispatch(reorderGoals(updatedGoals));
  };


  return (
    <Card sx={{ height: '100%' }} ref={componentRef}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Goal Coverage Priority List
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Compares your projected inflation-adjusted wealth against the estimated cost of your goals. Drag to re-prioritize.
        </Typography>
        <List>
          {localGoals.map((goal, index) => (
            <ListItem 
              key={goal.id} 
              divider
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              sx={{ 
                  cursor: 'grab', 
                  '&:active': { cursor: 'grabbing' },
                  bgcolor: 'background.paper',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <IconButton edge="start" disableRipple sx={{ cursor: 'inherit', mr: 1 }}>
                 <DragIndicatorIcon />
              </IconButton>
              <ListItemText
                primary={goal.name}
                secondary={`Target: ${formatCurrency(goal.targetAmount, currency)} (Year: ${goal.targetYear})`}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Chip
                  label={goal.status}
                  color={getStatusColor(goal.status)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                {goal.status === 'Partially Funded' && (
                  <Typography variant="caption" color="text.secondary">
                    Funded: {formatCurrency(goal.fundedAmount, currency)}
                  </Typography>
                )}
              </Box>
            </ListItem>
          ))}
          {localGoals.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              No goals added yet.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
});

export default GoalCoverage;
