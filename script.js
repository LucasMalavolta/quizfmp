// Estado do quiz
let currentQuestion = 0;
let score = 0;
let answers = [];
let selectedAnswer = null;

// Elementos DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

// Elementos do quiz
const questionCounter = document.getElementById('question-counter');
const scoreCounter = document.getElementById('score-counter');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const correctAnswerDiv = document.getElementById('correct-answer');

// Elementos dos resultados
const finalScore = document.getElementById('final-score');
const percentage = document.getElementById('percentage');
const scoreMessage = document.getElementById('score-message');
const answersSummary = document.getElementById('answers-summary');

// Event listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Inicializar o quiz
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    selectedAnswer = null;
    
    showScreen('quiz');
    loadQuestion();
}

// Mostrar tela específica
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    switch(screen) {
        case 'start':
            startScreen.classList.add('active');
            break;
        case 'quiz':
            quizScreen.classList.add('active');
            break;
        case 'results':
            resultsScreen.classList.add('active');
            break;
    }
}

// Carregar pergunta atual
function loadQuestion() {
    const question = questions[currentQuestion];
    
    // Atualizar informações do cabeçalho
    questionCounter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
    scoreCounter.textContent = `Pontuação: ${score}/${currentQuestion}`;
    
    // Atualizar barra de progresso
    const progress = (currentQuestion / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Mostrar pergunta
    questionText.textContent = question.question;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Criar opções
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectAnswer(option, optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    // Esconder feedback
    feedbackContainer.classList.add('hidden');
    selectedAnswer = null;
}

// Selecionar resposta
function selectAnswer(answer, element) {
    if (selectedAnswer !== null) return; // Previne múltiplas seleções
    
    selectedAnswer = answer;
    const question = questions[currentQuestion];
    const isCorrect = answer === question.answer;
    
    // Marcar resposta selecionada
    element.classList.add('selected');
    
    // Desabilitar todas as opções
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
    });
    
    // Mostrar resultado após um pequeno delay
    setTimeout(() => {
        showAnswerFeedback(isCorrect, question.answer);
        
        // Marcar opções corretas e incorretas
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.textContent === question.answer) {
                opt.classList.add('correct');
            } else if (opt.textContent === answer && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
        
        // Atualizar pontuação
        if (isCorrect) {
            score++;
        }
        
        // Salvar resposta
        answers.push({
            question: question.question,
            userAnswer: answer,
            correctAnswer: question.answer,
            isCorrect: isCorrect
        });
        
        // Atualizar contador de pontuação
        scoreCounter.textContent = `Pontuação: ${score}/${currentQuestion + 1}`;
        
    }, 300);
}

// Mostrar feedback da resposta
function showAnswerFeedback(isCorrect, correctAnswer) {
    const feedbackStatus = feedbackText.parentElement;
    
    if (isCorrect) {
        feedbackText.textContent = 'Correto!';
        feedbackStatus.className = 'feedback-status correct';
        feedbackIcon.innerHTML = `
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  stroke="currentColor" stroke-width="2" fill="none"/>
        `;
        correctAnswerDiv.classList.add('hidden');
    } else {
        feedbackText.textContent = 'Incorreto!';
        feedbackStatus.className = 'feedback-status incorrect';
        feedbackIcon.innerHTML = `
            <path d="M6 18L18 6M6 6l12 12" 
                  stroke="currentColor" stroke-width="2" fill="none"/>
        `;
        correctAnswerDiv.textContent = `A resposta correta é: ${correctAnswer}`;
        correctAnswerDiv.classList.remove('hidden');
    }
    
    // Atualizar texto do botão
    if (currentQuestion < questions.length - 1) {
        nextBtn.textContent = 'Próxima Pergunta';
    } else {
        nextBtn.textContent = 'Ver Resultado';
    }
    
    feedbackContainer.classList.remove('hidden');
}

// Próxima pergunta
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

// Mostrar resultados
function showResults() {
    showScreen('results');
    
    const totalQuestions = questions.length;
    const percentageScore = Math.round((score / totalQuestions) * 100);
    
    // Mostrar pontuação
    finalScore.textContent = `${score}/${totalQuestions}`;
    percentage.textContent = `${percentageScore}% de acertos`;
    
    // Determinar classe e mensagem baseada na pontuação
    let scoreClass, message;
    if (percentageScore >= 90) {
        scoreClass = 'excellent';
        message = 'Excelente! Você conhece muito bem a FMP!';
    } else if (percentageScore >= 70) {
        scoreClass = 'good';
        message = 'Muito bom! Você tem um bom conhecimento sobre a FMP!';
    } else if (percentageScore >= 50) {
        scoreClass = 'average';
        message = 'Bom trabalho! Continue estudando sobre a FMP!';
    } else {
        scoreClass = 'poor';
        message = 'Continue se informando sobre a FMP para melhorar seu conhecimento!';
    }
    
    finalScore.className = `final-score ${scoreClass}`;
    scoreMessage.className = `score-message ${scoreClass}`;
    scoreMessage.textContent = message;
    
    // Atualizar barra de progresso para 100%
    progressBar.style.width = '100%';
    
    // Mostrar resumo das respostas
    showAnswersSummary();
}

// Mostrar resumo das respostas
function showAnswersSummary() {
    answersSummary.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        answerItem.innerHTML = `
            <div class="answer-question">
                ${index + 1}. ${answer.question}
            </div>
            <div class="answer-details">
                <div class="user-answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    Sua resposta: ${answer.userAnswer}
                </div>
                ${!answer.isCorrect ? `
                    <div class="correct-answer-text">
                        Resposta correta: ${answer.correctAnswer}
                    </div>
                ` : ''}
            </div>
        `;
        
        answersSummary.appendChild(answerItem);
    });
}

// Reiniciar quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    selectedAnswer = null;
    
    showScreen('start');
}

// Adicionar animações suaves nas transições
function addTransitionEffects() {
    // Adicionar efeito de fade nas mudanças de tela
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease';
    });
}

// Inicializar efeitos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    addTransitionEffects();
    
    // Adicionar efeitos de hover nos botões
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
});

// Adicionar suporte a teclado
document.addEventListener('keydown', (e) => {
    // Enter para avançar
    if (e.key === 'Enter') {
        if (startScreen.classList.contains('active')) {
            startQuiz();
        } else if (quizScreen.classList.contains('active') && !feedbackContainer.classList.contains('hidden')) {
            nextQuestion();
        } else if (resultsScreen.classList.contains('active')) {
            restartQuiz();
        }
    }
    
    // Números 1-4 para selecionar opções
    if (quizScreen.classList.contains('active') && selectedAnswer === null) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
            const options = document.querySelectorAll('.option');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

// Adicionar indicador visual de carregamento
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Função para salvar progresso no localStorage (opcional)
function saveProgress() {
    const progress = {
        currentQuestion,
        score,
        answers
    };
    localStorage.setItem('fmp-quiz-progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('fmp-quiz-progress');
    if (saved) {
        const progress = JSON.parse(saved);
        currentQuestion = progress.currentQuestion;
        score = progress.score;
        answers = progress.answers;
        return true;
    }
    return false;
}

function clearProgress() {
    localStorage.removeItem('fmp-quiz-progress');
}

