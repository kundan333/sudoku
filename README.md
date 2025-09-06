# 🧩 Sudoku Game - Node.js

A comprehensive Sudoku game built with Node.js, Express.js, and vanilla JavaScript. Features include puzzle generation, solving algorithms, multiple difficulty levels, and an interactive web interface.

## 🚀 Features

- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Smart Puzzle Generation**: Ensures unique solutions using backtracking algorithms
- **Interactive Web Interface**: Click or use keyboard to play
- **Real-time Validation**: Instant feedback on moves
- **Hint System**: Get hints when stuck
- **Auto-solver**: Solve puzzles automatically
- **Timer**: Track your solving time
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Algorithms**: Backtracking for puzzle generation and solving
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for request logging

## 📦 Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## 🎮 Running the Game

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The game will be available at `http://localhost:3000`

## 🎯 How to Play

1. **Start a New Game**: Select difficulty and click "New Game"
2. **Make Moves**: 
   - Click on a cell to select it
   - Use number buttons or keyboard (1-9) to enter numbers
   - Use Backspace/Delete or "Erase" button to clear cells
3. **Navigation**: Use arrow keys to move between cells
4. **Get Help**: Use "Hint" button for assistance
5. **Validate**: Click "Check" to validate your current progress
6. **Auto-solve**: Click "Solve" to see the complete solution

## 🔧 API Endpoints

### Generate Puzzle
```http
POST /api/sudoku/generate
Content-Type: application/json

{
  "difficulty": "medium"
}
```

### Validate Move
```http
POST /api/sudoku/validate
Content-Type: application/json

{
  "board": [[...]],
  "row": 0,
  "col": 0,
  "value": 5
}
```

### Check if Solved
```http
POST /api/sudoku/check-solved
Content-Type: application/json

{
  "board": [[...]]
}
```

### Get Hint
```http
POST /api/sudoku/hint
Content-Type: application/json

{
  "board": [[...]]
}
```

### Solve Puzzle
```http
POST /api/sudoku/solve
Content-Type: application/json

{
  "board": [[...]]
}
```

## 🏗️ Project Structure

```
├── index.js                 # Main server file
├── package.json             # Dependencies and scripts
├── routes/
│   └── sudoku.js            # API routes for Sudoku operations
├── utils/
│   └── sudokuGenerator.js   # Core Sudoku algorithms
└── public/
    ├── index.html           # Main game interface
    ├── styles.css           # Game styling
    └── script.js            # Frontend game logic
```

## 🧮 Sudoku Algorithm

The game uses sophisticated backtracking algorithms:

1. **Generation**: Creates a complete valid board, then removes numbers while ensuring unique solutions
2. **Validation**: Checks row, column, and 3×3 box constraints
3. **Solving**: Uses backtracking to find solutions
4. **Difficulty**: Controls the number of cells removed (Easy: 35, Medium: 45, Hard: 55, Expert: 65)

## 🎨 Game Controls

- **Mouse**: Click cells and buttons
- **Keyboard Numbers (1-9)**: Enter numbers
- **Arrow Keys**: Navigate between cells
- **Backspace/Delete**: Erase cell content
- **Enter**: Validate current board

## 🔒 Security Features

- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Input validation on all API endpoints
- Error handling with proper status codes

## 📱 Responsive Design

The game adapts to different screen sizes:
- Desktop: Full-featured interface
- Tablet: Optimized layout
- Mobile: Touch-friendly controls

## 🚀 Development

To contribute or modify the game:

1. Start development server: `npm run dev`
2. The server will auto-restart on file changes (using nodemon)
3. Open `http://localhost:3000` to test changes

## 🎯 Future Enhancements

- Save/load game progress
- Multiple puzzle themes
- Multiplayer mode
- Statistics tracking
- Custom puzzle import/export

## 📄 License

ISC License - Feel free to use and modify!

---

Enjoy playing Sudoku! 🎉