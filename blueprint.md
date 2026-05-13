# Blueprint: Tetris Game

## Overview

A classic Tetris game built with modern, framework-less web technologies. The game features a cyberpunk aesthetic, responsive design, an intro screen for player name entry, and a persistent leaderboard.

## Core Features

*   **Intro Screen:** Players enter their name to start. Includes a "Partnership Inquiry" button.
*   **Standard Tetris Gameplay:** Blocks fall, and players move/rotate them to complete lines.
*   **Scoring & Levels:** Points are awarded for clearing lines, and the game speed increases with the score.
*   **Next Piece Preview:** A display shows the upcoming tetromino.
*   **Game Over:** The game ends when blocks stack to the top.
*   **Leaderboard Screen:** Displays the top scores saved locally.
*   **Partnership Inquiry Form:** A modern, integrated form that allows users to send partnership requests via Formspree.

## Implementation Plan

1.  **Update `index.html` Structure:**
    *   Add "Partnership" button to `intro-screen`.
    *   Add `partnership-screen` with a Formspree form (`https://formspree.io/f/mqenjlzg`).
    *   Ensure all screens have appropriate IDs for switching.

2.  **Update `style.css`:**
    *   Style the `partnership-screen` and the form.
    *   Ensure consistency with the cyberpunk/premium theme.

3.  **Update `main.js` Logic:**
    *   Add event listeners for the "Partnership" and "Back to Home" buttons.
    *   Handle Formspree submission using `fetch` to prevent page reloads.
    *   Integrate screen switching logic.