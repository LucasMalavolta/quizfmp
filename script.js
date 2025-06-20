let currentQuestion = 0;
let score = 0;
let answers = [];
let selectedAnswer = null;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionCounter = document.getElementById('question-counter');
const scoreCounter = document.getElementById('score-counter');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const correctAnswerDiv = document.getElementById('correct-answer');

const finalScore = document.getElementById('final-score');
const percentage = document.getElementById('percentage');
const scoreMessage = document.getElementById('score-message');
const answersSummary = document.getElementById('answers-summary');

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    selectedAnswer = null;
    
    showScreen('quiz');
    loadQuestion();
}

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

function loadQuestion() {
    const question = questions[currentQuestion];
    
    questionCounter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
    scoreCounter.textContent = `Pontuação: ${score}/${currentQuestion}`;
    
    const progress = (currentQuestion / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectAnswer(option, optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    feedbackContainer.classList.add('hidden');
    selectedAnswer = null;
}

function selectAnswer(answer, element) {
    if (selectedAnswer !== null) return; 
    
    selectedAnswer = answer;
    const question = questions[currentQuestion];
    const isCorrect = answer === question.answer;

    element.classList.add('selected');
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
    });
    
   setTimeout(() => {
        showAnswerFeedback(isCorrect, question.answer);
        
       document.querySelectorAll('.option').forEach(opt => {
            if (opt.textContent === question.answer) {
                opt.classList.add('correct');
            } else if (opt.textContent === answer && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
        
        if (isCorrect) {
            score++;
        }
        
        answers.push({
            question: question.question,
            userAnswer: answer,
            correctAnswer: question.answer,
            isCorrect: isCorrect
        });
        
        scoreCounter.textContent = `Pontuação: ${score}/${currentQuestion + 1}`;
        
    }, 300);
}

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
    
    if (currentQuestion < questions.length - 1) {
        nextBtn.textContent = 'Próxima Pergunta';
    } else {
        nextBtn.textContent = 'Ver Resultado';
    }
    
    feedbackContainer.classList.remove('hidden');
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('results');
    
    const totalQuestions = questions.length;
    const percentageScore = Math.round((score / totalQuestions) * 100);
    
    finalScore.textContent = `${score}/${totalQuestions}`;
    percentage.textContent = `${percentageScore}% de acertos`;
    
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
    
    progressBar.style.width = '100%';
    
    showAnswersSummary();
}

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

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    selectedAnswer = null;
    
    showScreen('start');
}

function addTransitionEffects() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addTransitionEffects();
    
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (startScreen.classList.contains('active')) {
            startQuiz();
        } else if (quizScreen.classList.contains('active') && !feedbackContainer.classList.contains('hidden')) {
            nextQuestion();
        } else if (resultsScreen.classList.contains('active')) {
            restartQuiz();
        }
    }
    
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

function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

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

