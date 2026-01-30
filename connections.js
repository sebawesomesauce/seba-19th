// Connections Game Configuration
// Customize the categories and words here!

const CONNECTIONS_CONFIG = {
    // Categories with their words and difficulty level
    // Difficulty: 1 = easiest (yellow), 2 = medium (green), 3 = hard (blue), 4 = hardest (purple)
    categories: [
        {
            name: "Category 1", // Replace with your category name
            words: ["WORD1", "WORD2", "WORD3", "WORD4"], // Replace with your words
            difficulty: 1
        },
        {
            name: "Category 2", // Replace with your category name
            words: ["WORD5", "WORD6", "WORD7", "WORD8"], // Replace with your words
            difficulty: 2
        },
        {
            name: "Category 3", // Replace with your category name
            words: ["WORD9", "WORD10", "WORD11", "WORD12"], // Replace with your words
            difficulty: 3
        },
        {
            name: "Category 4", // Replace with your category name
            words: ["WORD13", "WORD14", "WORD15", "WORD16"], // Replace with your words
            difficulty: 4
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

        this.init();
        this.render();
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
        this.renderWords();
        this.updateMistakes();
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
            selectedContainer.innerHTML = '<p class="select-hint">Select 4 words that belong together</p>';
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
            submitBtn.textContent = 'Submit';
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
            this.solvedCategories.add(category);
            this.selectedWords.clear();

            // Show success message
            this.showMessage(`Correct! Category: ${category}`, 'success');

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
                this.showMessage('Game Over! Too many mistakes.', 'error');
                // Reveal all categories
                setTimeout(() => {
                    this.revealAll();
                }, 2000);
            } else {
                this.showMessage('Not quite! Try again.', 'error');
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
        this.config.categories.forEach(category => {
            this.solvedCategories.add(category.name);
        });
        this.render();
        this.onComplete();
    }

    onComplete() {
        const gameContainer = document.getElementById('connections-game');
        const completeSection = document.getElementById('connections-complete');
        const categoriesRevealed = document.getElementById('categories-revealed');

        categoriesRevealed.innerHTML = '<h3>Categories:</h3>';

        // Sort categories by difficulty
        const sortedCategories = [...this.config.categories].sort((a, b) => a.difficulty - b.difficulty);
        const difficultyColors = ['#FFD700', '#90EE90', '#87CEEB', '#DDA0DD']; // Yellow, Green, Light Blue, Purple

        sortedCategories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-reveal';
            categoryDiv.style.borderLeftColor = difficultyColors[category.difficulty - 1];

            const categoryName = document.createElement('h4');
            categoryName.textContent = category.name;
            categoryDiv.appendChild(categoryName);

            const wordsList = document.createElement('div');
            wordsList.className = 'category-words';
            category.words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'category-word';
                wordSpan.textContent = word;
                wordsList.appendChild(wordSpan);
            });
            categoryDiv.appendChild(wordsList);

            categoriesRevealed.appendChild(categoryDiv);
        });

        gameContainer.style.display = 'none';
        completeSection.classList.remove('hidden');
        completeSection.classList.add('active');
    }
}

// Initialize connections game when the section becomes active
let connectionsGame;
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const nextSection = document.getElementById('next-section');
            if (nextSection && nextSection.classList.contains('active') && !connectionsGame) {
                connectionsGame = new ConnectionsGame(CONNECTIONS_CONFIG);
            }
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
        observer.observe(nextSection, { attributes: true });
    }
});
