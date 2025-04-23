document.addEventListener('DOMContentLoaded', () => {
    // Juego de emparejamiento
    const cards = document.querySelectorAll('.card');
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;
    let pairsFound = 0;
    const totalPairs = 12; // Número total de parejas a encontrar

    // Actualizar el contador de parejas
    const pairsFoundElement = document.getElementById('pairs-found');
    pairsFoundElement.textContent = pairsFound;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.type === secondCard.dataset.type;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Incrementar contador de parejas
        pairsFound++;
        pairsFoundElement.textContent = pairsFound;
        
        // Verificar si se ha completado el juego
        if (pairsFound === totalPairs) {
            setTimeout(() => {
                alert('¡Felicidades! Has completado el juego de emparejamiento.');
            }, 500);
        }
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Función para reiniciar el juego
    function resetGame() {
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
            card.addEventListener('click', flipCard);
        });
        pairsFound = 0;
        pairsFoundElement.textContent = pairsFound;
        resetBoard();
    }

    // Añadir evento al botón de reinicio
    const resetButton = document.getElementById('reset-game');
    resetButton.addEventListener('click', resetGame);

    // Inicializar el juego
    cards.forEach(card => card.addEventListener('click', flipCard));

    // Quiz
    const quizQuestions = [
        {
            question: "¿Cuál es la duración máxima de un contrato por circunstancias de la producción?",
            options: ["3 meses", "6 meses", "1 año", "2 años"],
            correct: 1
        },
        {
            question: "¿Cuál es la indemnización por despido improcedente?",
            options: ["20 días/año", "33 días/año", "12 días/año", "45 días/año"],
            correct: 1
        },
        {
            question: "¿Qué tipo de contrato es para personas tituladas recientemente?",
            options: ["Contrato indefinido", "Contrato formativo de prácticas", "Contrato por sustitución", "Contrato fijo discontinuo"],
            correct: 1
        },
        {
            question: "¿Cuál es la duración del contrato formativo de alternancia?",
            options: ["De 3 a 6 meses", "De 3 meses a 2 años", "De 6 meses a 1 año", "De 1 a 3 años"],
            correct: 1
        },
        {
            question: "¿Qué tipo de contrato es para trabajos estacionales?",
            options: ["Contrato indefinido", "Contrato por sustitución", "Contrato fijo discontinuo", "Contrato formativo"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    const quizContainer = document.querySelector('.quiz-container');
    const questionElement = document.querySelector('.question p');
    const optionsContainer = document.querySelector('.options');

    function loadQuestion() {
        const question = quizQuestions[currentQuestion];
        questionElement.textContent = question.question;
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(index));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selectedIndex) {
        const question = quizQuestions[currentQuestion];
        const options = document.querySelectorAll('.option');
        
        options.forEach(opt => {
            opt.style.backgroundColor = 'white';
            opt.style.color = 'black';
        });

        if (selectedIndex === question.correct) {
            options[selectedIndex].style.backgroundColor = '#4CAF50';
            options[selectedIndex].style.color = 'white';
        } else {
            options[selectedIndex].style.backgroundColor = '#f44336';
            options[selectedIndex].style.color = 'white';
            options[question.correct].style.backgroundColor = '#4CAF50';
            options[question.correct].style.color = 'white';
        }

        setTimeout(() => {
            currentQuestion = (currentQuestion + 1) % quizQuestions.length;
            loadQuestion();
        }, 2000);
    }

    loadQuestion();

    // Animaciones al hacer scroll
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Variables globales
    let score = 0;
    let matchedPairs = 0;
    let flippedCards = [];
    let canFlip = true;

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
            setTimeout(() => {
                alert('¡Felicidades! Has completado el juego de memoria.');
                resetMemoryGame();
            }, 500);
        }
    }

    function resetMemoryGame() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
        flippedCards = [];
        canFlip = true;
        matchedPairs = 0;
        score = 0;
        updateScore(0);
    }

    // Juego de clasificación
    function initializeClassificationGame() {
        const draggables = document.querySelectorAll('.draggable');
        const categories = document.querySelectorAll('.category-items');
        let itemsClassified = 0;

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
            });

            category.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                const correctCategory = draggable.dataset.category;
                const targetCategory = category.parentElement.id;

                if (correctCategory === targetCategory) {
                    category.appendChild(draggable);
                    itemsClassified++;
                    updateScore(5);
                    document.getElementById('items-classified').textContent = itemsClassified;

                    if (itemsClassified === 15) {
                        setTimeout(() => {
                            alert('¡Felicidades! Has clasificado todos los elementos correctamente.');
                            resetClassificationGame();
                        }, 500);
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
        const draggables = document.querySelectorAll('.draggable');
        const draggableItems = document.querySelector('.draggable-items');
        const itemsClassified = document.getElementById('items-classified');
        
        draggables.forEach(draggable => {
            draggableItems.appendChild(draggable);
            draggable.classList.remove('wrong');
        });
        
        itemsClassified.textContent = '0';
        score = 0;
        updateScore(0);
    }

    // Juego de indemnizaciones
    function initializeIndemnitzacioGame() {
        const items = document.querySelectorAll('.indemnitzacio-item');
        const values = document.querySelectorAll('.indemnitzacio-value');
        let selectedItem = null;
        let selectedValue = null;

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
            setTimeout(() => {
                alert('¡Felicidades! Has completado el juego de indemnizaciones.');
                resetIndemnitzacioGame();
            }, 500);
        }
    }

    function resetIndemnitzacioGame() {
        const items = document.querySelectorAll('.indemnitzacio-item');
        const values = document.querySelectorAll('.indemnitzacio-value');
        
        items.forEach(item => {
            item.classList.remove('selected', 'correct');
        });
        
        values.forEach(value => {
            value.classList.remove('selected', 'correct');
        });
        
        score = 0;
        updateScore(0);
    }

    // Función para actualizar la puntuación
    function updateScore(points) {
        score += points;
        document.querySelector('.game-score').textContent = `Puntuación: ${score}`;
    }

    // Inicializar todos los juegos cuando se carga la página
    initializeMemoryGame();
    initializeClassificationGame();
    initializeIndemnitzacioGame();
}); 