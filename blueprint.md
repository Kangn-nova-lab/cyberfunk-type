# Blueprint: Cyberpunk Tetris

## Overview
This document outlines the plan and implemented features for the Cyberpunk Tetris project. It serves as a single source of truth for the application's design, functionality, and development history.

## Implemented Features

### Core Gameplay
- **Classic Tetris Mechanics:** Implemented standard Tetris gameplay where users can move and rotate falling tetrominoes.
- **Scoring System:** A scoring system that awards points for clearing lines. The score is displayed in real-time.
- **Next Piece Preview:** A designated area on the screen shows the next tetromino that will enter the game board, allowing the player to plan their moves.
- **Game Over and Restart:** The game ends when the blocks stack up to the top. The user is then presented with a leaderboard and an option to play again.

### User Interface & Design
- **Cyberpunk Aesthetic:** The user interface is designed with a futuristic, cyberpunk theme, utilizing a dark background, neon-glowing text, and a retro-futuristic font (`Orbitron`).
- **Responsive Layout:** The application is designed to be responsive and functional on both desktop and mobile devices.
- **Screen Management:** The application is structured into multiple screens (Intro, Game, Leaderboard, Partnership) that are shown or hidden based on the user's interaction.

### Features
- **Player Name Entry:** Users can enter their name on the intro screen, which is then used for the leaderboard.
- **Local Storage Leaderboard:** High scores are saved to the browser's local storage and displayed on a leaderboard screen.
- **Partnership Inquiry Form:** A fully functional partnership inquiry form is integrated, which uses Formspree to handle submissions.
- **Disqus Integration:** A comment section using Disqus is included on the leaderboard screen to foster community engagement.

## Current Plan

**Objective:** Fix deployment issues and align the project with the correct GitHub repository and deployment target.

**Steps:**
1.  **Update Project Documentation:** The `README.md` and `blueprint.md` files have been updated to accurately reflect the current state of the Cyberpunk Tetris game.
2.  **Force Push to Repository:** The local project files will be forcibly pushed to the `main` branch of the `https://github.com/Kangn-nova-lab/cyberfunk-type` repository to ensure the remote repository is in sync with the local version.
3.  **Verify Deployment:** After the push, the GitHub Actions workflow for GitHub Pages will be monitored to ensure a successful deployment.
4.  **Confirm and Communicate:** Once the deployment is successful, the user will be notified with the correct deployment URL.
