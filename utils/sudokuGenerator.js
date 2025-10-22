class SudokuGenerator {
    constructor() {
        this.size = 9;
        this.boxSize = 3;
    }

    // Generate a complete valid Sudoku board
    generateCompleteBoard() {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        this.fillBoard(board);
        return board;
    }

    // Fill the board using backtracking
    fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of numbers) {
                        if (this.isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.fillBoard(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Generate a puzzle by removing numbers from a complete board
    generatePuzzle(difficulty = 'medium') {
        const completeBoard = this.generateCompleteBoard();
        const puzzle = completeBoard.map(row => [...row]);

        const cellsToRemove = this.getDifficultyLevel(difficulty);
        let removed = 0;

        // For harder difficulties, skip the expensive unique solution check
        // to speed up generation
        const checkUniqueness = difficulty === 'easy' || difficulty === 'medium';

        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                const backup = puzzle[row][col];
                puzzle[row][col] = 0;

                // For easy/medium, ensure unique solution. For hard/expert, skip this check
                if (!checkUniqueness) {
                    removed++;
                } else if (this.hasUniqueSolution(puzzle)) {
                    removed++;
                } else {
                    puzzle[row][col] = backup;
                }
            }
        }

        return {
            puzzle,
            solution: completeBoard,
            difficulty
        };
    }

    // Check if a move is valid
    isValidMove(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    // Solve sudoku using backtracking
    solveSudoku(board) {
        const solution = board.map(row => [...row]);
        this.solve(solution);
        return solution;
    }

    solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Check if the current board state is valid
    isValidBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] !== 0) {
                    const num = board[row][col];
                    board[row][col] = 0;
                    if (!this.isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        return false;
                    }
                    board[row][col] = num;
                }
            }
        }
        return true;
    }

    // Check if the puzzle is completely solved
    isSolved(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return false;
            }
        }
        return this.isValidBoard(board);
    }

    // Get hint for the next move
    getHint(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMove(board, row, col, num)) {
                            return { row, col, value: num };
                        }
                    }
                }
            }
        }
        return null;
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getDifficultyLevel(difficulty) {
        const levels = {
            easy: 35,
            medium: 45,
            hard: 55,
            expert: 65
        };
        return levels[difficulty] || levels.medium;
    }

    hasUniqueSolution(board) {
        const solutions = [];
        this.findAllSolutions(board.map(row => [...row]), solutions, 2);
        return solutions.length === 1;
    }

    findAllSolutions(board, solutions, maxSolutions) {
        if (solutions.length >= maxSolutions) return;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            this.findAllSolutions(board, solutions, maxSolutions);
                            board[row][col] = 0;
                        }
                    }
                    return;
                }
            }
        }
        solutions.push(board.map(row => [...row]));
    }
}

module.exports = SudokuGenerator;