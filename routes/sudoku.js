const express = require('express');
const router = express.Router();
const SudokuGenerator = require('../utils/sudokuGenerator');

const sudokuGenerator = new SudokuGenerator();

// Generate a new puzzle
router.post('/generate', (req, res) => {
    try {
        const { difficulty = 'medium' } = req.body;
        const puzzleData = sudokuGenerator.generatePuzzle(difficulty);
        
        res.json({
            success: true,
            puzzle: puzzleData.puzzle,
            difficulty: puzzleData.difficulty,
            id: Date.now().toString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate puzzle'
        });
    }
});

// Validate a move
router.post('/validate', (req, res) => {
    try {
        const { board, row, col, value } = req.body;
        
        if (!board || row === undefined || col === undefined || !value) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }
        
        const isValid = sudokuGenerator.isValidMove(board, row, col, value);
        
        res.json({
            success: true,
            valid: isValid
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to validate move'
        });
    }
});

// Check if board is solved
router.post('/check-solved', (req, res) => {
    try {
        const { board } = req.body;
        
        if (!board) {
            return res.status(400).json({
                success: false,
                error: 'Board is required'
            });
        }
        
        const isSolved = sudokuGenerator.isSolved(board);
        const isValid = sudokuGenerator.isValidBoard(board);
        
        res.json({
            success: true,
            solved: isSolved,
            valid: isValid
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to check board'
        });
    }
});

// Get a hint
router.post('/hint', (req, res) => {
    try {
        const { board } = req.body;
        
        if (!board) {
            return res.status(400).json({
                success: false,
                error: 'Board is required'
            });
        }
        
        const hint = sudokuGenerator.getHint(board);
        
        res.json({
            success: true,
            hint: hint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get hint'
        });
    }
});

// Solve the puzzle
router.post('/solve', (req, res) => {
    try {
        const { board } = req.body;
        
        if (!board) {
            return res.status(400).json({
                success: false,
                error: 'Board is required'
            });
        }
        
        const solution = sudokuGenerator.solveSudoku(board);
        
        res.json({
            success: true,
            solution: solution
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to solve puzzle'
        });
    }
});

module.exports = router;