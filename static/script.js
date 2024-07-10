$(document).ready(function() {
    const symbols = ['J', 'K', 'Q', 'A', '10', 'SYM1', 'SYM2', 'SYM3', 'SYM4'];
    let coinCount = 0;
    let spinning = false;
    const reelCount = 5;
    const finalSymbolsArray = Array.from({ length: reelCount }, () => Array(3).fill(''));

    function updateCoinCount() {
        $('#coinCount').text(coinCount);
    }

    $('#incrementCoinsButton').click(function() {
        coinCount += 10;
        updateCoinCount();
    });

    $('#spinButton').click(function() {
        if (coinCount < 10 || spinning) return;

        coinCount -= 10;
        updateCoinCount();
        spinning = true;
        $('#spinButton').prop('disabled', true);

        const reels = $('.reel .symbols');
        const probabilities = generateProbabilities();

        function spinReel(reelIndex, spinTime) {
            const symbolsContainer = $(reels[reelIndex]);
            let newSymbols = [];

            for (let i = 0; i < 30; i++) {
                let randomSymbol = getRandomSymbol(probabilities);
                newSymbols.push(`<div class="symbol">${randomSymbol}</div>`);
            }

            symbolsContainer.html(newSymbols.join(''));
            symbolsContainer.css('top', '0');

            symbolsContainer.animate({ top: '-3000px' }, spinTime, 'linear', function() {
                let finalSymbols = [];
                for (let i = 0; i < 3; i++) {
                    let symbol = $(this).children().eq(i + 27).text();
                    finalSymbols.push(symbol);
                }

                finalSymbolsArray[reelIndex] = finalSymbols;

                if (reelIndex === reelCount - 1) {
                    spinning = false;
                    $('#spinButton').prop('disabled', false);
                    const reward = evaluateBonuses();
                    coinCount += reward;
                    updateCoinCount();
                }
            });
        }

        for (let i = 0; i < reelCount; i++) {
            spinReel(i, 1000 + i * 300); // Reduced duration for faster spinning
        }
    });

    function generateProbabilities() {
        const probabilities = [];
        for (let i = 0; i < 10; i++) probabilities.push('10', 'A', 'Q', 'K', 'J');
        for (let i = 0; i < 3; i++) probabilities.push('SYM1', 'SYM2', 'SYM3');
        for (let i = 0; i < 1; i++) probabilities.push('SYM4');
        return probabilities;
    }

    function getRandomSymbol(probabilities) {
        return probabilities[Math.floor(Math.random() * probabilities.length)];
    }

    function evaluateBonuses() {
        let totalReward = 0;
        const rewards = {
            '10': { 3: 10, 4: 25, 5: 100 },
            'A': { 3: 10, 4: 25, 5: 100 },
            'Q': { 3: 10, 4: 25, 5: 100 },
            'K': { 3: 10, 4: 25, 5: 100 },
            'J': { 3: 10, 4: 25, 5: 100 },
            'SYM1': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM2': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM3': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM4': { 2: 40, 3: 250, 4: 2000, 5: 5000 }
        };

        for (let row = 0; row < 3; row++) {
            let startSymbol = finalSymbolsArray[0][row];
            if (!startSymbol) continue;

            let count = 1;
            for (let col = 1; col < reelCount; col++) {
                if (finalSymbolsArray[col][row] === startSymbol) {
                    count++;
                } else {
                    break;
                }
            }

            if (rewards[startSymbol] && rewards[startSymbol][count]) {
                highlightWinningLine(row, count);
                totalReward += rewards[startSymbol][count];
            }
        }

        return totalReward;
    }

    function highlightWinningLine(row, count) {
        for (let col = 0; col < count; col++) {
            $(`.reel:eq(${col}) .symbols .symbol`).eq(row + 27).addClass('winning');
        }
    }
});
