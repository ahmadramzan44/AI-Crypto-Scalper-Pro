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
// ==============================
// RSI Calculator
// ==============================

function calculateRSI(prices, period = 14) {

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {

        let change = prices[i] - prices[i - 1];

        if (change >= 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }

    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < prices.length; i++) {

        let change = prices[i] - prices[i - 1];

        let gain = change > 0 ? change : 0;
        let loss = change < 0 ? Math.abs(change) : 0;

        avgGain = ((avgGain * (period - 1)) + gain) / period;
        avgLoss = ((avgLoss * (period - 1)) + loss) / period;

    }

    if (avgLoss === 0) {
        return 100;
    }

    const rs = avgGain / avgLoss;

    return 100 - (100 / (1 + rs));

}
// ==============================
// MACD
// ==============================

function calculateMACD(prices) {

    const ema12 = getEMA(prices, 12);
    const ema26 = getEMA(prices, 26);

    return ema12 - ema26;

}
// ==============================
// ATR (Average True Range)
// ==============================

function calculateATR(candles, period = 14) {

    if (candles.length < period + 1) {
        return 0;
    }

    let trueRanges = [];

    for (let i = 1; i < candles.length; i++) {

        const high = parseFloat(candles[i][2]);
        const low = parseFloat(candles[i][3]);
        const prevClose = parseFloat(candles[i - 1][4]);

        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );

        trueRanges.push(tr);
    }

    const recentTR = trueRanges.slice(-period);

    const atr =
        recentTR.reduce((sum, value) => sum + value, 0) / period;

    return atr;

}
