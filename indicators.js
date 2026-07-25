// ==============================
// Technical Indicators
// ==============================

// EMA Calculator
function calculateEMA(prices, period) {

    const multiplier = 2 / (period + 1);

    let ema = [];

    let firstEMA = prices
        .slice(0, period)
        .reduce((a, b) => a + b, 0) / period;

    ema.push(firstEMA);

    for (let i = period; i < prices.length; i++) {

        let value =
            ((prices[i] - ema[ema.length - 1]) * multiplier)
            + ema[ema.length - 1];

        ema.push(value);

    }

    return ema;

}

// Latest EMA Value
function getEMA(prices, period) {

    const ema = calculateEMA(prices, period);

    return ema[ema.length - 1];

}
