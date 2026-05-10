# Blueprint: Tetris Game

## Overview

A classic Tetris game built with modern, framework-less web technologies. The game features a cyberpunk aesthetic, responsive design, an intro screen for player name entry, and a persistent leaderboard.

## Core Features

*   **Intro Screen:** Players enter their name to start. The game begins on button click or by pressing Enter.
*   **Standard Tetris Gameplay:** Blocks fall, and players move/rotate them to complete lines.
*   **Scoring & Levels:** Points are awarded for clearing lines, and the game speed increases with the score.
*   **Next Piece Preview:** A display shows the upcoming tetromino.
*   **Game Over:** The game ends when blocks stack to the top.
*   **Leaderboard Screen:** After the game, a screen displays the top scores, which are saved locally.
*   **Responsive Design:** The layout adapts for both desktop and mobile play.

## Implementation Plan

1.  **Update `index.html` Structure:**
    *   Create an `intro-screen` with a text input (`player-name`) and a start button.
    *   Wrap the existing game elements in a `game-screen`.
    *   Create a `leaderboard-screen` with a table and a "Play Again" button.
    *   Make these screens switchable.

2.  **Update `style.css`:**
    *   Add styles for the `intro-screen` and `leaderboard-screen` to match the cyberpunk theme.
    *   Use a generic `.screen` class to manage visibility.

3.  **Rewrite `main.js` Logic:**
    *   **Screen Management:** Implement a function to show the active screen and hide others.
    *   **Game Flow:**
        *   Start on the intro screen.
        *   On start, capture the player name and switch to the game screen.
        *   On game over, save the score with the player name to `localStorage`.
        *   Switch to the leaderboard screen and display the updated scores.
    *   **Event Handling:**
        *   Add a `click` listener to the start button.
        *   Add a `keydown` listener to the name input to handle the `Enter` key.
        *   Add a `click` listener to the "Play Again" button to return to the intro screen.
    *   **Leaderboard:**
        *   Implement `saveScore`, `getScores`, and `displayLeaderboard` functions to manage the leaderboard data in `localStorage`.