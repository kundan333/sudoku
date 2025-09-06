<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sudoku Game Project Instructions

This is a Node.js Sudoku game project with the following structure:

## Architecture
- **Backend**: Express.js server with REST API endpoints for Sudoku operations
- **Frontend**: Vanilla JavaScript with HTML5 and CSS3
- **Core Logic**: Custom Sudoku generator and solver using backtracking algorithms

## Key Components
- `utils/sudokuGenerator.js`: Core Sudoku algorithms for generation, solving, and validation
- `routes/sudoku.js`: Express.js API routes for game operations
- `public/`: Frontend files (HTML, CSS, JavaScript)
- `index.js`: Main server file

## API Endpoints
- POST `/api/sudoku/generate` - Generate new puzzle with difficulty levels
- POST `/api/sudoku/validate` - Validate a move
- POST `/api/sudoku/check-solved` - Check if puzzle is solved
- POST `/api/sudoku/hint` - Get hint for next move
- POST `/api/sudoku/solve` - Solve the entire puzzle

## Development Guidelines
- Use ES6+ features and modern JavaScript practices
- Maintain separation between game logic and UI
- Follow RESTful API conventions
- Implement proper error handling for both client and server
- Use async/await for API calls
- Maintain responsive design principles

## Game Features
- Multiple difficulty levels (easy, medium, hard, expert)
- Real-time validation
- Timer functionality
- Hint system
- Keyboard and mouse controls
- Visual feedback for user actions