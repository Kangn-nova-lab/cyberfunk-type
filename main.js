document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const leaderboardScreen = document.getElementById('leaderboard-screen');
    const partnershipScreen = document.getElementById('partnership-screen');
    const disqusContainer = document.getElementById('disqus-container');
    const playerNameInput = document.getElementById('player-name');
    const startGameButton = document.getElementById('start-game');
    const playAgainButton = document.getElementById('play-again');
    const openPartnershipButton = document.getElementById('open-partnership');
    const backToHomeButton = document.getElementById('back-to-home');
    const partnershipForm = document.getElementById('partnership-form');
    const formStatus = document.getElementById('form-status');
    const canvas = document.getElementById('tetris-board');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next-piece');
    const nextContext = nextCanvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const NEXT_BLOCK_SIZE = 30;
    const COLORS = [null, '#ff00ff', '#ffff00', '#00ffff', '#0000ff', '#ffa500', '#00ff00', '#ff0000'];
    const TETROMINOES = [[], [[1, 1, 1], [0, 1, 0]], [[1, 1], [1, 1]], [[1, 1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]]];

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;
    let playerName = '';
    let piece, nextPiece;
    let lastTime = 0;
    let dropCounter = 0;
    let dropInterval = 1000;
    let gameLoopId;

    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');

        if (screen === leaderboardScreen) {
            disqusContainer.style.display = 'block';
        } else {
            disqusContainer.style.display = 'none';
        }

        if (screen === partnershipScreen) {
            formStatus.textContent = '';
            formStatus.className = '';
        }
    }

    function drawSquare(ctx, x, y, color, blockSize) {
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = '#0d0d0d';
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    function draw() {
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                drawSquare(context, x, y, COLORS[value] || '#000', BLOCK_SIZE);
            });
        });
        if (piece) {
            piece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) drawSquare(context, piece.x + x, piece.y + y, COLORS[piece.type], BLOCK_SIZE);
                });
            });
        }
        nextContext.fillStyle = '#000';
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        if (nextPiece) {
            const x_offset = (nextCanvas.width - nextPiece.matrix[0].length * NEXT_BLOCK_SIZE) / 2;
            const y_offset = (nextCanvas.height - nextPiece.matrix.length * NEXT_BLOCK_SIZE) / 2;
            nextPiece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) drawSquare(nextContext, x + x_offset / NEXT_BLOCK_SIZE, y + y_offset / NEXT_BLOCK_SIZE, COLORS[nextPiece.type], NEXT_BLOCK_SIZE);
                });
            });
        }
    }

    function playerReset() {
        const type = Math.floor(Math.random() * (TETROMINOES.length - 1)) + 1;
        piece = { matrix: TETROMINOES[type], type: type, x: Math.floor(COLS / 2) - Math.floor(TETROMINOES[type][0].length / 2), y: 0 };
        if (collide(piece)) endGame();
        const nextType = Math.floor(Math.random() * (TETROMINOES.length - 1)) + 1;
        nextPiece = { matrix: TETROMINOES[nextType], type: nextType };
    }

    function playerDrop() {
        piece.y++;
        if (collide(piece)) {
            piece.y--;
            merge();
            playerReset();
            sweep();
        }
        dropCounter = 0;
    }

    function playerMove(dir) {
        if (!piece) return;
        piece.x += dir;
        if (collide(piece)) piece.x -= dir;
    }

    function playerRotate() {
        if (!piece) return;
        const originalMatrix = piece.matrix;
        const rotated = [];
        for (let i = 0; i < originalMatrix[0].length; i++) {
            const newRow = [];
            for (let j = originalMatrix.length - 1; j >= 0; j--) newRow.push(originalMatrix[j][i]);
            rotated.push(newRow);
        }
        piece.matrix = rotated;
        if (collide(piece)) piece.matrix = originalMatrix;
    }

    function collide(p) {
        for (let y = 0; y < p.matrix.length; y++) {
            for (let x = 0; x < p.matrix[y].length; x++) {
                if (p.matrix[y][x] && (board[p.y + y] && board[p.y + y][p.x + x]) !== 0) return true;
            }
        }
        return false;
    }

    function merge() {
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) board[piece.y + y][piece.x + x] = piece.type;
            });
        });
    }

    function sweep() {
        let clearedLines = 0;
        outer: for (let y = ROWS - 1; y > 0; y--) {
            for (let x = 0; x < COLS; x++) if (board[y][x] === 0) continue outer;
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            y++;
            clearedLines++;
        }
        if (clearedLines > 0) {
            score += clearedLines * 10;
            dropInterval -= 50 * clearedLines;
        }
        scoreDisplay.textContent = score;
    }

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) playerDrop();
        draw();
        gameLoopId = requestAnimationFrame(update);
    }

    function startGame() {
        playerName = playerNameInput.value || 'Anonymous';
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        score = 0;
        scoreDisplay.textContent = score;
        dropInterval = 1000;
        playerReset();
        showScreen(gameScreen);
        update();
    }

    function endGame() {
        cancelAnimationFrame(gameLoopId);
        saveScore(playerName, score);
        displayLeaderboard();
        showScreen(leaderboardScreen);
    }

    function saveScore(name, score) {
        const scores = getScores();
        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(scores.slice(0, 10)));
    }

    function getScores() { return JSON.parse(localStorage.getItem('leaderboard')) || []; }

    function displayLeaderboard() {
        const scores = getScores();
        leaderboardTableBody.innerHTML = '';
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${score.name}</td><td>${score.score}</td>`;
            leaderboardTableBody.appendChild(row);
        });
    }

    startGameButton.addEventListener('click', startGame);
    playerNameInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); startGame(); } });
    playAgainButton.addEventListener('click', () => { playerNameInput.value = ''; showScreen(introScreen); });
    openPartnershipButton.addEventListener('click', () => { showScreen(partnershipScreen); });
    backToHomeButton.addEventListener('click', () => { showScreen(introScreen); });

    partnershipForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        formStatus.textContent = '전송 중...';
        formStatus.className = '';
        try {
            const response = await fetch(event.target.action, {
                method: partnershipForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                formStatus.textContent = '전송 완료! 곧 연락드리겠습니다.';
                formStatus.className = 'success';
                partnershipForm.reset();
            } else {
                formStatus.textContent = '오류 발생. 다시 시도해주세요.';
                formStatus.className = 'error';
            }
        } catch (error) {
            formStatus.textContent = '통신 오류가 발생했습니다.';
            formStatus.className = 'error';
        }
    });

    document.addEventListener('keydown', event => {
        if (gameScreen.classList.contains('active')) {
            if (event.key === 'ArrowLeft') playerMove(-1);
            else if (event.key === 'ArrowRight') playerMove(1);
            else if (event.key === 'ArrowDown') playerDrop();
            else if (event.key === 'ArrowUp') playerRotate();
        }
    });

    showScreen(introScreen);
});
