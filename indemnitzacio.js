// Variables globales
let score = 0;
let selectedItem = null;
let selectedValue = null;

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    shuffleItems();
    initializeIndemnitzacioGame();
});

// Mezclar elementos
function shuffleItems() {
    // Mezclar items
    const items = Array.from(document.querySelectorAll('.indemnitzacio-item'));
    const itemsContainer = document.querySelector('.indemnitzacio-items');
    
    // Vaciar el contenedor
    itemsContainer.innerHTML = '';
    
    // Mezclar array de elementos
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    // Añadir elementos mezclados
    items.forEach(item => {
        itemsContainer.appendChild(item);
    });
    
    // Mezclar valores
    const values = Array.from(document.querySelectorAll('.indemnitzacio-value'));
    const valuesContainer = document.querySelector('.indemnitzacio-values');
    
    // Vaciar el contenedor
    valuesContainer.innerHTML = '';
    
    // Mezclar array de valores
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Añadir valores mezclados
    values.forEach(value => {
        valuesContainer.appendChild(value);
    });
}

// Juego de indemnizaciones
function initializeIndemnitzacioGame() {
    const items = document.querySelectorAll('.indemnitzacio-item');
    const values = document.querySelectorAll('.indemnitzacio-value');

    items.forEach(item => {
        item.addEventListener('click', () => {
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            item.classList.add('selected');
            selectedItem = item;
            checkIndemnitzacioMatch();
        });
    });

    values.forEach(value => {
        value.addEventListener('click', () => {
            if (selectedValue) {
                selectedValue.classList.remove('selected');
            }
            value.classList.add('selected');
            selectedValue = value;
            checkIndemnitzacioMatch();
        });
    });

    document.getElementById('resetIndemnitzacio').addEventListener('click', resetIndemnitzacioGame);
}

function checkIndemnitzacioMatch() {
    if (!selectedItem || !selectedValue) return;

    const isCorrect = selectedItem.dataset.value === selectedValue.dataset.value;

    if (isCorrect) {
        selectedItem.classList.add('correct');
        selectedValue.classList.add('correct');
        updateScore(5);
        selectedItem = null;
        selectedValue = null;
        checkIndemnitzacioGameEnd();
    } else {
        setTimeout(() => {
            selectedItem.classList.remove('selected');
            selectedValue.classList.remove('selected');
            selectedItem = null;
            selectedValue = null;
        }, 1000);
    }
}

function checkIndemnitzacioGameEnd() {
    const correctPairs = document.querySelectorAll('.indemnitzacio-item.correct').length;
    if (correctPairs === 5) {
        showSuccessMessage('indemnitzacio-game-section', '¡Felicidades! Has completado el juego de indemnizaciones.');
    }
}

function resetIndemnitzacioGame() {
    hideSuccessMessage();
    const items = document.querySelectorAll('.indemnitzacio-item');
    const values = document.querySelectorAll('.indemnitzacio-value');
    
    items.forEach(item => {
        item.classList.remove('selected', 'correct');
    });
    
    values.forEach(value => {
        value.classList.remove('selected', 'correct');
    });
    
    selectedItem = null;
    selectedValue = null;
    score = 0;
    updateScore(0);
    
    // Mezclar elementos para nueva partida
    setTimeout(() => {
        shuffleItems();
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
        resetIndemnitzacioGame();
    });
}

// Función para ocultar mensaje de éxito
function hideSuccessMessage() {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
} 