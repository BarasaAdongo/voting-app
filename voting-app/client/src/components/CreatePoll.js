import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/polls', {
        question,
        options: options.filter(opt => opt.trim()),
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Error creating poll. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Create New Poll
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
          />
          
          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
              {options.length > 2 && (
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddOption}
              sx={{
                borderRadius: 1,
                px: 3,
              }}
            >
              Add Option
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 1,
                px: 4,
              }}
            >
              Create Poll
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreatePoll; 