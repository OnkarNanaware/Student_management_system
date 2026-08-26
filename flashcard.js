(function(){
    'use strict';

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
    const emptyState = document.getElementById('flashcard-empty');

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
        if (!cardList) return;
        cardList.innerHTML = '';

        if (flashcards.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (cardFront) cardFront.textContent = 'No flashcards yet.';
            if (cardBack) cardBack.textContent = 'Add a new card with a question and answer.';
            if (activeCard) activeCard.classList.remove('flipped');
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
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

            const btn = li.querySelector('button');
            if (btn) btn.addEventListener('click', () => removeCard(index));
            cardList.appendChild(li);
        });

        updateActiveCard();
    }

    function updateActiveCard() {
        const card = flashcards[activeIndex];
        if (!card) return;
        if (cardFront) cardFront.innerHTML = `<h3>Question</h3><p>${escapeHTML(card.question)}</p>`;
        if (cardBack) cardBack.innerHTML = `<h3>Answer</h3><p>${escapeHTML(card.answer)}</p>`;
        if (activeCard) activeCard.classList.toggle('flipped', isFlipped);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        if (!question || !answer) return;

        flashcards.push({ question, answer, id: Date.now().toString() });
        saveFlashcards();
        if (form) form.reset();
        activeIndex = flashcards.length - 1;
        isFlipped = false;
        renderFlashcards();
    }

    function clearForm() {
        if (form) form.reset();
    }

    function flipCard() {
        if (flashcards.length === 0) return;
        isFlipped = !isFlipped;
        if (activeCard) activeCard.classList.toggle('flipped', isFlipped);
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
        return String(str).replace(/[&<>'\"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    if (form) form.addEventListener('submit', handleFormSubmit);
    if (clearBtn) clearBtn.addEventListener('click', clearForm);
    if (flipBtn) flipBtn.addEventListener('click', flipCard);
    if (prevBtn) prevBtn.addEventListener('click', goPrevious);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    window.addEventListener('DOMContentLoaded', () => {
        loadFlashcards();
        renderFlashcards();
    });

})();