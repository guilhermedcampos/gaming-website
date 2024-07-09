$(document).ready(function() {
    const symbols = ['10', 'A', 'Q', 'K', 'J', 'SYM1', 'SYM2', 'SYM3', 'SYM4'];
    const probabilities = {
        '10': 2,
        'A': 2,
        'Q': 2,
        'K': 2,
        'J': 2,
        'SYM1': 1,
        'SYM2': 1,
        'SYM3': 1,
        'SYM4': 0.3
    };

    const spinDuration = 3000; // Duration for each spin (in milliseconds)
    const symbolHeight = 100; // Height of each symbol (in pixels)
    const reelCount = 5; // Number of reels
    const symbolsPerReel = 30; // Number of symbols per reel to simulate rolling effect

    let spinning = false;
    let finalSymbolsArray = []; // Array to store final symbols of each reel

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

    // Spin button click event
    $('#spinButton').click(function() {
        if (!spinning) {
            spinning = true;
            finalSymbolsArray = []; // Reset the final symbols array

            // Generate symbol arrays for each reel
            for (let i = 1; i <= reelCount; i++) {
                let symbolArray = generateSymbolArray();
                displaySymbols('reel' + i, symbolArray);
                animateReel('reel' + i, symbolArray, i - 1);
            }

            setTimeout(function() {
                spinning = false;
                console.log("Final symbols: ", finalSymbolsArray);
                // Here you can use finalSymbolsArray to determine line combinations and give prizes
            }, spinDuration);
        }
    });
});
