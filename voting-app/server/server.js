const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Connection string:', process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-app');
})
.catch((err) => {
  console.log('MongoDB connection error:', err);
  process.exit(1); // Exit if MongoDB fails to connect
});

// Add connection error handler
mongoose.connection.on('error', err => {
  console.log('MongoDB connection error:', err);
});

// Poll Schema
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model('Poll', pollSchema);

// Routes
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      question,
      options: options.map(option => ({ text: option, votes: 0 }))
    });
    const savedPoll = await poll.save();
    res.status(201).json(savedPoll);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/polls/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    poll.options[optionIndex].votes += 1;
    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (error) {
    console.error('Error voting on poll:', error);
    res.status(400).json({ message: error.message });
  }
});

// Add DELETE endpoint with improved logging
app.delete('/api/polls/:id', async (req, res) => {
  try {
    console.log('Attempting to delete poll with ID:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid poll ID format');
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    const poll = await Poll.findByIdAndDelete(req.params.id);
    console.log('Delete result:', poll);
    
    if (!poll) {
      console.log('Poll not found for deletion');
      return res.status(404).json({ message: 'Poll not found' });
    }

    console.log('Poll deleted successfully');
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 