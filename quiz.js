// Variables globales
let score = 0;
let currentQuestion = 0;
let questions = [];
let selectedOption = null;
let answeredQuestions = 0;

// Preguntas del quiz
function loadQuestions() {
    questions = [
        {
            question: "Quin és l'objectiu principal d'un contracte de treball?",
            options: [
                "Generar beneficis per l'empresa",
                "Establir una relació laboral legal entre empresa i treballador",
                "Reduir els impostos",
                "Evitar les inspeccions de treball"
            ],
            correct: 1,
            explanation: "El contracte de treball és un acord legal entre empresa i persona treballadora que implica prestació de serveis retribuïts i dirigits per l'empresari, establint la base de la relació laboral."
        },
        {
            question: "Quines són les parts d'un contracte de treball?",
            options: [
                "Empresari i sindicat",
                "Treballador i seguretat social",
                "Treballador i empresari",
                "Empresari i administració pública"
            ],
            correct: 2,
            explanation: "Les parts del contracte són el treballador/a (major d'edat o menor amb autorització) i l'empresari/ària (persona física o jurídica que contracta)."
        },
        {
            question: "Quin tipus de contracte NO té data final?",
            options: [
                "Contracte temporal",
                "Contracte per circumstàncies de la producció",
                "Contracte formatiu",
                "Contracte indefinit"
            ],
            correct: 3,
            explanation: "El contracte indefinit no té data final establerta i genera estabilitat laboral. Pot ser a temps complet o parcial."
        },
        {
            question: "Què és un contracte fix discontinu?",
            options: [
                "Un contracte temporal per cops puntuals de feina",
                "Un contracte indefinit amb activitat intermitent",
                "Un contracte formatiu per a estudiants",
                "Un contracte per substituir treballadors"
            ],
            correct: 1,
            explanation: "El contracte fix discontinu és una relació indefinida però amb activitat intermitent. L'empresa fa una 'crida' per reincorporar el treballador i és usual en activitats estacionals."
        },
        {
            question: "Quina és la durada màxima d'un contracte per circumstàncies de la producció?",
            options: [
                "3 mesos",
                "6 mesos (ampliable a 12 per conveni)",
                "2 anys",
                "No té límit"
            ],
            correct: 1,
            explanation: "El contracte per circumstàncies de la producció té una durada màxima de 6 mesos, ampliable a 12 mesos per conveni col·lectiu."
        },
        {
            question: "Per a què serveix un contracte de substitució?",
            options: [
                "Per cobrir pics d'activitat ocasionals",
                "Per a la formació de nous treballadors",
                "Per cobrir absències temporals amb dret a reserva",
                "Per contractar estudiants en pràctiques"
            ],
            correct: 2,
            explanation: "El contracte per substitució serveix per cobrir absències temporals amb dret a reserva. La seva durada és el temps que duri la situació substituïda i no té dret a indemnització final."
        },
        {
            question: "Quina és la característica principal d'un contracte formatiu en alternança?",
            options: [
                "Es realitza només a persones titulades recentment",
                "Compatibilitza formació i treball",
                "No té dret a vacances",
                "Té una durada mínima de 2 anys"
            ],
            correct: 1,
            explanation: "El contracte formatiu en alternança compatibilitza formació i treball, amb una durada de 3 mesos a 2 anys i una retribució adaptada (mínim 60-75% de conveni)."
        },
        {
            question: "Quina indemnització correspon a un acomiadament objectiu?",
            options: [
                "12 dies per any treballat",
                "20 dies per any treballat",
                "33 dies per any treballat",
                "No té indemnització"
            ],
            correct: 1,
            explanation: "L'acomiadament objectiu per causes econòmiques o tècniques té una indemnització de 20 dies per any treballat."
        },
        {
            question: "Quan un acomiadament es considera nul?",
            options: [
                "Quan hi ha causa econòmica justificada",
                "Quan el treballador ha comès una falta greu",
                "Quan vulnera drets fonamentals del treballador",
                "Quan finalitza el contracte temporal"
            ],
            correct: 2,
            explanation: "Un acomiadament es considera nul quan vulnera drets fonamentals del treballador i comporta readmissió obligatòria."
        },
        {
            question: "Quina de les següents NO és una modificació substancial de les condicions de treball?",
            options: [
                "Canvi de sou",
                "Modificació d'horari",
                "Canvi d'uniforme",
                "Mobilitat geogràfica"
            ],
            correct: 2,
            explanation: "Les modificacions substancials inclouen canvis en sou, jornada, horari o mobilitat geogràfica. Un simple canvi d'uniforme no es considera una modificació substancial."
        }
    ];

    document.getElementById('total-questions').textContent = questions.length;
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    shuffleQuestions();
    showQuestion();
    
    document.getElementById('next-button').addEventListener('click', handleNextButton);
    document.getElementById('resetQuiz').addEventListener('click', resetQuiz);
});

// Mezclar preguntas
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Mostrar pregunta actual
function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const currentQuestionElement = document.getElementById('current-question');
    
    // Ocultar botón siguiente hasta que se responda
    document.getElementById('next-button').style.display = 'none';
    
    // Actualizar número de pregunta actual
    currentQuestionElement.textContent = currentQuestion + 1;
    
    // Limpiar selección anterior
    selectedOption = null;
    
    // Mostrar pregunta actual
    questionElement.textContent = questions[currentQuestion].question;
    
    // Limpiar opciones anteriores
    optionsElement.innerHTML = '';
    
    // Limpiar feedback
    feedbackElement.innerHTML = '';
    
    // Añadir opciones
    questions[currentQuestion].options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        
        optionElement.addEventListener('click', () => selectOption(optionElement, index));
        
        optionsElement.appendChild(optionElement);
    });
}

// Seleccionar una opción
function selectOption(optionElement, index) {
    // Si ya se ha respondido, no hacer nada
    if (selectedOption !== null) return;
    
    selectedOption = index;
    const options = document.querySelectorAll('.option');
    
    // Quitar selección de todas las opciones
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Seleccionar esta opción
    optionElement.classList.add('selected');
    
    // Comprobar si es correcta
    const isCorrect = index === questions[currentQuestion].correct;
    
    // Mostrar resultado
    setTimeout(() => {
        if (isCorrect) {
            optionElement.classList.add('correct');
            updateScore(10);
        } else {
            optionElement.classList.add('incorrect');
            options[questions[currentQuestion].correct].classList.add('correct');
        }
        
        // Mostrar explicación
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.innerHTML = `
            <div class="${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                ${isCorrect ? '¡Correcte!' : 'Incorrecte'}
            </div>
            <div class="explanation">
                ${questions[currentQuestion].explanation}
            </div>
        `;
        
        // Mostrar botón siguiente
        document.getElementById('next-button').style.display = 'block';
        
        answeredQuestions++;
        
        // Si es la última pregunta, cambiar el texto del botón
        if (currentQuestion === questions.length - 1) {
            document.getElementById('next-button').textContent = 'Finalitzar';
        }
    }, 500);
}

// Manejar botón siguiente
function handleNextButton() {
    // Si no se ha seleccionado ninguna opción, no hacer nada
    if (selectedOption === null) return;
    
    currentQuestion++;
    
    // Si hemos llegado al final, mostrar resumen
    if (currentQuestion >= questions.length) {
        showSummary();
    } else {
        showQuestion();
    }
}

// Mostrar resumen final
function showSummary() {
    const quizContainer = document.querySelector('.quiz-container');
    
    quizContainer.innerHTML = `
        <div class="quiz-summary">
            <h2>Quiz Completat!</h2>
            <p>Has obtingut ${score} punts de ${questions.length * 10} possibles.</p>
            <p>Has contestat correctament ${score / 10} de ${questions.length} preguntes.</p>
            <button id="restart-quiz" class="game-button">Tornar a Jugar</button>
        </div>
    `;
    
    document.getElementById('restart-quiz').addEventListener('click', resetQuiz);
}

// Reiniciar quiz
function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    answeredQuestions = 0;
    updateScore(0);
    shuffleQuestions();
    showQuestion();
}

// Función para actualizar la puntuación
function updateScore(points) {
    score += points;
    document.querySelector('.game-score').textContent = `Puntuació: ${score}`;
} 