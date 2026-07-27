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
    trend1h,
    trend4h,
    pattern,
    atr
){

let score = 0;
let bullish = 0;
let bearish = 0;

let buyReasons = [];
let sellReasons = [];
    
// EMA Structure

if(ema9 > ema21){

    bullish += 1;
    score += 10;

    buyReasons.push("EMA9 > EMA21");

}
else{

    bearish += 1;

    sellReasons.push("EMA9 < EMA21");

}

if(ema21 > ema50){

    bullish += 1;
    score += 10;

    buyReasons.push("EMA21 > EMA50");

}
else{

    bearish += 1;

}

if(ema50 > ema200){

    bullish += 1;
    score += 20;

    buyReasons.push("EMA50 > EMA200");

}
else{

    bearish += 1;

    sellReasons.push("EMA50 < EMA200");

}

   // =============================
// RSI
// =============================

if(rsi >= 55 && rsi <= 65){

    bullish++;

    score += 20;

    buyReasons.push("Healthy RSI");

}
else if(rsi >= 50 && rsi < 55){

    bullish++;

    score += 10;

    buyReasons.push("RSI Improving");

}
else if(rsi > 65 && rsi <= 70){

    bullish++;

    score += 10;

    buyReasons.push("RSI Strong");

}
else if(rsi < 45){

    bearish++;

    sellReasons.push("Weak RSI");

}
    
// =============================
// ADX
// =============================

if(adx >= 35){

    bullish++;

    score += 20;

    buyReasons.push("Very Strong Trend");

}
else if(adx >= 25){

    bullish++;

    score += 10;

    buyReasons.push("Strong Trend");

}
else if(adx >= 20){

    score += 5;

    buyReasons.push("Moderate Trend");

}
else{

    bearish++;

    sellReasons.push("Weak Trend");

}
    
 // =============================
// MACD
// =============================

if(macd > 1){

    bullish++;

    score += 20;

    buyReasons.push("Strong MACD");

}
else if(macd > 0){

    bullish++;

    score += 10;

    buyReasons.push("Bullish MACD");

}
else if(macd < -1){

    bearish++;

    sellReasons.push("Strong Bearish MACD");

}
else if(macd < 0){

    bearish++;

    sellReasons.push("Bearish MACD");

}

   // =============================
// Volume
// =============================

if(volume >= 2){

    bullish++;

    score += 10;

    buyReasons.push("Very High Volume");

}
else if(volume >= 1.2){

    bullish++;

    score += 5;

    buyReasons.push("Healthy Volume");

}
else{

    bearish++;

    sellReasons.push("Low Volume");

}
    
// =============================
// AI Confidence Engine
// =============================

// Strong Trend Bonus
if(adx >= 35){

    confidence += 5;

}

// High Volume Bonus
if(volume >= 1.5){

    confidence += 5;

}

// 1H Confirmation
if(trend1h === "Bullish" && signal === "BUY"){

    confidence += 5;

}
else if(trend1h === "Bearish" && signal === "SELL"){

    confidence += 5;

}

// 4H Confirmation
if(trend4h === "Bullish" && signal === "BUY"){

    confidence += 5;

}
else if(trend4h === "Bearish" && signal === "SELL"){

    confidence += 5;

}

// Pattern Bonus
if(pattern === "Bullish Engulfing" && signal === "BUY"){

    confidence += 5;

}

if(pattern === "Bearish Engulfing" && signal === "SELL"){

    confidence += 5;

}

// ATR Volatility Filter
if(atr < 0.5){

    confidence -= 10;

}

// Limit Confidence
if(confidence > 100){

    confidence = 100;

}

if(confidence < 0){

    confidence = 0;

}

return{

    signal,

    confidence

};

}
