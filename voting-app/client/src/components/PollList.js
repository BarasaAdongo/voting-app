import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PollIcon from '@mui/icons-material/Poll';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/polls');
        setPolls(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setError('Failed to load polls. Please try again later.');
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleDeleteClick = (poll) => {
    setPollToDelete(poll);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pollToDelete) return;

    try {
      console.log('Attempting to delete poll:', pollToDelete._id);
      const response = await axios.delete(`http://localhost:5000/api/polls/${pollToDelete._id}`);
      console.log('Delete response:', response);
      
      setPolls(polls.filter(poll => poll._id !== pollToDelete._id));
      setDeleteDialogOpen(false);
      setPollToDelete(null);
      setError({ type: 'success', message: 'Poll deleted successfully' });
    } catch (error) {
      console.error('Error deleting poll:', error.response || error);
      setError({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to delete poll. Please try again.' 
      });
      // Keep the dialog open on error
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPollToDelete(null);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PollIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h5" component="h1" fontWeight="bold">
          Active Polls
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
          const mostVotes = Math.max(...poll.options.map(option => option.votes));
          
          return (
            <Grid item xs={12} md={6} lg={4} key={poll._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(to bottom right, #ffffff, #f7f7f7)',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                      }}
                    >
                      {poll.question}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(poll)}
                      sx={{
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {poll.options.map((option) => (
                      <Box key={option._id} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{option.text}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.votes} votes
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(option.votes / (mostVotes || 1)) * 100}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <HowToVoteIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {totalVotes} total votes
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/poll/${poll._id}`)}
                      startIcon={<HowToVoteIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Vote Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 2 }}>
          Delete Poll
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the poll "{pollToDelete?.question}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleErrorClose}
          severity={error?.type || 'error'}
          sx={{ width: '100%' }}
        >
          {error?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PollList; 