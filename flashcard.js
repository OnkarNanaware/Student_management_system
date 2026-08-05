const form = document.getElementById('flashcard-form');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const clearBtn = document.getElementById('clear-btn');
const cardList = document.getElementById('card-list');
const activeCard = document.getElementById('active-card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const flipBtn = document.getElementById('flip-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const emptyState = document.getElementById('empty-state');

let flashcards = [];
let activeIndex = 0;
let isFlipped = false;

function loadFlashcards() {
    const saved = localStorage.getItem('student_flashcards');
    flashcards = saved ? JSON.parse(saved) : [];
}

function saveFlashcards() {
    localStorage.setItem('student_flashcards', JSON.stringify(flashcards));
}

function renderFlashcards() {
    cardList.innerHTML = '';

    if (flashcards.length === 0) {
        emptyState.style.display = 'block';
        cardFront.textContent = 'No flashcards yet.';
        cardBack.textContent = 'Add a new card with a question and answer.';
        activeCard.classList.remove('flipped');
        return;
    }

    emptyState.style.display = 'none';
    activeIndex = Math.min(activeIndex, flashcards.length - 1);
    activeIndex = Math.max(activeIndex, 0);

    flashcards.forEach((card, index) => {
        const li = document.createElement('li');
        li.className = 'flashcard-item';
        li.innerHTML = `
            <strong>${escapeHTML(card.question)}</strong>
            <span>${escapeHTML(card.answer)}</span>
            <button class="btn btn-danger" type="button" data-index="${index}">Delete</button>
        `;

        li.querySelector('button').addEventListener('click', () => removeCard(index));
        cardList.appendChild(li);
    });

    updateActiveCard();
}

function updateActiveCard() {
    const card = flashcards[activeIndex];
    if (!card) return;
    cardFront.innerHTML = `<h3>Question</h3><p>${escapeHTML(card.question)}</p>`;
    cardBack.innerHTML = `<h3>Answer</h3><p>${escapeHTML(card.answer)}</p>`;
    activeCard.classList.toggle('flipped', isFlipped);
}

function handleFormSubmit(event) {
    event.preventDefault();
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    if (!question || !answer) return;

    flashcards.push({ question, answer, id: Date.now().toString() });
    saveFlashcards();
    form.reset();
    activeIndex = flashcards.length - 1;
    isFlipped = false;
    renderFlashcards();
}

function clearForm() {
    form.reset();
}

function flipCard() {
    if (flashcards.length === 0) return;
    isFlipped = !isFlipped;
    activeCard.classList.toggle('flipped', isFlipped);
}

function goPrevious() {
    if (flashcards.length === 0) return;
    activeIndex = activeIndex > 0 ? activeIndex - 1 : flashcards.length - 1;
    isFlipped = false;
    renderFlashcards();
}

function goNext() {
    if (flashcards.length === 0) return;
    activeIndex = activeIndex < flashcards.length - 1 ? activeIndex + 1 : 0;
    isFlipped = false;
    renderFlashcards();
}

function removeCard(index) {
    flashcards.splice(index, 1);
    saveFlashcards();
    activeIndex = Math.min(activeIndex, flashcards.length - 1);
    isFlipped = false;
    renderFlashcards();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

form.addEventListener('submit', handleFormSubmit);
clearBtn.addEventListener('click', clearForm);
flipBtn.addEventListener('click', flipCard);
prevBtn.addEventListener('click', goPrevious);
nextBtn.addEventListener('click', goNext);

window.addEventListener('DOMContentLoaded', () => {
    loadFlashcards();
    renderFlashcards();
});