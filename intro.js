const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');

easyButton.addEventListener('click', function () {
    window.location.href = 'joc1.html';
});

mediumButton.addEventListener('click', function () {
    window.location.href = 'joc2.html';
});

hardButton.addEventListener('click', function () {
    window.location.href = 'joc3.html';
});

