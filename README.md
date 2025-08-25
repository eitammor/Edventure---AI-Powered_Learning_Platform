# Edventure - AI-Powered Learning Platform

An interactive web application that generates educational exercises using OpenAI's GPT API. Users can create exercises, take exams, and track their learning progress with a comprehensive dashboard.

## Features

✅ **Core Features**
- **Home Page**: Clean landing page with language selection
- **Exercise Generation**: Generate exercises for any topic with optional subtopic
- **Three Difficulty Levels**: Beginner, Intermediate, Expert
- **Interactive Quiz Interface**: Multiple-choice questions with answer selection
- **Exam Mode**: Create and take topic-based exams with timer
- **Learning Dashboard**: Track progress and view exercise history
- **Score Calculation**: Detailed results with explanations
- **Responsive Design**: Works on all devices

✅ **Advanced Features**
- **English/Hebrew Language Support**: Full internationalization
- **Exercise History**: Save and review completed exercises
- **Exam Management**: Create topic-based exams with unique question sets
- **Progress Tracking**: Visual progress indicators and statistics
- **Local Storage**: Persistent data storage for exercises and exams
- **Navigation System**: Seamless navigation between different modes

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Express.js, Node.js
- **AI Integration**: OpenAI API (GPT-3.5/GPT-4)
- **Storage**: LocalStorage for client-side persistence
- **Styling**: Tailwind CSS with custom animations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Edventure_Home_assignment
```

### Step 2: Setup Backend
```bash
cd server
npm install

# Create .env file
cp ../env.example .env
# Edit .env and add your OpenAI API key
```

### Step 3: Setup Frontend
```bash
cd ../client
npm install
```

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
Edventure_Home_assignment/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ExerciseGenerator.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExamRunner.jsx
│   │   │   └── ...
│   │   ├── services/      # API services
│   │   ├── translations/  # i18n support
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── services/          # OpenAI integration
│   └── server.js          # Express server
├── setup.md               # Detailed setup instructions
└── README.md
```

## Key Features Explained

### Home Page
- Clean, modern landing page
- Language selection (English/Hebrew)
- Direct access to learning platform

### Exercise Generator
- Input any topic and subtopic
- Generate 10 questions per difficulty level
- Interactive answer selection
- Immediate feedback and explanations

### Exam Mode
- Create topic-based exams from exercise history
- Timer-based exams with automatic submission
- Unique question sets for each exam
- Comprehensive results display

### Learning Dashboard
- View exercise history and progress
- Access completed exercises
- Track learning statistics
- Quick access to exam creation

## Architecture Decisions

### Frontend Architecture
- **Component-based structure**: Modular components for reusability
- **State management**: React hooks for local state
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS for responsive design

### Backend Architecture
- **RESTful API**: Express.js with structured routes
- **AI Integration**: OpenAI API for exercise generation
- **Error handling**: Comprehensive error management

### Data Persistence
- **LocalStorage**: Client-side storage for exercises and exams
- **Session management**: Maintains user progress across sessions

## Recent Updates

- ✅ **Fixed navigation pill bug**: Answer selection no longer affects wrong navigation pills
- ✅ **Added home page**: Clean landing page with language selection
- ✅ **Improved exam functionality**: Better question ID management and results display
- ✅ **Enhanced user experience**: Seamless navigation between different modes
