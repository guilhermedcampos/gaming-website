$(document).ready(function() {
    const symbols = ['J', 'K', 'Q', 'A', '10', 'SYM1', 'SYM2', 'SYM3', 'SYM4'];
    const numSymbols = symbols.length;
    const spinDuration = 3000; // Duration for each spin (in milliseconds)
    const symbolHeight = 100; // Height of each symbol (in pixels)
    const reelCount = 5; // Number of reels

    let spinning = false;

    // Function to generate a large array of symbols for a reel
    function generateSymbolArray() {
        let symbolArray = [];
        // Generate a large number of symbols to create a rolling effect
        for (let i = 0; i < 30; i++) {
            let randomIndex = Math.floor(Math.random() * numSymbols);
            symbolArray.push(symbols[randomIndex]);
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
    function animateReel(reelId, symbolArray) {
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

        $symbolsContainer.css({
            'animation': `spin ${spinDuration}ms linear infinite`,
            'transform': `translateY(0)`
        });

        // Stop animation after spinDuration and display the final symbols
        setTimeout(function() {
            $symbolsContainer.css('animation', 'none');
            let stopIndex = Math.floor(Math.random() * (totalSymbols - 3));
            let finalSymbols = symbolArray.slice(stopIndex, stopIndex + 3);
            displaySymbols(reelId, finalSymbols);
            $symbolsContainer.css('transform', `translateY(-${stopIndex * symbolHeight}px)`);
        }, spinDuration);
    }

    // Spin button click event
    $('#spinButton').click(function() {
        if (!spinning) {
            spinning = true;
            // Generate symbol arrays for each reel
            for (let i = 1; i <= reelCount; i++) {
                let symbolArray = generateSymbolArray();
                displaySymbols('reel' + i, symbolArray);
                animateReel('reel' + i, symbolArray);
            }

            setTimeout(function() {
                spinning = false;
            }, spinDuration);
        }
    });
});
