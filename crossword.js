// Crossword Puzzle Configuration
// Customize the words and hints here!

const CROSSWORD_CONFIG = {
    // Grid size (rows x cols)
    rows: 7,
    cols: 7,

    // Words to place in the crossword
    // Format: { word: "WORD", clue: "Hint text", direction: "across" or "down", row: 0, col: 0 }
    words: [
        { word: "YOYOMA", clue: "Who rules?", direction: "across", row: 0, col: 0 },
        { word: "HAPPY", clue: "Feeling joyful", direction: "down", row: 0, col: 2 },
        { word: "DAY", clue: "24 hours", direction: "across", row: 2, col: 0 },
        { word: "FRIEND", clue: "Someone you care about", direction: "down", row: 0, col: 4 },
        { word: "PARTY", clue: "A celebration", direction: "across", row: 4, col: 0 },
        { word: "CAKE", clue: "Sweet dessert", direction: "across", row: 6, col: 2 },
        { word: "GIFT", clue: "Something given", direction: "down", row: 2, col: 6 },
        { word: "LOVE", clue: "Deep affection", direction: "down", row: 1, col: 0 },
        { word: "SMILE", clue: "Happy expression", direction: "down", row: 2, col: 2 },
        { word: "JOY", clue: "Great happiness", direction: "across", row: 4, col: 2 },
        { word: "BIRTH", clue: "The day you were born", direction: "down", row: 0, col: 6 }
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
        this.currentWord = null;

        this.initGrid();
        this.placeWords();
        this.setDate();
        this.render();
    }

    setDate() {
        const dateElement = document.getElementById('crossword-date');
        if (dateElement) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
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
        const cellNumbers = new Map(); // Track which number is assigned to each starting cell

        this.config.words.forEach((wordData, index) => {
            const { word, clue, direction, row, col } = wordData;
            const wordId = `word-${index}`;
            const startKey = `${row},${col}`;

            // Mark cells for this word
            for (let i = 0; i < word.length; i++) {
                const r = direction === "across" ? row : row + i;
                const c = direction === "across" ? col + i : col;

                if (r >= 0 && r < this.config.rows && c >= 0 && c < this.config.cols) {
                    if (i === 0) {
                        // Starting cell - assign number if not already assigned
                        if (!cellNumbers.has(startKey)) {
                            cellNumbers.set(startKey, clueNumber++);
                        }
                        this.grid[r][c].number = cellNumbers.get(startKey);
                    }
                    this.grid[r][c].blocked = false;
                    this.grid[r][c].letter = word[i];
                    this.grid[r][c].words.push(wordId);
                }
            }

            // Store word info with its number
            const wordNumber = cellNumbers.get(startKey);
            this.wordMap.set(wordId, {
                word: word.toUpperCase(),
                clue: clue,
                direction: direction,
                number: wordNumber,
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
                    cell.addEventListener('focus', () => this.handleCellFocus(i, j));
                    cell.addEventListener('blur', () => this.clearHighlighting());
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

        // Group words by direction and sort by number
        const acrossWords = [];
        const downWords = [];

        this.config.words.forEach((wordData, index) => {
            const wordId = `word-${index}`;
            const wordInfo = this.wordMap.get(wordId);
            if (wordData.direction === 'across') {
                acrossWords.push({ wordId, wordInfo, wordData });
            } else {
                downWords.push({ wordId, wordInfo, wordData });
            }
        });

        // Sort by number
        acrossWords.sort((a, b) => a.wordInfo.number - b.wordInfo.number);
        downWords.sort((a, b) => a.wordInfo.number - b.wordInfo.number);

        // Render across clues
        acrossWords.forEach(({ wordId, wordInfo }) => {
            const hintItem = document.createElement('div');
            hintItem.className = 'hint-item';
            hintItem.id = `hint-${wordId}`;

            const number = document.createElement('span');
            number.className = 'hint-number';
            number.textContent = `${wordInfo.number}. `;
            hintItem.appendChild(number);

            const text = document.createTextNode(wordInfo.clue);
            hintItem.appendChild(text);

            hintItem.addEventListener('click', () => this.focusWord(wordId));
            across.appendChild(hintItem);
        });

        // Render down clues
        downWords.forEach(({ wordId, wordInfo }) => {
            const hintItem = document.createElement('div');
            hintItem.className = 'hint-item';
            hintItem.id = `hint-${wordId}`;

            const number = document.createElement('span');
            number.className = 'hint-number';
            number.textContent = `${wordInfo.number}. `;
            hintItem.appendChild(number);

            const text = document.createTextNode(wordInfo.clue);
            hintItem.appendChild(text);

            hintItem.addEventListener('click', () => this.focusWord(wordId));
            down.appendChild(hintItem);
        });

        hintsContainer.appendChild(across);
        hintsContainer.appendChild(down);
    }

    handleCellFocus(row, col) {
        this.currentCell = { row, col };
        const cellData = this.grid[row][col];

        // Find which word(s) this cell belongs to
        if (cellData.words.length > 0) {
            // If we have a current word preference, use it if it's in this cell
            if (this.currentWord && cellData.words.includes(this.currentWord)) {
                this.highlightWord(this.currentWord);
                this.updateSelectedClue(this.currentWord);
            } else {
                // Otherwise, prefer the word that matches the current direction
                // If no current word, default to first word
                const wordId = cellData.words[0];
                this.highlightWord(wordId);
                this.updateSelectedClue(wordId);
            }
        }
    }

    highlightWord(wordId) {
        this.clearHighlighting();
        this.currentWord = wordId;

        const wordInfo = this.wordMap.get(wordId);
        if (!wordInfo) return;

        wordInfo.cells.forEach((cellPos, index) => {
            const cell = this.cells[cellPos.row * this.config.cols + cellPos.col];
            if (cell && !cell.classList.contains('blocked')) {
                if (index === 0) {
                    cell.classList.add('highlighted-start');
                } else {
                    cell.classList.add('highlighted-word');
                }
            }
        });

        // Highlight clue
        const hintItem = document.getElementById(`hint-${wordId}`);
        if (hintItem) {
            hintItem.classList.add('active');
        }
    }

    clearHighlighting() {
        this.cells.forEach(cell => {
            cell.classList.remove('highlighted-start', 'highlighted-word');
        });

        document.querySelectorAll('.hint-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    updateSelectedClue(wordId) {
        const selectedClueEl = document.getElementById('selected-clue');
        const wordInfo = this.wordMap.get(wordId);
        if (selectedClueEl && wordInfo) {
            const wordData = this.config.words.find((w, i) => `word-${i}` === wordId);
            const clueNum = this.getClueNumber(wordId);
            const direction = wordInfo.direction === 'across' ? 'A' : 'D';
            selectedClueEl.textContent = `${clueNum}${direction} ${wordInfo.clue}`;
        }
    }

    getClueNumber(wordId) {
        const wordInfo = this.wordMap.get(wordId);
        return wordInfo ? wordInfo.number : 1;
    }

    focusWord(wordId) {
        const wordInfo = this.wordMap.get(wordId);
        if (wordInfo && wordInfo.cells.length > 0) {
            // Set the current word before focusing, so handleCellFocus knows which word to highlight
            this.currentWord = wordId;
            this.highlightWord(wordId);
            this.updateSelectedClue(wordId);

            const firstCell = wordInfo.cells[0];
            const cell = this.cells[firstCell.row * this.config.cols + firstCell.col];
            if (cell) {
                cell.focus();
            }
        }
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

        // Maintain highlighting after input
        if (this.currentWord) {
            this.highlightWord(this.currentWord);
        }

        // Auto-advance to next cell in current word
        if (value && !this.grid[row][col].blocked && this.currentWord) {
            const wordInfo = this.wordMap.get(this.currentWord);
            if (wordInfo) {
                const currentIndex = wordInfo.cells.findIndex(c => c.row === row && c.col === col);
                if (currentIndex >= 0 && currentIndex < wordInfo.cells.length - 1) {
                    const nextCellPos = wordInfo.cells[currentIndex + 1];
                    const nextCell = this.cells[nextCellPos.row * this.config.cols + nextCellPos.col];
                    if (nextCell) {
                        nextCell.focus();
                    }
                }
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

        // Maintain highlighting after key navigation
        if (this.currentWord) {
            setTimeout(() => {
                this.highlightWord(this.currentWord);
            }, 0);
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
