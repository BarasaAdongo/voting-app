# Voting App

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for creating and participating in polls.

## Features

- Create polls with multiple options
- Vote on existing polls
- Real-time results with progress bars
- Responsive Material-UI design
- RESTful API backend

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voting-app
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Configuration

1. Create a `.env` file in the server directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voting-app
```

## Running the Application

1. Start the MongoDB service on your machine

2. Start the server:
```bash
cd server
npm start
```

3. In a new terminal, start the client:
```bash
cd client
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls/:id/vote` - Vote on a specific poll

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 