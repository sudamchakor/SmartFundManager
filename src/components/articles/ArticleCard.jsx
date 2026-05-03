import React from 'react';
import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import DataCard from '../common/DataCard'; // Assuming DataCard is in common
import ImageIcon from '@mui/icons-material/Image'; // Default icon

// Import centralized category icons
import { categoryIcons } from '../../utils/articleCategories';

const ArticleCard = ({ article }) => {
  const theme = useTheme();

  // Get the appropriate icon component based on the article's category
  const IconComponent = categoryIcons[article.category] || ImageIcon; // Fallback to ImageIcon

  // Format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Check if it's a Firestore Timestamp object
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    // Otherwise, assume it's already a string or Date object
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <DataCard
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 0, // Remove padding from DataCard to control it here
        overflow: 'hidden',
      }}
    >
      {article.imageUrl ? (
        <Box
          sx={{
            width: '100%',
            height: 180,
            backgroundImage: `url(${article.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            mb: 2,
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.grey[600],
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            mb: 2,
          }}
        >
          <IconComponent sx={{ fontSize: 80 }} />
        </Box>
      )}
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="overline" color="text.secondary" sx={{ mb: 0.5 }}>
          {article.category}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3 }}>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {article.excerpt}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(article.createdAt)}
          </Typography>
          {article.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Updated: {formatDate(article.updatedAt)}
            </Typography>
          )}
        </Box>
        <Button
          component={Link}
          to={`/articles/${article.id}`}
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'flex-start', mt: 'auto' }}
        >
          Read More
        </Button>
      </Box>
    </DataCard>
  );
};

export default ArticleCard;
