$(document).ready(function() {
    const symbols = ['10', 'A', 'Q', 'K', 'J', 'SYM1', 'SYM2', 'SYM3', 'SYM4'];
    const probabilities = {
        '10': 3,
        'A': 3,
        'Q': 3,
        'K': 3,
        'J': 3,
        'SYM1': 1,
        'SYM2': 1,
        'SYM3': 1,
        'SYM4': 0.3
    };

    const spinDuration = 3000; // Duration for each spin (in milliseconds)
    const symbolHeight = 100; // Height of each symbol (in pixels)
    const reelCount = 5; // Number of reels
    const symbolsPerReel = 30; // Number of symbols per reel to simulate rolling effect
    const spinCost = 10; // Cost per spin in coins

    let spinning = false;
    let finalSymbolsArray = []; // Array to store final symbols of each reel
    let coins = 0; // Initial coin count

    // Function to update coin display
    function updateCoinDisplay() {
        $('#coinCount').text(coins);
    }

    // Function to enable or disable the spin button
    function setSpinButtonState(enabled) {
        $('#spinButton').prop('disabled', !enabled);
    }

    // Function to generate a weighted array of symbols based on probabilities
    function generateWeightedSymbolArray() {
        let weightedSymbols = [];

        for (let symbol in probabilities) {
            let count = probabilities[symbol] * 10; // Scale probabilities for better distribution
            for (let i = 0; i < count; i++) {
                weightedSymbols.push(symbol);
            }
        }

        return weightedSymbols;
    }

    // Function to generate a large array of symbols for a reel
    function generateSymbolArray() {
        let weightedSymbols = generateWeightedSymbolArray();
        let symbolArray = [];
        for (let i = 0; i < symbolsPerReel; i++) {
            let randomIndex = Math.floor(Math.random() * weightedSymbols.length);
            symbolArray.push(weightedSymbols[randomIndex]);
        }
        return symbolArray;
    }

    // Function to display symbols on a reel
    function displaySymbols(reelId, symbolArray) {
        let $symbolsContainer = $('#' + reelId + ' .symbols');
        $symbolsContainer.empty();
        symbolArray.forEach(function(symbol) {
            $symbolsContainer.append('<div class="symbol">' + symbol + '</div>');
        });
    }

    // Function to animate a single reel
    function animateReel(reelId, symbolArray, reelIndex) {
        let $symbolsContainer = $('#' + reelId + ' .symbols');
        let totalSymbols = symbolArray.length;

        // Create a continuous animation by appending the symbol array multiple times
        for (let i = 0; i < 3; i++) {
            symbolArray.forEach(function(symbol) {
                $symbolsContainer.append('<div class="symbol">' + symbol + '</div>');
            });
        }

        // Calculate the total height of the symbols container
        let totalHeight = totalSymbols * symbolHeight * 3;

        // Start the animation
        $symbolsContainer.css({
            'animation': `spin ${spinDuration}ms linear infinite`
        });

        // Stop animation after spinDuration and display the final symbols
        setTimeout(function() {
            $symbolsContainer.css('animation', 'none');
            let stopIndex = Math.floor(Math.random() * (totalSymbols - 3));
            let finalSymbols = symbolArray.slice(stopIndex, stopIndex + 3);

            // Store the final symbols in the finalSymbolsArray
            finalSymbolsArray[reelIndex] = finalSymbols;

            // Ensure the final symbols are displayed correctly
            $symbolsContainer.empty();
            finalSymbols.forEach(function(symbol) {
                $symbolsContainer.append('<div class="symbol">' + symbol + '</div>');
            });

            // Adjust the position to display the final symbols
            $symbolsContainer.css('transform', `translateY(0)`);
        }, spinDuration);
    }

    // Function to evaluate bonuses and calculate rewards
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

        // Iterate over each row
        for (let row = 0; row < 3; row++) {
            // Check for consecutive symbols starting from the first reel
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
                totalReward += rewards[startSymbol][count];
            }
        }

        return totalReward;
    }

    // Spin button click event
    $('#spinButton').click(function() {
        if (!spinning && coins >= spinCost) {
            spinning = true;
            setSpinButtonState(false); // Disable the spin button during the spin
            coins -= spinCost; // Deduct cost per spin
            updateCoinDisplay();
            finalSymbolsArray = []; // Reset the final symbols array

            // Generate symbol arrays for each reel
            for (let i = 1; i <= reelCount; i++) {
                let symbolArray = generateSymbolArray();
                displaySymbols('reel' + i, symbolArray);
                animateReel('reel' + i, symbolArray, i - 1);
            }

            setTimeout(function() {
                spinning = false;
                setSpinButtonState(true); // Enable the spin button after the spin
                console.log("Final symbols: ", finalSymbolsArray);

                // Evaluate bonuses and update coins
                let reward = evaluateBonuses();
                if (reward > 0) {
                    coins += reward;
                    alert("You won " + reward + " coins!");
                    updateCoinDisplay();
                }
            }, spinDuration);
        } else if (coins < spinCost) {
            alert("Not enough coins to spin!");
        }
    });

    // Increment coins button click event
    $('#incrementCoinsButton').click(function() {
        coins += 10; // Add 10 coins (10 cents)
        updateCoinDisplay();
    });

    // Initial coin display update
    updateCoinDisplay();
});
