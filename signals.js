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
    volume,
    adx,
    trend1h
){

    let score = 0;

    // EMA Trend (40 Points)

    if(ema9 > ema21) score += 10;

    if(ema21 > ema50) score += 10;

    if(ema50 > ema200) score += 20;

   // RSI (20 Points)

if(rsi >= 55 && rsi <= 65){

    score += 20;

}
else if(rsi >= 50 && rsi < 55){

    score += 10;

}
else if(rsi > 65 && rsi <= 70){

    score += 10;

}
// ADX (20 Points)

if(adx >= 35){

    score += 20;

}
else if(adx >= 25){

    score += 10;

}
else if(adx >= 20){

    score += 5;

}
  // MACD (20 Points)

if(macd > 1){

    score += 20;

}
else if(macd > 0){

    score += 10;

}

    // Volume (20 Points)

    if(volume > 0){

        score += 20;

    }
if(trend1h === "Bullish"){

    score += 20;

}
else if(trend1h === "Bearish"){

    score -= 20;

}
    let signal = "WAIT";

    if(score >= 80){

        signal = "BUY";

    }
    else if(score < 40){

        signal = "SELL";

    }

    let confidence = score;

// Strong Trend Bonus
if(adx >= 35){

    confidence += 5;

}

// High Volume Bonus
if(volume >= 1.5){

    confidence += 5;

}

// 1H Trend Confirmation
if(trend1h === "Bullish" && signal === "BUY"){

    confidence += 5;

}
else if(trend1h === "Bearish" && signal === "SELL"){

    confidence += 5;

}

// Maximum 100
if(confidence > 100){

    confidence = 100;

}

return{

    signal,

    confidence

};

}
