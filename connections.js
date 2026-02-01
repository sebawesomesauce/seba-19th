// Connections Game Configuration
// Customize the categories and words here!

const CONNECTIONS_CONFIG = {
    // Categories with their words and difficulty level
    // Difficulty: 1 = easiest (green), 2 = medium (yellow), 3 = hard (light blue), 4 = hardest (purple)
    categories: [
        {
            name: "outside",
            words: ["TAG", "SOCCER", "BASKETBALL", "PIGGYBACK"],
            difficulty: 2 // Yellow (easiest)
        },
        {
            name: "at the library",
            words: ["DANCE", "FIFA", "ITALIAN BRAINROT", "STUDY"],
            difficulty: 1 // Green
        },
        {
            name: "First word of media you like",
            words: ["ALMOST", "WEST", "GOOD", "LITTLE"],
            difficulty: 3 // Blue
        },
        {
            name: "At school",
            words: ["WORD MAFIA", "SCAVENGER HUNT", "ZUMBA", "ROCKLET"],
            difficulty: 4 // Purple (hardest)
        }
    ]
};

class ConnectionsGame {
    constructor(config) {
        this.config = config;
        this.selectedWords = new Set();
        this.solvedCategories = new Set();
        this.mistakes = 0;
        this.maxMistakes = 4;
        this.allWords = [];
        this.shuffledWords = [];
        this.solvedGroups = [];
        // Color order: Green (easiest), Yellow, Light Blue, Purple (hardest)
        this.difficultyColors = ['green', 'yellow', 'blue', 'purple'];

        this.setDate();
        this.init();
        this.render();
    }

    setDate() {
        const dateElement = document.getElementById('connections-date');
        if (dateElement) {
            const today = new Date();
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    init() {
        // Collect all words and shuffle them
        this.config.categories.forEach(category => {
            category.words.forEach(word => {
                this.allWords.push({
                    word: word,
                    category: category.name,
                    difficulty: category.difficulty
                });
            });
        });

        // Shuffle words
        this.shuffledWords = [...this.allWords].sort(() => Math.random() - 0.5);
    }

    render() {
        this.renderSolvedGroups();
        this.renderWords();
        this.updateMistakes();
    }

    renderSolvedGroups() {
        const container = document.getElementById('solved-groups');
        container.innerHTML = '';

        this.solvedGroups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = `solved-group ${group.color}`;

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'group-category';
            categoryDiv.textContent = group.category;
            groupDiv.appendChild(categoryDiv);

            const wordsDiv = document.createElement('div');
            wordsDiv.className = 'group-words';
            group.words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'group-word';
                wordSpan.textContent = word;
                wordsDiv.appendChild(wordSpan);
            });
            groupDiv.appendChild(wordsDiv);

            container.appendChild(groupDiv);
        });
    }

    renderWords() {
        const grid = document.getElementById('words-grid');
        grid.innerHTML = '';

        this.shuffledWords.forEach((wordData, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.textContent = wordData.word;
            wordElement.dataset.index = index;
            wordElement.dataset.category = wordData.category;
            wordElement.dataset.difficulty = wordData.difficulty;

            // Check if this category is already solved
            if (this.solvedCategories.has(wordData.category)) {
                wordElement.classList.add('solved');
                wordElement.style.opacity = '0.5';
            }

            wordElement.addEventListener('click', () => this.toggleWord(index));

            grid.appendChild(wordElement);
        });

        this.updateSelectedDisplay();
    }

    toggleWord(index) {
        const wordData = this.shuffledWords[index];

        // Don't allow selection of solved words
        if (this.solvedCategories.has(wordData.category)) {
            return;
        }

        if (this.selectedWords.has(index)) {
            this.selectedWords.delete(index);
        } else {
            if (this.selectedWords.size < 4) {
                this.selectedWords.add(index);
            }
        }

        this.updateSelectedDisplay();
        this.renderWords();
    }

    updateSelectedDisplay() {
        const selectedContainer = document.getElementById('selected-words');
        selectedContainer.innerHTML = '';

        if (this.selectedWords.size === 0) {
            selectedContainer.innerHTML = '<p class="select-hint">select 4 words that belong together</p>';
            return;
        }

        const selectedArray = Array.from(this.selectedWords);
        selectedArray.forEach(index => {
            const wordElement = document.createElement('div');
            wordElement.className = 'selected-word';
            wordElement.textContent = this.shuffledWords[index].word;
            wordElement.addEventListener('click', () => this.toggleWord(index));
            selectedContainer.appendChild(wordElement);
        });

        if (this.selectedWords.size === 4) {
            const submitBtn = document.createElement('button');
            submitBtn.className = 'submit-btn';
            submitBtn.textContent = 'submit';
            submitBtn.addEventListener('click', () => this.checkSelection());
            selectedContainer.appendChild(submitBtn);
        }
    }

    checkSelection() {
        if (this.selectedWords.size !== 4) {
            return;
        }

        const selectedArray = Array.from(this.selectedWords);
        const selectedWords = selectedArray.map(i => this.shuffledWords[i]);

        // Check if all selected words belong to the same category
        const categories = new Set(selectedWords.map(w => w.category));

        if (categories.size === 1) {
            // Correct! Mark category as solved
            const category = selectedWords[0].category;
            const categoryData = this.config.categories.find(c => c.name === category);
            this.solvedCategories.add(category);

            // Add to solved groups
            const colorIndex = categoryData.difficulty - 1;
            this.solvedGroups.push({
                category: category,
                words: selectedWords.map(w => w.word),
                color: this.difficultyColors[colorIndex]
            });

            this.selectedWords.clear();

            // Check if all categories are solved
            if (this.solvedCategories.size === this.config.categories.length) {
                this.onComplete();
            } else {
                this.render();
            }
        } else {
            // Wrong! Increment mistakes
            this.mistakes++;
            this.updateMistakes();

            if (this.mistakes >= this.maxMistakes) {
                this.showMessage('game over! too many mistakes.', 'error');
                // Reveal all categories
                setTimeout(() => {
                    this.revealAll();
                }, 2000);
            } else {
                this.showMessage('not quite! try again.', 'error');
                this.selectedWords.clear();
                this.updateSelectedDisplay();
            }
        }
    }

    updateMistakes() {
        const mistakesCount = document.getElementById('mistakes-count');
        mistakesCount.textContent = this.mistakes;

        // Update mistake indicators
        const container = document.getElementById('mistakes-container');
        container.innerHTML = '<div class="mistake-indicator">Mistakes: <span id="mistakes-count">' + this.mistakes + '</span>/4</div>';

        // Add visual mistake indicators
        for (let i = 0; i < this.maxMistakes; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'mistake-dot';
            if (i < this.mistakes) {
                indicator.classList.add('used');
            }
            container.appendChild(indicator);
        }
    }

    showMessage(text, type) {
        const message = document.getElementById('connections-message');
        message.textContent = text;
        message.className = `message ${type}`;

        setTimeout(() => {
            message.className = 'message';
        }, 3000);
    }

    revealAll() {
        // Add all remaining categories to solved groups
        this.config.categories.forEach(category => {
            if (!this.solvedCategories.has(category.name)) {
                this.solvedCategories.add(category.name);
                const colorIndex = category.difficulty - 1;
                this.solvedGroups.push({
                    category: category.name,
                    words: category.words,
                    color: this.difficultyColors[colorIndex]
                });
            }
        });
        this.render();
        this.onComplete();
    }

    onComplete() {
        const completeSection = document.getElementById('connections-complete');
        const viewResultsBtn = document.getElementById('view-results-btn');

        // Hide game elements
        document.getElementById('words-grid').style.display = 'none';
        document.getElementById('selected-words').style.display = 'none';
        document.getElementById('mistakes-container').style.display = 'none';
        document.getElementById('connections-instruction').style.display = 'none';

        // Show complete section
        completeSection.classList.remove('hidden');

        // Sort solved groups by difficulty (green, yellow, blue, purple)
        this.solvedGroups.sort((a, b) => {
            const aIndex = this.difficultyColors.indexOf(a.color);
            const bIndex = this.difficultyColors.indexOf(b.color);
            return aIndex - bIndex;
        });

        this.renderSolvedGroups();
    }
}

// Initialize connections game when the section becomes active
let connectionsGame;
