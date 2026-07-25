// ==============================
// AI Signal Engine
// ==============================

function generateSignal(ema9, ema21, ema50, ema200, rsi, macd) {

    let score = 0;

    // EMA Trend
    if (ema9 > ema21) score += 20;
    if (ema21 > ema50) score += 20;
    if (ema50 > ema200) score += 20;

    // RSI
    if (rsi > 50 && rsi < 70) score += 20;

    // MACD
    if (macd > 0) score += 20;

    if (score >= 80) {
        return {
            signal: "BUY",
            confidence: score
        };
    }

    if (score >= 60) {
        return {
            signal: "WAIT",
            confidence: score
        };
    }

    return {
        signal: "SELL",
        confidence: score
    };

}
