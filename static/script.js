$(document).ready(function() {
    const symbols = ['J', 'K', 'Q', 'A', '10', 'SYM1', 'SYM2', 'SYM3', 'SYM4', 'BONUS'];
    const symbolImages = {
        'J': 'static/symbols/J.png',
        'K': 'static/symbols/K.png',
        'Q': 'static/symbols/Q.png',
        'A': 'static/symbols/A.png',
        '10': 'static/symbols/10.png',
        'SYM1': 'static/symbols/SYM1.png',
        'SYM2': 'static/symbols/SYM2.png',
        'SYM3': 'static/symbols/SYM3.png',
        'SYM4': 'static/symbols/SYM4.png',
        'BONUS': 'static/symbols/BONUS.png'
    };

    const spinAudio = new Audio('static/audio/wheel-spin.wav');
    const payoutAudio = new Audio('static/audio/payout.wav');

    let coinCount = 999999;
    let totalRewards = 0;
    let totalSpent = 0;
    let spinning = false;
    const reelCount = 5;
    const finalSymbolsArray = Array.from({ length: reelCount }, () => Array(3).fill(''));
    const previewSymbolsArray = Array.from({ length: reelCount }, () => Array(3).fill(''));
    let bonus = false;
    let bonusSpins = 0;

    function updateCoinCount() {
        $('#coinCount').text(coinCount);
    }

    function updateSessionInfo() {
        $('#totalRewards').text('Total Rewards: ' + totalRewards);
        $('#totalSpent').text('Total Spent: ' + totalSpent);
    }

    function updateBonusSpins() {
        $('#spinsLeft').text('Spins left: ' + bonusSpins);
        if (bonusSpins > 0) {
            $('#spinsLeft').show();
        } else {
            $('#spinsLeft').hide();
        }
    }

    function generatePreviewSymbols() {
        for (let reelIndex = 0; reelIndex < reelCount; reelIndex++) {
            let previewSymbols = [];
            for (let i = 0; i < 3; i++) {
                let randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                previewSymbols.push(randomSymbol);
            }
            previewSymbolsArray[reelIndex] = previewSymbols;
        }
    }

    function displayPreviewSymbols() {
        const reels = $('.reel .symbols');
        for (let reelIndex = 0; reelCount; reelIndex++) {
            let symbolsContainer = $(reels[reelIndex]);
            let previewSymbolsHtml = previewSymbolsArray[reelIndex].map(symbol => {
                if (symbolImages[symbol]) {
                    return `<div class="symbol"><img src="${symbolImages[symbol]}" alt="${symbol}"></div>`;
                } else {
                    return `<div class="symbol">${symbol}</div>`;
                }
            }).join('');
            symbolsContainer.html(previewSymbolsHtml);
        }
    }

    function spin() {
        if ((coinCount < 10 && bonusSpins === 0) || spinning || $('#bonusModal').is(':visible')) return;

        if (bonusSpins === 0) {
            coinCount -= 10;
            totalSpent += 10;
        } else {
            bonusSpins--;
            updateBonusSpins();
        }

        updateCoinCount();
        updateSessionInfo();
        spinning = true;
        $('#spinButton').prop('disabled', true);

        const reels = $('.reel .symbols');
        const probabilities = generateProbabilities();

        spinAudio.currentTime = 0;
        spinAudio.play();

        function spinReel(reelIndex, spinTime) {
            const symbolsContainer = $(reels[reelIndex]);
            let newSymbols = [];

            for (let i = 0; i < 30; i++) {
                let randomSymbol = getRandomSymbol(probabilities);
                if (symbolImages[randomSymbol]) {
                    newSymbols.push(`<div class="symbol"><img src="${symbolImages[randomSymbol]}" alt="${randomSymbol}"></div>`);
                } else {
                    newSymbols.push(`<div class="symbol">${randomSymbol}</div>`);
                }
            }

            symbolsContainer.html(newSymbols.join(''));
            symbolsContainer.css('top', '0');

            symbolsContainer.animate({ top: '-3000px' }, spinTime, 'linear', function() {
                let finalSymbols = [];
                for (let i = 0; i < 3; i++) {
                    let symbolElement = $(this).children().eq(i + 20).find('img');
                    let symbol = symbolElement.length ? symbolElement.attr('alt') : $(this).children().eq(i + 20).text();
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
                    printFinalSymbols();

                    if (reward > 0) {
                        payoutAudio.play();
                        $('#rewardMessage').text(`+${reward} coins`).fadeIn().delay(2000).fadeOut();
                    }

                    spinAudio.pause();

                    if (bonusSpins > 0) {
                        setTimeout(spin, 500);  // Add 0.5-second delay before the next bonus spin
                    }
                }
            });
        }

        for (let i = 0; i < reelCount; i++) {
            spinReel(i, 1000 + i * 300);
        }
    }

    $('#spinButton').click(function() {
        spin();
    });

    $(document).keydown(function(event) {
        if ((event.key === ' ' || event.code === 'Space') && !$('#bonusModal').is(':visible')) {
            event.preventDefault();
            spin();
        }
    });

    function generateProbabilities() {
        const probabilities = [];
        for (let i = 0; i < 3; i++) probabilities.push('10', 'A', 'Q', 'K', 'J');
        for (let i = 0; i < 2; i++) probabilities.push('SYM1', 'SYM2', 'SYM3');
        for (let i = 0; i < 1; i++) probabilities.push('SYM4', 'BONUS');
        return probabilities;
    }

    function getRandomSymbol(probabilities) {
        return probabilities[Math.floor(Math.random() * probabilities.length)];
    }

    function evaluateBonuses() {
        let totalReward = 0;
        const rewards = {
            '10': { 2: 10, 3: 10, 4: 25, 5: 100 },
            'A': { 2: 10, 3: 10, 4: 25, 5: 100 },
            'Q': { 2: 10, 3: 10, 4: 25, 5: 100 },
            'K': { 2: 10, 3: 10, 4: 25, 5: 100 },
            'J': { 2: 10, 3: 10, 4: 25, 5: 100 },
            'SYM1': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM2': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM3': { 2: 10, 3: 50, 4: 150, 5: 2000 },
            'SYM4': { 2: 40, 3: 250, 4: 2000, 5: 5000 }
        };

        let bonusCount = 0;

        for (let row = 0; row < 3; row++) {
            let startSymbol = finalSymbolsArray[0][row];
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

        let bonusReels = new Set();
        for (let reel = 0; reel < reelCount; reel++) {
            for (let row = 0; row < 3; row++) {
                if (finalSymbolsArray[reel][row] === 'BONUS') {
                    bonusReels.add(reel);
                    break;
                }
            }
        }

        if (bonusReels.size >= 3) {
            bonus = true;
            triggerBonusEvent();
            console.log('BONUS triggered!');
        } else {
            bonus = false;
        }

        return totalReward;
    }

    function triggerBonusEvent() {
        $('#bonusModal').show();
    }

    $('#startBonusButton').click(function() {
        bonusSpins = 10;
        $('#bonusModal').hide();
        updateBonusSpins();
        setTimeout(spin, 500);  // Start the first bonus spin with 0.5-second delay
    });

    function highlightWinningLine(row, count) {
        for (let col = 0; col < count; col++) {
            let symbolElement = $(`.reel:eq(${col}) .symbols .symbol`).eq(row + 20);
            if (col === 0) {
                symbolElement.addClass('winning-line-v2');
            } else {
                symbolElement.addClass('winning-line');
            }
        }
    }

    function highlightDiagonalWin(startRow, count, isDescending) {
        for (let i = 0; i < count; i++) {
            let rowIndex = isDescending ? startRow + i : startRow - i;
            let symbolElement = $(`.reel:eq(${i}) .symbols .symbol`).eq(rowIndex + 20);
            let diagonalClass = isDescending ? 'winning-diagonal-desc' : 'winning-diagonal-asc';
            if (i === 0) {
                symbolElement.addClass(`${diagonalClass}-v2`);
            } else {
                symbolElement.addClass(diagonalClass);
            }
        }
    }

    function printFinalSymbols() {
        let output = "";
        finalSymbolsArray.forEach((reel, index) => {
            output += `R${index + 1}: (${reel.join(', ')}) `;
        });
        console.log(output);
    }

    generatePreviewSymbols();
    displayPreviewSymbols();
});
