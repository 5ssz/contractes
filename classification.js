// Variables globales
let score = 0;
let itemsClassified = 0;

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    shuffleDraggables();
    initializeClassificationGame();
});

// Mezclar elementos arrastrables
function shuffleDraggables() {
    const draggables = Array.from(document.querySelectorAll('.draggable'));
    const container = document.querySelector('.draggable-items');
    
    // Vaciar el contenedor
    container.innerHTML = '';
    
    // Mezclar array de elementos
    for (let i = draggables.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [draggables[i], draggables[j]] = [draggables[j], draggables[i]];
    }
    
    // Añadir elementos mezclados al contenedor
    draggables.forEach(draggable => {
        container.appendChild(draggable);
    });
}

// Juego de clasificación
function initializeClassificationGame() {
    const draggables = document.querySelectorAll('.draggable');
    const categories = document.querySelectorAll('.category-items');

    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'true');
        
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.dataset.category);
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    categories.forEach(category => {
        category.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            category.classList.add('drag-over');
        });

        category.addEventListener('dragleave', () => {
            category.classList.remove('drag-over');
        });

        category.addEventListener('drop', (e) => {
            e.preventDefault();
            category.classList.remove('drag-over');
            const draggable = document.querySelector('.dragging');
            const correctCategory = draggable.dataset.category;
            const targetCategory = category.parentElement.id;

            if (correctCategory === targetCategory) {
                category.appendChild(draggable);
                itemsClassified++;
                updateScore(5);
                document.getElementById('items-classified').textContent = itemsClassified;

                if (itemsClassified === 14) {
                    showSuccessMessage('classification-game-section', '¡Felicidades! Has clasificado todos los elementos correctamente.');
                }
            } else {
                draggable.classList.add('wrong');
                setTimeout(() => {
                    draggable.classList.remove('wrong');
                }, 1000);
            }
        });
    });

    document.getElementById('resetClassification').addEventListener('click', resetClassificationGame);
}

function resetClassificationGame() {
    hideSuccessMessage();
    const draggables = document.querySelectorAll('.draggable');
    const draggableItems = document.querySelector('.draggable-items');
    
    draggables.forEach(draggable => {
        draggableItems.appendChild(draggable);
        draggable.classList.remove('wrong');
    });
    
    itemsClassified = 0;
    document.getElementById('items-classified').textContent = '0';
    score = 0;
    updateScore(0);
    
    // Mezclar elementos para nueva partida
    setTimeout(() => {
        shuffleDraggables();
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
        resetClassificationGame();
    });
}

// Función para ocultar mensaje de éxito
function hideSuccessMessage() {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
} 