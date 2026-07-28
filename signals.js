// =====================================
// AI Crypto Scalper Pro
// Signal Engine
// Version 1.0
// =====================================

function generateSignal(
     price,
    support,
    resistance,
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

let confidence = 0;

let signal = "WAIT";

let bullish = 0;

let bearish = 0;

let buyReasons = [];

let sellReasons = [];
    
// =============================
// EMA Trend Structure
// =============================

// EMA 9 vs EMA 21
if(ema9 > ema21){

    bullish++;
    score += 5;
    buyReasons.push("EMA9 > EMA21");

}
else{

    bearish++;
    score -= 5;
    sellReasons.push("EMA9 < EMA21");

}

// EMA 21 vs EMA 50
if(ema21 > ema50){

    bullish++;
    score += 10;
    buyReasons.push("EMA21 > EMA50");

}
else{

    bearish++;
    score -= 10;
    sellReasons.push("EMA21 < EMA50");

}

// EMA 50 vs EMA 200
if(ema50 > ema200){

    bullish++;
    score += 20;
    buyReasons.push("EMA50 > EMA200");

}
else{

    bearish++;
    score -= 20;
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
    score += 5;
    buyReasons.push("Strong RSI");

}
else if(rsi >= 45 && rsi < 50){

    bearish++;
    score -= 5;
    sellReasons.push("Weak RSI");

}
else if(rsi >= 35 && rsi < 45){

    bearish++;
    score -= 15;
    sellReasons.push("Bearish RSI");

}
else if(rsi < 35){

    bearish++;
    score -= 20;
    sellReasons.push("Oversold RSI");

}
else if(rsi > 70){

    bearish++;
    score -= 15;
    sellReasons.push("Overbought RSI");

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

    score -= 5;
    sellReasons.push("Weak Trend - No Momentum");

}
    
// =============================
// MACD
// =============================

if(macd > 1){

    bullish++;
    score += 20;
    buyReasons.push("Strong Bullish MACD");

}
else if(macd > 0){

    bullish++;
    score += 10;
    buyReasons.push("Bullish MACD");

}
else if(macd >= -1 && macd < 0){

    bearish++;
    score -= 10;
    sellReasons.push("Bearish MACD");

}
else{

    bearish++;
    score -= 20;
    sellReasons.push("Strong Bearish MACD");

}
    
   // =============================
// Volume
// =============================

if(volume >= 2){

    bullish++;
    score += 15;
    buyReasons.push("Very High Volume");

}
else if(volume >= 1.5){

    bullish++;
    score += 10;
    buyReasons.push("High Volume");

}
else if(volume >= 1.2){

    bullish++;
    score += 5;
    buyReasons.push("Healthy Volume");

}
else if(volume >= 0.8){

    score -= 5;
    sellReasons.push("Low Volume");

}
else{

    score -= 5;
    sellReasons.push("Very Low Volume");

}

// =============================
// Multi Timeframe Filter
// =============================

if(trend1h !== trend4h){

    score -= 5;

    buyReasons.push("MTF Conflict");

}
else{

    score += 10;

}   
     
// =============================
// Final Signal Decision V3
// =============================

const trendConfirmed =
(trend1h === "Bullish" && trend4h === "Bullish");

const sellTrendConfirmed =
(trend1h === "Bearish" && trend4h === "Bearish");

// STRONG BUY
if(

    bullish >= 6 &&
    score >= 55 &&
    macd > 0 &&
    rsi >= 55 &&
    adx >= 25 &&
    volume >= 1 &&
    trendConfirmed

){

    signal = "STRONG BUY";

}

// BUY
else if(

    bullish >= 4 &&
    score >= 30 &&
    macd > 0 &&
    rsi >= 50 &&
    trend4h === "Bullish"

){

    signal = "BUY";

}

// STRONG SELL
else if(

    bearish >= 6 &&
    score <= -55 &&
    macd < 0 &&
    rsi <= 45 &&
    adx >= 25 &&
    volume >= 1 &&
    sellTrendConfirmed

){

    signal = "STRONG SELL";

}

// SELL
else if(

    bearish >= 4 &&
    score <= -30 &&
    macd < 0 &&
    rsi <= 50 &&
    trend4h === "Bearish"

){

    signal = "SELL";

}

else{

    signal = "WAIT";

}
     // =============================
// AI Confidence Engine V2
// =============================

confidence = Math.abs(score);

// Strong Trend Bonus
if(adx >= 35){

    confidence += 5;

}

// High Volume Bonus
if(volume >= 1.5){

    confidence += 5;

}

// Multi Timeframe Confirmation
if(signal === "BUY"){

    if(trend1h === "Bullish") confidence += 5;
    if(trend4h === "Bullish") confidence += 5;

}

if(signal === "SELL"){

    if(trend1h === "Bearish") confidence += 5;
    if(trend4h === "Bearish") confidence += 5;

}

// Pattern Bonus
if(pattern === "Bullish Engulfing"){

    score += 10;
    confidence += 5;

}

if(pattern === "Bearish Engulfing"){

    score -= 10;
    confidence += 5;

}
// ATR Filter
if(atr < 0.5){

    confidence -= 10;

}

// Support / Resistance Filter
if(signal === "BUY" && resistance > 0){

    const distance = ((resistance - price) / price) * 100;

    if(distance < 1){

        confidence -= 15;

    }

}

if(signal === "SELL" && support > 0){

    const distance = ((price - support) / price) * 100;

    if(distance < 1){

        confidence -= 15;

    }

}

// =============================
// WAIT Confidence Filter
// =============================

if(signal === "WAIT"){

    confidence = Math.min(confidence,40);

}    
confidence = Math.max(0, Math.min(100, confidence));

return{

    signal,

    confidence

};

}
