// =====================================
// AI Crypto Scalper Pro
// Signal Engine
// Version 1.0
// =====================================

function generateSignal(
    ema9,
    ema21,
    ema50,
    ema200,
    rsi,
    macd,
    volume
){

    let score = 0;

    // EMA Trend (40 Points)

    if(ema9 > ema21) score += 10;

    if(ema21 > ema50) score += 10;

    if(ema50 > ema200) score += 20;

    // RSI (20 Points)

    if(rsi >= 55 && rsi <= 70){

        score += 20;

    }

    // MACD (20 Points)

    if(macd > 0){

        score += 20;

    }

    // Volume (20 Points)

    if(volume > 0){

        score += 20;

    }

    let signal = "WAIT";

    if(score >= 80){

        signal = "BUY";

    }
    else if(score < 40){

        signal = "SELL";

    }

    return {

        signal: signal,
        confidence: score

    };

}
