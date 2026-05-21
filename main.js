document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const introScreen = document.getElementById('intro-screen');
    const tetrisSetupScreen = document.getElementById('tetris-setup-screen');
    const animalTestScreen = document.getElementById('animal-test-screen');
    const gameScreen = document.getElementById('game-screen');
    const leaderboardScreen = document.getElementById('leaderboard-screen');
    const partnershipScreen = document.getElementById('partnership-screen');
    const disqusContainer = document.getElementById('disqus-container');

    // Buttons & Inputs
    const modeTetrisBtn = document.getElementById('mode-tetris');
    const modeAnimalBtn = document.getElementById('mode-animal');
    const openPartnershipBtn = document.getElementById('open-partnership');
    const backToHomeBtns = document.querySelectorAll('.back-to-home-btn');
    
    const playerNameInput = document.getElementById('player-name');
    const startGameBtn = document.getElementById('start-game');
    const playAgainBtn = document.getElementById('play-again');

    // Animal Test Elements
    const imageUpload = document.getElementById('image-upload');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const faceImage = document.getElementById('face-image');
    const scanLine = document.getElementById('scan-line');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resetAnimalBtn = document.getElementById('reset-animal-test');
    const resultsContainer = document.getElementById('results-container');
    const labelContainer = document.getElementById('label-container');
    const loadingModel = document.getElementById('loading-model');

    // --- Teachable Machine Config ---
    const TM_MODEL_URL = "https://teachablemachine.withgoogle.com/models/Rlcz1w9DH/"; 
    let model, maxPredictions;

    // --- Screen Management ---
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
        
        if (screen === leaderboardScreen || screen === introScreen) {
            disqusContainer.style.display = 'block';
        } else {
            disqusContainer.style.display = 'none';
        }

        if (screen === partnershipScreen) {
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = '';
            formStatus.className = '';
        }
    }

    // --- Navigation ---
    modeTetrisBtn.addEventListener('click', () => showScreen(tetrisSetupScreen));
    modeAnimalBtn.addEventListener('click', () => {
        showScreen(animalTestScreen);
        initAnimalTest(); 
    });
    openPartnershipBtn.addEventListener('click', () => showScreen(partnershipScreen));
    backToHomeBtns.forEach(btn => btn.addEventListener('click', () => {
        stopGame();
        showScreen(introScreen);
    }));

    // --- Animal Face Test Logic ---
    async function initAnimalTest() {
        if (model) return; // Don't re-initialize if model is already loaded
        
        loadingModel.style.display = 'block';
        loadingModel.textContent = 'AI 모델을 불러오는 중...';
        try {
            const modelURL = TM_MODEL_URL + "model.json";
            const metadataURL = TM_MODEL_URL + "metadata.json";
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            loadingModel.style.display = 'none';
            uploadPlaceholder.style.display = 'flex'; // Show upload area after model loads
        } catch (e) {
            loadingModel.textContent = "AI 모델 로딩 실패. URL을 확인해주세요.";
            console.error(e);
        }
    }

    uploadPlaceholder.addEventListener('click', () => imageUpload.click());

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                faceImage.src = event.target.result;
                faceImage.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                analyzeBtn.style.display = 'inline-block';
                resetAnimalBtn.style.display = 'none';
                resultsContainer.style.display = 'none';
                labelContainer.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!model) return;
        scanLine.style.display = 'block';
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '분석 중...';

        setTimeout(async () => { // Simulate scanning time for better UX
            await predict();
            scanLine.style.display = 'none';
            analyzeBtn.style.display = 'none';
            resetAnimalBtn.style.display = 'inline-block';
            resultsContainer.style.display = 'block';
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '분석하기';
        }, 1500);
    });

    async function predict() {
        const prediction = await model.predict(faceImage);
        labelContainer.innerHTML = '';
        // Sort predictions by probability
        const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);

        sortedPredictions.forEach(p => {
            const probability = (p.probability * 100).toFixed(0);
            const resultBarHtml = `
                <div class="result-item">
                    <div class="result-label">${p.className}</div>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${probability}%"></div>
                        <span class="result-percentage">${probability}%</span>
                    </div>
                </div>
            `;
            labelContainer.innerHTML += resultBarHtml;
        });
    }

    resetAnimalBtn.addEventListener('click', () => {
        faceImage.src = '';
        faceImage.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        resultsContainer.style.display = 'none';
        resetAnimalBtn.style.display = 'none';
        imageUpload.value = '';
    });


    // --- Tetris Game Logic ---
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const NEXT_BLOCK_SIZE = 30;
    const COLORS = [null, '#ff00ff', '#ffff00', '#00ffff', '#0000ff', '#ffa500', '#00ff00', '#ff0000'];
    const TETROMINOES = [
        [], 
        [[1, 1, 1], [0, 1, 0]], 
        [[1, 1], [1, 1]], 
        [[1, 1, 1, 1]], 
        [[1, 0, 0], [1, 1, 1]], 
        [[0, 0, 1], [1, 1, 1]], 
        [[0, 1, 1], [1, 1, 0]], 
        [[1, 1, 0], [0, 1, 1]]
    ];

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;
    let playerName = '';
    let piece, nextPiece;
    let lastTime = 0;
    let dropCounter = 0;
    let dropInterval = 1000;
    let gameLoopId;

    const canvas = document.getElementById('tetris-board');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next-piece');
    const nextContext = nextCanvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');

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
        const shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]],   // O
            [[0, 1, 0], [1, 1, 1]], // T
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 1, 0], [0, 1, 1]], // Z
            [[1, 0, 0], [1, 1, 1]], // L
            [[0, 0, 1], [1, 1, 1]]  // J
        ];
        
        if (!nextPiece) {
            const type = Math.floor(Math.random() * shapes.length);
            piece = { 
                matrix: shapes[type], 
                type: type + 1, 
                x: Math.floor(COLS / 2) - Math.floor(shapes[type][0].length / 2), 
                y: 0 
            };
        } else {
            piece = { 
                matrix: nextPiece.matrix, 
                type: nextPiece.type, 
                x: Math.floor(COLS / 2) - Math.floor(nextPiece.matrix[0].length / 2), 
                y: 0 
            };
        }
        
        const nextType = Math.floor(Math.random() * shapes.length);
        nextPiece = { 
            matrix: shapes[nextType], 
            type: nextType + 1, 
            x: 0, 
            y: 0 
        };

        if (collide(piece)) {
            return false;
        }
        return true;
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

    function playerHardDrop() {
        if (!piece) return;
        while (!collide(piece)) {
            piece.y++;
        }
        piece.y--;
        merge();
        playerReset();
        sweep();
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
                if (p.matrix[y][x] && 
                    (board[p.y + y] === undefined || board[p.y + y][p.x + x] === undefined || board[p.y + y][p.x + x] !== 0)) {
                    return true;
                }
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
            score += clearedLines * 10 * clearedLines;
            dropInterval = Math.max(200, dropInterval - 25 * clearedLines);
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
        stopGame(); // Ensure any existing loop is stopped
        
        playerName = playerNameInput.value || 'Anonymous';
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        score = 0;
        scoreDisplay.textContent = score;
        dropInterval = 1000;
        dropCounter = 0;
        lastTime = performance.now();
        nextPiece = null;
        
        if (!playerReset()) {
            endGame();
            return;
        }
        
        showScreen(gameScreen);
        gameLoopId = requestAnimationFrame(update);
    }

    function stopGame() {
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
    }

    function endGame() {
        stopGame();
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

    startGameBtn.addEventListener('click', startGame);
    playerNameInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); startGame(); } });
    playAgainBtn.addEventListener('click', () => { 
        playerNameInput.value = '';
        showScreen(tetrisSetupScreen);
    });

    // Partnership Form Logic
    const partnershipForm = document.getElementById('partnership-form');
    partnershipForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const formStatus = document.getElementById('form-status');
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
            else if (event.key === ' ') {
                event.preventDefault();
                playerHardDrop();
            }
        }
    });

    showScreen(introScreen);
});