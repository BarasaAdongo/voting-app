import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewPoll() {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/polls/${id}`);
        setPoll(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching poll:', error);
        setError('Failed to load poll');
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async (optionIndex) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/polls/${id}/vote`, {
        optionIndex,
      });
      setPoll(response.data);
      setVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote');
    }
  };

  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Polls
        </Button>
      </Container>
    );
  }

  if (!poll) {
    return (
      <Container>
        <Alert severity="info">Poll not found</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Polls
        </Button>
      </Container>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {poll.question}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          {poll.options.map((option, index) => {
            const percentage = totalVotes === 0 ? 0 : (option.votes / totalVotes) * 100;
            
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Button
                    variant={voted ? 'outlined' : 'contained'}
                    onClick={() => handleVote(index)}
                    disabled={voted}
                    fullWidth
                  >
                    {option.text}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="textSecondary">
            Total votes: {totalVotes}
          </Typography>
          <Button onClick={() => navigate('/')} variant="outlined">
            Back to Polls
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ViewPoll; 