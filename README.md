# Seba 19th Birthday Website 🎉

A fun birthday website featuring a crossword puzzle and NYT Connections-style game!

## Features

- 🧩 Mini Crossword Puzzle
- 🔗 Connections Game (NYT-style)
- 💙 Beautiful light blue theme

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Or deploy to GitHub Pages (see below)

## Customization

### Crossword Puzzle

Edit `crossword.js` and modify the `CROSSWORD_CONFIG` object:

```javascript
const CROSSWORD_CONFIG = {
    rows: 5,
    cols: 5,
    words: [
        { word: "BIRTH", clue: "Your clue here", direction: "across", row: 0, col: 0 },
        // Add more words...
    ]
};
```

### Connections Game

Edit `connections.js` and modify the `CONNECTIONS_CONFIG` object:

```javascript
const CONNECTIONS_CONFIG = {
    categories: [
        {
            name: "Your Category Name",
            words: ["WORD1", "WORD2", "WORD3", "WORD4"],
            difficulty: 1  // 1-4 (easiest to hardest)
        },
        // Add 3 more categories...
    ]
};
```

## Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select your branch (usually `main` or `master`)
4. Select `/ (root)` as the source
5. Your site will be live at `https://[username].github.io/seba-19th/`

## Local Development

Simply open `index.html` in your web browser - no server needed!
