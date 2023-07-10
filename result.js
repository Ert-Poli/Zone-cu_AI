window.onload = function() {
    // Afiseaza rezultatul jocului
    let gameResult = sessionStorage.getItem('gameResult');
    document.getElementById('game-result').textContent = gameResult;

    // Adauga functionalitatea butonului "Joaca din nou"
    document.getElementById('play-again-button').addEventListener('click', function() {
        window.location.href = 'index.html';  
    });
};

