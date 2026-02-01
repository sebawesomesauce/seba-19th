// Escape Room Configuration
// Customize the clues here!

const ESCAPE_ROOM_CONFIG = {
    clues: [
        {
            id: 1,
            clue: "I'm the first letter of the alphabet, but also the start of something special today.",
            answer: "a",
            hint: "Think about what day it is...",
            nextClue: 2
        },
        {
            id: 2,
            clue: "I come after 18, but before 20. How old are you turning?",
            answer: "nineteen",
            hint: "It's your birthday!",
            nextClue: 3
        },
        {
            id: 3,
            clue: "I'm a celebration with candles, cake, and friends. What am I?",
            answer: "party",
            hint: "You blow out candles on this!",
            nextClue: 4
        },
        {
            id: 4,
            clue: "I'm the opposite of sad, and you should feel this way today!",
            answer: "happy",
            hint: "It's a feeling!",
            nextClue: 5
        },
        {
            id: 5,
            clue: "I'm a special day that comes once a year. What day is it?",
            answer: "birthday",
            hint: "You celebrate this day!",
            nextClue: null // Final clue
        }
    ],
    finalMessage: "🎉 happy 19th birthday! you've successfully escaped! 🎉"
};

class EscapeRoom {
    constructor(config) {
        this.config = config;
        this.currentClueIndex = 0;
        this.solvedClues = [];
        this.isComplete = false;
    }

    start() {
        this.currentClueIndex = 0;
        this.solvedClues = [];
        this.isComplete = false;
        this.showClue(0);
        this.updateSolvedClues();
    }

    showClue(index) {
        if (index >= this.config.clues.length) {
            this.complete();
            return;
        }

        const clue = this.config.clues[index];
        const clueDisplay = document.getElementById('clue-display');
        const messageEl = document.getElementById('escape-room-message');
        
        clueDisplay.innerHTML = `
            <div class="clue-text">${clue.clue}</div>
            <div class="clue-hint">💡 ${clue.hint}</div>
        `;
        
        messageEl.textContent = '';
        messageEl.className = 'message';
    }

    submitAnswer(userAnswer) {
        if (this.isComplete) return;

        const currentClue = this.config.clues[this.currentClueIndex];
        const messageEl = document.getElementById('escape-room-message');

        // Check if answer is correct (case-insensitive, flexible matching)
        const normalizedUserAnswer = userAnswer.toLowerCase().trim();
        const normalizedCorrectAnswer = currentClue.answer.toLowerCase().trim();

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
            // Correct answer!
            this.solvedClues.push({
                clue: currentClue.clue,
                answer: currentClue.answer
            });
            this.updateSolvedClues();

            messageEl.textContent = '✅ Correct! Moving to next clue...';
            messageEl.className = 'message success';

            // Move to next clue
            if (currentClue.nextClue !== null) {
                this.currentClueIndex = currentClue.nextClue - 1; // Convert to 0-based index
                setTimeout(() => {
                    this.showClue(this.currentClueIndex);
                }, 1500);
            } else {
                // This was the final clue
                setTimeout(() => {
                    this.complete();
                }, 1500);
            }
        } else {
            // Wrong answer
            messageEl.textContent = '❌ Incorrect. Try again!';
            messageEl.className = 'message error';
        }
    }

    updateSolvedClues() {
        const solvedList = document.getElementById('solved-clues-list');
        solvedList.innerHTML = '';

        if (this.solvedClues.length === 0) {
            solvedList.innerHTML = '<p style="color: #666; font-style: italic;">No clues solved yet.</p>';
            return;
        }

        this.solvedClues.forEach((solved, index) => {
            const clueItem = document.createElement('div');
            clueItem.className = 'solved-clue-item';
            clueItem.innerHTML = `
                <div class="solved-clue-number">Clue ${index + 1}:</div>
                <div class="solved-clue-answer">${solved.answer.toUpperCase()}</div>
            `;
            solvedList.appendChild(clueItem);
        });
    }

    complete() {
        this.isComplete = true;
        const content = document.getElementById('escape-room-content');
        const complete = document.getElementById('escape-room-complete');
        const finalMessage = document.getElementById('final-message');
        
        content.classList.add('hidden');
        complete.classList.remove('hidden');
        finalMessage.textContent = this.config.finalMessage;
    }
}

// Initialize escape room when page loads
let escapeRoom;
window.addEventListener('DOMContentLoaded', () => {
    escapeRoom = new EscapeRoom(ESCAPE_ROOM_CONFIG);
});
