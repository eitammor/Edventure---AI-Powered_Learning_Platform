# Setup Guide - AI Exercise Generator

This guide will help you set up and run the AI-powered exercise generator project.

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **OpenAI API key** (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

## Step-by-Step Setup

### 1. Clone and Navigate to Project
```bash
# If you're starting from scratch, create the project directory
mkdir exercise-generator
cd exercise-generator
```

### 2. Setup Backend (Server)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp ../env.example .env

# Edit the .env file and add your OpenAI API key
# Replace 'your_openai_api_key_here' with your actual API key
```

**Important**: Edit the `.env` file in the server directory and replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Setup Frontend (Client)

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

### 4. Run the Application

You'll need to run both the backend and frontend simultaneously.

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

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Testing the Application

1. **Open your browser** and go to `http://localhost:3000`
2. **Enter a topic** (e.g., "JavaScript", "World History", "Machine Learning")
3. **Optionally add a subtopic** (e.g., "Promises", "Renaissance", "Neural Networks")
4. **Click "Generate Exercises"**
5. **Select a difficulty level** (Beginner, Intermediate, or Expert)
6. **Answer all 10 questions**
7. **Submit to see your results and explanations**
8. **Try the language toggle** to switch between English and Hebrew

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Make sure the backend is running on port 5000
- Check that the frontend proxy is set correctly in `client/package.json`

**2. OpenAI API Errors**
- Verify your API key is correct in the server `.env` file
- Check that you have credits in your OpenAI account
- Ensure the API key has the necessary permissions

**3. Port Already in Use**
- If port 5000 is busy, change the PORT in server `.env`
- If port 3000 is busy, React will automatically suggest an alternative

**4. Module Not Found Errors**
- Run `npm install` in both server and client directories
- Clear node_modules and reinstall if necessary

### Debug Mode

To enable detailed logging, add to your server `.env`:
```env
DEBUG=true
```

## Project Structure

```
exercise-generator/
├── server/                 # Express backend
│   ├── routes/
│   │   └── exercises.js    # API routes
│   ├── services/
│   │   └── openaiService.js # OpenAI integration
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html     # Main HTML file
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── translations/  # i18n support
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styles
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── env.example            # Environment template
├── README.md              # Project documentation
└── setup.md              # This setup guide
```

## Features to Test

✅ **Core Features**
- Generate exercises for any topic
- Three difficulty levels
- Interactive quiz interface
- Score calculation
- Detailed explanations

✅ **Bonus Features**
- English/Hebrew language toggle
- Progress tracking
- Local storage persistence
- Responsive design
- Score history

## Next Steps

Once the application is running successfully:

1. **Test with different topics** to see the AI's capabilities
2. **Try the Hebrew language** to test RTL support
3. **Check the browser console** for any errors
4. **Review the code structure** to understand the architecture
5. **Consider improvements** like adding more question types or user accounts

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both servers are running on the correct ports

Happy coding! 🚀
