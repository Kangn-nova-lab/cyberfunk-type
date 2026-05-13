# Blueprint: Cyberpunk Tetris & Animal Face Test

## Overview
A multifunctional web application featuring a cyberpunk-themed Tetris game and an AI-powered "Animal Face Test" that classifies users as "Dog" or "Cat" using a Teachable Machine model.

## Core Features

### 1. Cyberpunk Tetris
- **Classic Gameplay:** Move and rotate falling blocks to clear lines.
- **Scoring & Levels:** Score tracking and increasing difficulty.
- **Next Piece Preview:** Visual preview of the upcoming block.
- **Leaderboard:** Persistent local storage leaderboard for high scores.

### 2. Animal Face Test (AI)
- **AI Classification:** Uses a Teachable Machine model to determine if a user looks more like a "Dog" or a "Cat".
- **Image Upload:** Supports drag-and-drop or file selection for photos.
- **Real-time Results:** Displays percentage matches with glowing progress bars.
- **Social Sharing:** Options to share results (simulated).

### 3. General Features
- **Cyberpunk UI:** Consistent neon-glow aesthetic across all screens.
- **Responsive Design:** Optimized for both desktop and mobile.
- **Partnership Form:** Integrated Formspree contact form.
- **Community:** Disqus comments for user interaction.

## Implementation Plan (Current Phase)

1.  **Add Animal Face Test UI:**
    *   Create a new `#animal-test-screen` in `index.html`.
    *   Include Teachable Machine Image Library scripts.
    *   Add file input and result display elements.

2.  **Style the AI Screen:**
    *   Design a "Scanner" effect for the image preview.
    *   Add glowing progress bars for result percentages.
    *   Ensure consistency with the existing CSS variables.

3.  **Integrate Teachable Machine Logic:**
    *   Load the model from the user-provided URL.
    *   Handle image upload and preprocessing.
    *   Run inference and update the UI with the results.
    *   Add navigation logic to switch to the AI screen from the home page.
