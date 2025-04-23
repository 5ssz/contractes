// Variables globales
let score = 0;
let matchedPairs = 0;
let selectedConcept = null;
let selectedDefinition = null;
let pairs = [];

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    loadPairs();
    renderGame();
    
    document.getElementById('resetJornada').addEventListener('click', resetGame);
});

// Cargar los pares de conceptos y definiciones
function loadPairs() {
    pairs = [
        {
            concept: "Jornada Laboral",
            definition: "Temps de treball efectiu diari o setmanal pactat, amb un màxim de 40 hores setmanals de mitjana anual."
        },
        {
            concept: "Jornada Completa",
            definition: "Fins a 40 hores setmanals (properament 37,5 hores)."
        },
        {
            concept: "Jornada Parcial",
            definition: "Menys de 40 hores setmanals."
        },
        {
            concept: "Jornada Irregular",
            definition: "Hores variables amb preavís de 5 dies."
        },
        {
            concept: "Descans entre Jornades",
            definition: "Mínim 12 hores consecutives."
        },
        {
            concept: "Hores Extraordinàries",
            definition: "Treball fora de la jornada ordinària amb límit de 80 hores anuals."
        },
        {
            concept: "Vacances Anuals",
            definition: "Dret a 30 dies naturals per any treballat, irrenunciables."
        },
        {
            concept: "Teletreball",
            definition: "Treball remot pactat i regulat per contracte, amb drets de desconnexió digital."
        },
        {
            concept: "Flexiseguretat",
            definition: "Combina flexibilitat laboral i protecció dels treballadors."
        },
        {
            concept: "Plans d'Igualtat",
            definition: "Protocols obligatoris a empreses de 50 o més treballadors per promoure igualtat d'oportunitats."
        }
    ];

    document.getElementById('total-pairs').textContent = pairs.length;
}

// Renderizar el juego
function renderGame() {
    const conceptsContainer = document.querySelector('.jornada-concepts');
    const definitionsContainer = document.querySelector('.jornada-definitions');
    
    // Limpiar contenedores
    conceptsContainer.innerHTML = '';
    definitionsContainer.innerHTML = '';
    
    // Crear copia de los pares y mezclarlos
    const shuffledConcepts = [...pairs];
    const shuffledDefinitions = [...pairs];
    
    // Mezclar conceptos
    for (let i = shuffledConcepts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledConcepts[i], shuffledConcepts[j]] = [shuffledConcepts[j], shuffledConcepts[i]];
    }
    
    // Mezclar definiciones
    for (let i = shuffledDefinitions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDefinitions[i], shuffledDefinitions[j]] = [shuffledDefinitions[j], shuffledDefinitions[i]];
    }
    
    // Renderizar conceptos
    shuffledConcepts.forEach(pair => {
        const conceptElement = document.createElement('div');
        conceptElement.className = 'jornada-item jornada-concept';
        conceptElement.textContent = pair.concept;
        conceptElement.dataset.concept = pair.concept;
        
        conceptElement.addEventListener('click', () => selectConcept(conceptElement));
        
        conceptsContainer.appendChild(conceptElement);
    });
    
    // Renderizar definiciones
    shuffledDefinitions.forEach(pair => {
        const definitionElement = document.createElement('div');
        definitionElement.className = 'jornada-item jornada-definition';
        definitionElement.textContent = pair.definition;
        definitionElement.dataset.definition = pair.definition;
        definitionElement.dataset.concept = pair.concept; // Para verificar coincidencias
        
        definitionElement.addEventListener('click', () => selectDefinition(definitionElement));
        
        definitionsContainer.appendChild(definitionElement);
    });
}

// Seleccionar un concepto
function selectConcept(element) {
    // Si ya tiene una coincidencia o ya está seleccionado, no hacer nada
    if (element.classList.contains('matched') || element === selectedConcept) return;
    
    // Si hay algún concepto seleccionado, quitar la selección
    if (selectedConcept) {
        selectedConcept.classList.remove('selected');
    }
    
    // Seleccionar este concepto
    element.classList.add('selected');
    selectedConcept = element;
    
    // Comprobar si hay coincidencia
    checkMatch();
}

// Seleccionar una definición
function selectDefinition(element) {
    // Si ya tiene una coincidencia o ya está seleccionada, no hacer nada
    if (element.classList.contains('matched') || element === selectedDefinition) return;
    
    // Si hay alguna definición seleccionada, quitar la selección
    if (selectedDefinition) {
        selectedDefinition.classList.remove('selected');
    }
    
    // Seleccionar esta definición
    element.classList.add('selected');
    selectedDefinition = element;
    
    // Comprobar si hay coincidencia
    checkMatch();
}

// Comprobar coincidencia
function checkMatch() {
    // Si no hay concepto o definición seleccionada, no hacer nada
    if (!selectedConcept || !selectedDefinition) return;
    
    // Comprobar si coinciden
    const isMatch = selectedConcept.dataset.concept === selectedDefinition.dataset.concept;
    
    if (isMatch) {
        // Marcar como emparejados
        selectedConcept.classList.add('matched');
        selectedDefinition.classList.add('matched');
        
        // Quitar selección
        selectedConcept.classList.remove('selected');
        selectedDefinition.classList.remove('selected');
        
        // Incrementar puntuación
        updateScore(10);
        
        // Incrementar parejas emparejadas
        matchedPairs++;
        document.getElementById('matched-count').textContent = matchedPairs;
        
        // Comprobar si se han emparejado todas las parejas
        if (matchedPairs === pairs.length) {
            showSuccessMessage();
        }
        
        // Reiniciar selecciones
        selectedConcept = null;
        selectedDefinition = null;
    } else {
        // Si no coinciden, mostrar feedback visual
        setTimeout(() => {
            // Quitar selección
            selectedConcept.classList.remove('selected');
            selectedDefinition.classList.remove('selected');
            
            // Reiniciar selecciones
            selectedConcept = null;
            selectedDefinition = null;
        }, 1000);
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const gameSection = document.querySelector('.jornada-game-section');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <p>¡Felicidades! Has emparejado todos los conceptos correctamente.</p>
            <button class="game-button continue-button">Continuar</button>
        </div>
    `;
    
    gameSection.appendChild(successMessage);
    
    document.querySelector('.continue-button').addEventListener('click', () => {
        successMessage.remove();
        resetGame();
    });
}

// Reiniciar juego
function resetGame() {
    // Reiniciar variables
    score = 0;
    matchedPairs = 0;
    selectedConcept = null;
    selectedDefinition = null;
    
    // Actualizar puntuación y contador
    updateScore(0);
    document.getElementById('matched-count').textContent = 0;
    
    // Quitar mensaje de éxito si existe
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.remove();
    }
    
    // Renderizar el juego de nuevo
    renderGame();
}

// Actualizar puntuación
function updateScore(points) {
    score += points;
    document.querySelector('.game-score').textContent = `Puntuació: ${score}`;
} 