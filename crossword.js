// Crossword Puzzle Configuration
// Customize the words and hints here!

const CROSSWORD_CONFIG = {
    // Grid size (rows x cols)
    rows: 5,
    cols: 5,
    
    // Words to place in the crossword
    // Format: { word: "WORD", clue: "Hint text", direction: "across" or "down", row: 0, col: 0 }
    words: [
        { word: "BIRTH", clue: "The day you were born", direction: "across", row: 0, col: 0 },
        { word: "DAY", clue: "24 hours", direction: "across", row: 2, col: 0 },
        { word: "HAPPY", clue: "Feeling joyful", direction: "down", row: 0, col: 2 },
        { word: "FRIEND", clue: "Someone you care about", direction: "down", row: 0, col: 4 }
    ]
};

class Crossword {
    constructor(config) {
        this.config = config;
        this.grid = [];
        this.cells = [];
        this.wordMap = new Map();
        this.solvedWords = new Set();
        this.currentCell = null;
        
        this.initGrid();
        this.placeWords();
        this.render();
    }
    
    initGrid() {
        // Initialize empty grid
        for (let i = 0; i < this.config.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.config.cols; j++) {
                this.grid[i][j] = { letter: '', blocked: true, number: null, words: [] };
            }
        }
    }
    
    placeWords() {
        let clueNumber = 1;
        
        this.config.words.forEach((wordData, index) => {
            const { word, clue, direction, row, col } = wordData;
            const wordId = `word-${index}`;
            
            // Mark cells for this word
            for (let i = 0; i < word.length; i++) {
                const r = direction === "across" ? row : row + i;
                const c = direction === "across" ? col + i : col;
                
                if (r >= 0 && r < this.config.rows && c >= 0 && c < this.config.cols) {
                    if (this.grid[r][c].number === null && i === 0) {
                        this.grid[r][c].number = clueNumber++;
                    }
                    this.grid[r][c].blocked = false;
                    this.grid[r][c].letter = word[i];
                    this.grid[r][c].words.push(wordId);
                }
            }
            
            // Store word info
            this.wordMap.set(wordId, {
                word: word.toUpperCase(),
                clue: clue,
                direction: direction,
                cells: []
            });
            
            // Collect cell references
            for (let i = 0; i < word.length; i++) {
                const r = direction === "across" ? row : row + i;
                const c = direction === "across" ? col + i : col;
                if (r >= 0 && r < this.config.rows && c >= 0 && c < this.config.cols) {
                    this.wordMap.get(wordId).cells.push({ row: r, col: c });
                }
            }
        });
    }
    
    render() {
        const container = document.getElementById('crossword-container');
        container.style.gridTemplateColumns = `repeat(${this.config.cols}, 1fr)`;
        container.innerHTML = '';
        this.cells = [];
        
        // Create cells
        for (let i = 0; i < this.config.rows; i++) {
            for (let j = 0; j < this.config.cols; j++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.className = 'crossword-cell';
                
                const cellData = this.grid[i][j];
                
                if (cellData.blocked) {
                    cell.classList.add('blocked');
                    cell.disabled = true;
                } else {
                    if (cellData.number) {
                        cell.classList.add('numbered');
                        const number = document.createElement('span');
                        number.className = 'cell-number';
                        number.textContent = cellData.number;
                        cell.appendChild(number);
                    }
                    
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.dataset.expected = cellData.letter;
                    
                    cell.addEventListener('input', (e) => this.handleInput(e, i, j));
                    cell.addEventListener('keydown', (e) => this.handleKeyDown(e, i, j));
                    cell.addEventListener('focus', () => this.currentCell = { row: i, col: j });
                }
                
                container.appendChild(cell);
                this.cells.push(cell);
            }
        }
        
        this.renderHints();
    }
    
    renderHints() {
        const hintsContainer = document.getElementById('hints-container');
        hintsContainer.innerHTML = '';
        
        const across = document.createElement('div');
        across.className = 'hints-column';
        const acrossTitle = document.createElement('h3');
        acrossTitle.textContent = 'Across';
        across.appendChild(acrossTitle);
        
        const down = document.createElement('div');
        down.className = 'hints-column';
        const downTitle = document.createElement('h3');
        downTitle.textContent = 'Down';
        down.appendChild(downTitle);
        
        let clueNumber = 1;
        this.config.words.forEach((wordData, index) => {
            const wordId = `word-${index}`;
            const wordInfo = this.wordMap.get(wordId);
            const hintItem = document.createElement('div');
            hintItem.className = 'hint-item';
            hintItem.id = `hint-${wordId}`;
            
            const number = document.createElement('span');
            number.className = 'hint-number';
            number.textContent = `${clueNumber}. `;
            hintItem.appendChild(number);
            
            const text = document.createTextNode(wordInfo.clue);
            hintItem.appendChild(text);
            
            if (wordData.direction === 'across') {
                across.appendChild(hintItem);
            } else {
                down.appendChild(hintItem);
            }
            
            clueNumber++;
        });
        
        hintsContainer.appendChild(across);
        hintsContainer.appendChild(down);
    }
    
    handleInput(e, row, col) {
        const cell = e.target;
        const value = cell.value.toUpperCase();
        
        // Check if correct
        if (value === this.grid[row][col].letter) {
            cell.classList.add('correct');
            this.checkWord(row, col);
        } else {
            cell.classList.remove('correct');
        }
        
        // Auto-advance to next cell
        if (value && !this.grid[row][col].blocked) {
            const nextCell = this.getNextCell(row, col);
            if (nextCell) {
                nextCell.focus();
            }
        }
    }
    
    handleKeyDown(e, row, col) {
        if (e.key === 'Backspace' && !e.target.value) {
            const prevCell = this.getPrevCell(row, col);
            if (prevCell) {
                prevCell.focus();
                prevCell.value = '';
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
                   e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const direction = e.key.replace('Arrow', '').toLowerCase();
            const nextCell = this.getAdjacentCell(row, col, direction);
            if (nextCell) {
                nextCell.focus();
            }
        }
    }
    
    getNextCell(row, col) {
        // Try right first, then down
        if (col + 1 < this.config.cols && !this.grid[row][col + 1].blocked) {
            return this.cells[row * this.config.cols + col + 1];
        }
        if (row + 1 < this.config.rows && !this.grid[row + 1][col].blocked) {
            return this.cells[(row + 1) * this.config.cols + col];
        }
        return null;
    }
    
    getPrevCell(row, col) {
        // Try left first, then up
        if (col - 1 >= 0 && !this.grid[row][col - 1].blocked) {
            return this.cells[row * this.config.cols + col - 1];
        }
        if (row - 1 >= 0 && !this.grid[row - 1][col].blocked) {
            return this.cells[(row - 1) * this.config.cols + col];
        }
        return null;
    }
    
    getAdjacentCell(row, col, direction) {
        let newRow = row;
        let newCol = col;
        
        switch(direction) {
            case 'left': newCol--; break;
            case 'right': newCol++; break;
            case 'up': newRow--; break;
            case 'down': newRow++; break;
        }
        
        if (newRow >= 0 && newRow < this.config.rows && 
            newCol >= 0 && newCol < this.config.cols && 
            !this.grid[newRow][newCol].blocked) {
            return this.cells[newRow * this.config.cols + newCol];
        }
        return null;
    }
    
    checkWord(row, col) {
        const cellData = this.grid[row][col];
        
        cellData.words.forEach(wordId => {
            const wordInfo = this.wordMap.get(wordId);
            let allCorrect = true;
            
            wordInfo.cells.forEach(({ row: r, col: c }) => {
                const cell = this.cells[r * this.config.cols + c];
                if (cell.value.toUpperCase() !== this.grid[r][c].letter) {
                    allCorrect = false;
                }
            });
            
            if (allCorrect && !this.solvedWords.has(wordId)) {
                this.solvedWords.add(wordId);
                const hintItem = document.getElementById(`hint-${wordId}`);
                if (hintItem) {
                    hintItem.classList.add('solved');
                }
                
                // Check if all words are solved
                if (this.solvedWords.size === this.config.words.length) {
                    this.onComplete();
                }
            }
        });
    }
    
    onComplete() {
        const message = document.getElementById('message');
        message.textContent = '🎉 Congratulations! You solved it! 🎉';
        message.className = 'message success';
        
        setTimeout(() => {
            document.getElementById('crossword-section').classList.remove('active');
            document.getElementById('crossword-section').classList.add('hidden');
            document.getElementById('next-section').classList.remove('hidden');
            document.getElementById('next-section').classList.add('active');
        }, 2000);
    }
}

// Initialize crossword when page loads
let crossword;
window.addEventListener('DOMContentLoaded', () => {
    crossword = new Crossword(CROSSWORD_CONFIG);
});
