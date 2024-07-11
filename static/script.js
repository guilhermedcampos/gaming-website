$(document).ready(function() {
    const symbols = ['J', 'K', 'Q', 'A', '10', 'SYM1', 'SYM2', 'SYM3', 'SYM4'];
    let coinCount = 999999;
    let totalRewards = 0;
    let totalSpent = 0;
    let spinning = false;
    const reelCount = 5;
    const finalSymbolsArray = Array.from({ length: reelCount }, () => Array(3).fill(''));

    function updateCoinCount() {
        $('#coinCount').text(coinCount);
    }

    function updateSessionInfo() {
        $('#totalRewards').text('Total Rewards: ' + totalRewards);
        $('#totalSpent').text('Total Spent: ' + totalSpent);
    }

    $('#incrementCoinsButton').click(function() {
        coinCount += 10;
        updateCoinCount();
    });

    $('#spinButton').click(function() {
        if (coinCount < 10 || spinning) return;

        coinCount -= 10;
        totalSpent += 10;
        updateCoinCount();
        updateSessionInfo();
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
                    let symbol = $(this).children().eq(i + 20).text();
                    finalSymbols.push(symbol);
                }

                finalSymbolsArray[reelIndex] = finalSymbols;

                if (reelIndex === reelCount - 1) {
                    spinning = false;
                    $('#spinButton').prop('disabled', false);
                    const reward = evaluateBonuses();
                    coinCount += reward;
                    totalRewards += reward;
                    updateCoinCount();
                    updateSessionInfo();

                    // Print final symbols to console
                    printFinalSymbols();
                }
            });
        }

        for (let i = 0; i < reelCount; i++) {
            spinReel(i, 1000 + i * 300);
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
            '10': { 2: 10 ,3: 10, 4: 25, 5: 100 },
            'A': { 2: 10 ,3: 10, 4: 25, 5: 100 },
            'Q': { 2: 10 ,3: 10, 4: 25, 5: 100 },
            'K': { 2: 10 ,3: 10, 4: 25, 5: 100 },
            'J': { 2: 10 ,3: 10, 4: 25, 5: 100 },
            'SYM1': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM2': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM3': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM4': { 2: 40, 3: 250, 4: 2000, 5: 5000 }
        };

        // Check for horizontal wins
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
                console.log(`Horizontal win: Row ${row}, Symbol ${startSymbol}, Count ${count}, Reward ${rewards[startSymbol][count]}`);
            }
        }

        // Check for diagonal wins (top-left to bottom-right)
        let startSymbol = finalSymbolsArray[0][0];
        if (startSymbol) {
            let count = 1;
            for (let i = 1; i < reelCount && i < 3; i++) {
                if (finalSymbolsArray[i][i] === startSymbol) {
                    count++;
                } else {
                    break;
                }
            }
            if (rewards[startSymbol] && rewards[startSymbol][count]) {
                highlightDiagonalWin(0, count, true);
                totalReward += rewards[startSymbol][count];
                console.log(`Diagonal win (\\): Symbol ${startSymbol}, Count ${count}, Reward ${rewards[startSymbol][count]}`);
            }
        }

        // Check for diagonal wins (bottom-left to top-right)
        startSymbol = finalSymbolsArray[0][2];
        if (startSymbol) {
            let count = 1;
            for (let i = 1; i < reelCount && i < 3; i++) {
                if (finalSymbolsArray[i][2 - i] === startSymbol) {
                    count++;
                } else {
                    break;
                }
            }
            if (rewards[startSymbol] && rewards[startSymbol][count]) {
                highlightDiagonalWin(2, count, false);
                totalReward += rewards[startSymbol][count];
                console.log(`Diagonal win (/): Symbol ${startSymbol}, Count ${count}, Reward ${rewards[startSymbol][count]}`);
            }
        }

        return totalReward;
    }

    function highlightWinningLine(row, count) {
        for (let col = 0; col < count; col++) {
            $(`.reel:eq(${col}) .symbols .symbol`).eq(row + 20).addClass('winning-line');
        }
    }

    function highlightDiagonalWin(startRow, count, isDescending) {
        for (let i = 0; i < count; i++) {
            let rowIndex = isDescending ? startRow + i : startRow - i;
            let diagonalClass = isDescending ? 'winning-diagonal-desc' : 'winning-diagonal-asc';
            $(`.reel:eq(${i}) .symbols .symbol`).eq(rowIndex + 20).addClass(diagonalClass);
        }
    }

    function printFinalSymbols() {
        let output = "";
        finalSymbolsArray.forEach((reel, index) => {
            output += `R${index + 1}: (${reel.join(', ')}) `;
        });
        console.log(output);
    }
});
