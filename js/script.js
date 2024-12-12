// $('.box').transition({
//     perspective: '100px',
//     rotateY: '180deg'
//   });
$(document).ready(function () {
    function getRandomCards(totalCards, numberOfCards) {
        const randomIndices = new Set();
        while (randomIndices.size < numberOfCards) {
            const randomIndex = Math.floor(Math.random() * totalCards) + 1;
            randomIndices.add(randomIndex);
        }
        return Array.from(randomIndices).map(id => ({ id, img: `./img/Pokemon${id}.png` }));
    }

    const totalCards = 200;
    const numberOfCardsToSelect = 8;

    let handicap = 0;
    let matchedPairs = 0;
    let flippedCards = [];

    function initGame() {
        // Réinitialiser les variables
        handicap = 0;
        matchedPairs = 0;
        flippedCards = [];

        // Réinitialiser le plateau de jeu
        $('#game-board').empty();

        // Générer les cartes
        const selectedCards = getRandomCards(totalCards, numberOfCardsToSelect);
        let cards = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);

        cards.forEach((card) => {
            const cardElement = `
                <div class="card" data-id="${card.id}">
                    <div class="card-inner">
                        <div class="card-front" style="background-image: url('${card.img}')"></div>
                        <div class="card-back"></div>
                    </div>
                </div>
            `;
            $('#game-board').append(cardElement);
        });

        // Mettre à jour le compteur de handicap
        updateHandicapCounter();

        // Réattacher l'événement de clic aux cartes
        $('.card').on('click', handleCardClick);
    }

    function updateHandicapCounter() {
        $('#handicap-counter').text(`Handicap : ${handicap}`);
    }

    function handleCardClick() {
        const $this = $(this);

        if ($this.hasClass('flipped') || $this.hasClass('removed') || flippedCards.length === 2) return;

        $this.addClass('flipped');
        flippedCards.push($this);

        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            const firstId = firstCard.data('id');
            const secondId = secondCard.data('id');

            if (firstId === secondId) {
                // Si c'est une paire
                setTimeout(() => {
                    firstCard.add(secondCard).addClass('removed');
                    matchedPairs++;

                    flippedCards = [];

                    if (matchedPairs === numberOfCardsToSelect - 1) {
                        // Retourner automatiquement les deux dernières cartes
                        $('.card:not(.flipped)').addClass('flipped');

                        setTimeout(() => {
                            showRestartMessage();
                        }, 600);
                    }
                }, 600);
            } else {
                // Si ce n'est pas une paire, augmenter le handicap
                handicap++;
                updateHandicapCounter();

                setTimeout(() => {
                    firstCard.add(secondCard).removeClass('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    }

    function showRestartMessage() {
        // Afficher un message de victoire avec le score et un bouton pour recommencer
        const restartMessage = `
            <div id="restart-message">
                <h2>Félicitations !</h2>
                <p>Vous avez terminé en <strong>${handicap}</strong> coups.</p>
                <button id="restart-button">Recommencer</button>
            </div>
        `;
        $('body').append(restartMessage);

        // Gestion du clic sur le bouton "Recommencer"
        $('#restart-button').on('click', function () {
            $('#restart-message').remove(); // Supprimer le message
            initGame(); // Relancer le jeu
        });
    }

    // Initialiser le jeu
    initGame();
});