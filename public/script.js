class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.originalBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        
        this.initializeElements();
        this.bindEvents();
        this.createGrid();
    }

    initializeElements() {
        this.gridElement = document.getElementById('sudoku-grid');
        this.statusElement = document.getElementById('status');
        this.timerElement = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('new-game');
        this.solveBtn = document.getElementById('solve');
        this.hintBtn = document.getElementById('hint');
        this.validateBtn = document.getElementById('validate');
        this.eraseBtn = document.getElementById('erase');
        this.numberBtns = document.querySelectorAll('.number-btn');
    }

    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.solveBtn.addEventListener('click', () => this.solvePuzzle());
        this.hintBtn.addEventListener('click', () => this.getHint());
        this.validateBtn.addEventListener('click', () => this.validateBoard());
        this.eraseBtn.addEventListener('click', () => this.eraseCell());
        
        this.numberBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const number = parseInt(btn.dataset.number);
                this.enterNumber(number);
            });
        });

        document.addEventListener('keydown', (e) => this.handleKeypress(e));
    }

    createGrid() {
        this.gridElement.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                
                this.gridElement.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        // Remove previous selection
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected');
        });

        // Select new cell
        this.selectedCell = { row, col };
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cellElement.classList.add('selected');
    }

    async startNewGame() {
        try {
            this.statusElement.textContent = 'Generating puzzle...';
            const difficulty = this.difficultySelect.value;
            
            const response = await fetch('/api/sudoku/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ difficulty })
            });

            const data = await response.json();
            
            if (data.success) {
                this.board = data.puzzle;
                this.originalBoard = data.puzzle.map(row => [...row]);
                this.updateGrid();
                this.startTimer();
                this.statusElement.textContent = `New ${difficulty} puzzle loaded!`;
                this.gameStarted = true;
            } else {
                this.statusElement.textContent = 'Failed to generate puzzle';
            }
        } catch (error) {
            console.error('Error generating puzzle:', error);
            this.statusElement.textContent = 'Error generating puzzle';
        }
    }

    updateGrid() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.board[row][col];
            
            cell.textContent = value === 0 ? '' : value;
            cell.className = 'cell';
            
            if (this.originalBoard[row][col] !== 0) {
                cell.classList.add('given');
            }
        });
    }

    enterNumber(number) {
        if (!this.selectedCell || !this.gameStarted) return;
        
        const { row, col } = this.selectedCell;
        
        // Can't modify given numbers
        if (this.originalBoard[row][col] !== 0) return;
        
        this.board[row][col] = number;
        this.updateGrid();
        this.checkIfSolved();
    }

    eraseCell() {
        if (!this.selectedCell || !this.gameStarted) return;
        
        const { row, col } = this.selectedCell;
        
        // Can't modify given numbers
        if (this.originalBoard[row][col] !== 0) return;
        
        this.board[row][col] = 0;
        this.updateGrid();
    }

    async getHint() {
        if (!this.gameStarted) return;
        
        try {
            const response = await fetch('/api/sudoku/hint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ board: this.board })
            });

            const data = await response.json();
            
            if (data.success && data.hint) {
                const { row, col, value } = data.hint;
                this.board[row][col] = value;
                this.updateGrid();
                
                // Highlight the hint cell
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cellElement.classList.add('hint');
                
                setTimeout(() => {
                    cellElement.classList.remove('hint');
                }, 2000);
                
                this.statusElement.textContent = `Hint: Added ${value} at row ${row + 1}, col ${col + 1}`;
                this.checkIfSolved();
            } else {
                this.statusElement.textContent = 'No hints available';
            }
        } catch (error) {
            console.error('Error getting hint:', error);
            this.statusElement.textContent = 'Error getting hint';
        }
    }

    async solvePuzzle() {
        if (!this.gameStarted) return;
        
        try {
            const response = await fetch('/api/sudoku/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ board: this.board })
            });

            const data = await response.json();
            
            if (data.success) {
                this.board = data.solution;
                this.updateGrid();
                this.stopTimer();
                this.statusElement.textContent = 'Puzzle solved!';
                this.gameStarted = false;
            } else {
                this.statusElement.textContent = 'Could not solve puzzle';
            }
        } catch (error) {
            console.error('Error solving puzzle:', error);
            this.statusElement.textContent = 'Error solving puzzle';
        }
    }

    async validateBoard() {
        if (!this.gameStarted) return;
        
        try {
            const response = await fetch('/api/sudoku/check-solved', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ board: this.board })
            });

            const data = await response.json();
            
            if (data.success) {
                if (data.solved) {
                    this.statusElement.textContent = '🎉 Congratulations! Puzzle solved!';
                    this.stopTimer();
                    this.gameStarted = false;
                    this.gridElement.classList.add('solved');
                } else if (data.valid) {
                    this.statusElement.textContent = 'Board is valid but not complete';
                } else {
                    this.statusElement.textContent = 'Board has errors';
                }
            }
        } catch (error) {
            console.error('Error validating board:', error);
            this.statusElement.textContent = 'Error validating board';
        }
    }

    async checkIfSolved() {
        await this.validateBoard();
    }

    handleKeypress(e) {
        if (!this.selectedCell || !this.gameStarted) return;
        
        const key = e.key;
        
        if (key >= '1' && key <= '9') {
            this.enterNumber(parseInt(key));
        } else if (key === 'Backspace' || key === 'Delete') {
            this.eraseCell();
        } else if (key === 'ArrowUp' || key === 'ArrowDown' || 
                   key === 'ArrowLeft' || key === 'ArrowRight') {
            this.handleArrowKeys(key);
        }
    }

    handleArrowKeys(key) {
        const { row, col } = this.selectedCell;
        let newRow = row;
        let newCol = col;
        
        switch (key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(8, row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(8, col + 1);
                break;
        }
        
        this.selectCell(newRow, newCol);
    }

    startTimer() {
        this.timer = 0;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});