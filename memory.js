// Variables globales
let score = 0;
let matchedPairs = 0;
let flippedCards = [];
let canFlip = true;

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    shuffleCards();
    initializeMemoryGame();
    document.getElementById('resetMemory').addEventListener('click', resetMemoryGame);
});

// Mezclar cartas
function shuffleCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
    const gameContainer = document.querySelector('.memory-game');
    
    // Vaciar el contenedor
    gameContainer.innerHTML = '';
    
    // Mezclar el array de cartas
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Añadir las cartas mezcladas de nuevo al contenedor
    cards.forEach(card => {
        gameContainer.appendChild(card);
    });
}

// Juego de memoria
function initializeMemoryGame() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateScore(10);
        checkGameEnd();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            canFlip = true;
        }, 1000);
    }

    flippedCards = [];
}

function checkGameEnd() {
    if (matchedPairs === 8) {
        showSuccessMessage('memory-game-section', '¡Felicidades! Has completado el juego de memoria.');
    }
}

function resetMemoryGame() {
    hideSuccessMessage();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    flippedCards = [];
    canFlip = true;
    matchedPairs = 0;
    score = 0;
    updateScore(0);
    
    // Mezclar las cartas para la nueva partida
    setTimeout(() => {
        shuffleCards();
        initializeMemoryGame();
    }, 300);
}

// Función para actualizar la puntuación
function updateScore(points) {
    score += points;
    document.querySelector('.game-score').textContent = `Puntuación: ${score}`;
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(containerId, message) {
    hideSuccessMessage();
    
    const container = document.querySelector(`.${containerId}`);
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <p>${message}</p>
            <button class="game-button continue-button">Continuar</button>
        </div>
    `;
    
    container.appendChild(successMessage);
    
    document.querySelector('.continue-button').addEventListener('click', () => {
        hideSuccessMessage();
        resetMemoryGame();
    });
}

// Función para ocultar mensaje de éxito
function hideSuccessMessage() {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
} 