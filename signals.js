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
console.log("====== INPUTS ======");
console.log({
    volume,
    volumeType: typeof volume,
    rsi,
    macd,
    ema9,
    ema21,
    ema50,
    ema200,
    trend1h,
    trend4h
});
console.log("===== generateSignal CALLED =====");
console.log("Volume received:", volume);
console.log("Volume >= 0.10 =", volume >= 0.10);
console.log("Volume >= 0.15 =", volume >= 0.15);
console.log("typeof volume =", typeof volume);
console.trace("generateSignal called from");
console.log("ema9 > ema21 =", ema9 > ema21);
console.log("ema21 > ema50 =", ema21 > ema50);
console.log("ema50 > ema200 =", ema50 > ema200);

console.log("RSI =", rsi);
console.log("MACD =", macd);
console.log("ADX =", adx);

console.log("Trend1H =", trend1h);
console.log("Trend4H =", trend4h);
console.log("Pattern =", pattern);
     
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
console.log("ema9 =", ema9);
console.log("ema21 =", ema21);
console.log("ema50 =", ema50);
console.log("ema200 =", ema200);

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
console.log("After RSI");
console.log({
    score,
    bullish,
    bearish
});
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

    bullish++;
    score += 5;
    buyReasons.push("RSI Recovering");

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
else if(rsi > 80){

    bearish++;
    score -= 5;
    sellReasons.push("Extreme Overbought");

}
    
// =============================
// ADX
// =============================
console.log("After ADX");
console.log({
    score,
    bullish,
    bearish
});
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
console.log("After MACD");
console.log({
    score,
    bullish,
    bearish
});
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
console.log("After Volume");
console.log({
    score,
    bullish,
    bearish
});
if(volume >= 0.50){

    bullish++;
    score += 10;
    buyReasons.push("High Volume");

}
else if(volume >= 0.20){

    bullish++;
    score += 5;
    buyReasons.push("Healthy Volume");

}
else if(volume >= 0.10){

    score += 0;
    buyReasons.push("Normal Volume");

}
else{

    bearish++;
    score -= 5;
    sellReasons.push("Very Low Volume");

}
     
// =============================
// Pattern Bonus
// =============================
console.log("After Pattern");
console.log({
    score,
    bullish,
    bearish
});
if(pattern === "Bullish Engulfing"){

    bullish++;
    score += 10;
    confidence += 5;
    buyReasons.push("Bullish Engulfing");

}
else if(pattern === "Hammer"){

    bullish++;
    score += 8;
    confidence += 4;
    buyReasons.push("Hammer");

}
else if(pattern === "Morning Star"){

    bullish++;
    score += 10;
    confidence += 5;
    buyReasons.push("Morning Star");

}
else if(pattern === "Bearish Engulfing"){

    bearish++;
    score -= 10;
    confidence += 5;
    sellReasons.push("Bearish Engulfing");

}
else if(pattern === "Shooting Star"){

    bearish++;
    score -= 8;
    confidence += 4;
    sellReasons.push("Shooting Star");

}
else if(pattern === "Evening Star"){

    bearish++;
    score -= 10;
    confidence += 5;
    sellReasons.push("Evening Star");

}
// =============================
// Multi Timeframe Filter
// =============================

if(trend1h === trend4h){

    score += 10;

}
     
// =============================
// Final Signal Decision V4 (DEBUG)
// =============================

const trendConfirmed =
(trend1h === "Bullish" && trend4h === "Bullish");

const sellTrendConfirmed =
(trend1h === "Bearish" && trend4h === "Bearish");

console.log("========== SIGNAL DEBUG ==========");
console.log({
    bullish,
    bearish,
    score,
    macd,
    rsi,
    adx,
    volume,
    trend1h,
    trend4h,
    pattern
});
console.log({
    strongBuyBullish: bullish >= 5,
    strongBuyScore: score >= 40,
    strongBuyMacd: macd > 0,
    strongBuyAdx: adx >= 20,
    strongBuyVolume: volume >= 0.15,
    strongBuyTrend: trend4h === "Bullish",
    strongBuyTrend1h: trend1h === "Bullish"
});

console.log({
    buyBullish: bullish >= 4,
    buyScore: score >= 20,
    buyMacd: macd > 0,
    buyAdx: adx >= 15,
    buyVolume: volume >= 0.10,
    buyTrend: trend4h === "Bullish",
    buyTrend1h: trend1h === "Bullish"
});

  console.log({
    strongSellBearish: bearish >= 5,
    strongSellScore: score <= -40,
    strongSellMacd: macd < 0,
    strongSellAdx: adx >= 20,
    strongSellVolume: volume >= 0.15,
    strongSellTrend: trend4h === "Bearish"
});

console.log({
    sellBearish: bearish >= 4,
    sellScore: score <= -20,
    sellMacd: macd < 0,
    sellAdx: adx >= 15,
    sellVolume: volume >= 0.10,
    sellTrend: trend4h === "Bearish"
});     
     
// STRONG BUY
if(

    bullish >= 5 &&
    score >= 40 &&
    macd > 0 &&
    adx >= 20 &&
    volume >= 0.15 &&
    trend1h === "Bullish"

){

    console.log("✅ STRONG BUY PASSED");

    signal = "STRONG BUY";

}

// BUY
else if(

    bullish >= 4 &&
    score >= 20 &&
    macd > 0 &&
    adx >= 15 &&
    volume >= 0.10 &&
    trend1h === "Bullish"

){

    console.log("✅ BUY PASSED");

    signal = "BUY";

}

// STRONG SELL
else if(

bearish >= 5 &&
score <= -35 &&
macd <= 0 &&
adx >= 20 &&
trend1h === "Bearish"

){

    console.log("SELL CHECK", {
    bearish,
    score,
    macd,
    adx,
    volume,
    trend4h
}); 
     
    console.log("✅ STRONG SELL PASSED");

    signal = "STRONG SELL";

}

// SELL
else if(

bearish >= 4 &&
score <= -15 &&
macd <= 0 &&
adx >= 15 &&
trend1h === "Bearish"

){

    console.log(">>> SELL BLOCK ENTERED"); 

    console.log("SELL CHECK", {
        bearish,
        score,
        macd,
        adx,
        volume,
        trend4h
    }); 

    console.log("Exact score =", score.toFixed(10));
     
    console.log("✅ SELL PASSED");

    signal = "SELL";

}

else{

    console.log("❌ NO SIGNAL");
    signal = "WAIT";

}
     
console.log("Score:", score);
console.log("Bullish:", bullish);
console.log("Bearish:", bearish);
console.log("Pattern:", pattern);
     
// =============================
// AI Confidence Engine V2
// =============================

confidence = 50 + (score / 2);

// Strong Signal Bonus
if(signal === "STRONG BUY" || signal === "STRONG SELL"){

    confidence += 35;

}
else if(signal === "BUY" || signal === "SELL"){

    confidence += 20;

}
else{

    confidence -= 20;

}

// Strong Trend Bonus
if(adx >= 35){

    confidence += 5;

}

// High Volume Bonus
if(volume >= 0.30){

    confidence += 5;

}

// RSI Safety
if(rsi > 80){

    confidence -= 10;

}

if(rsi < 20){

    confidence -= 10;

}

// Multi-Timeframe Confirmation (sirf 1H)
if(signal.includes("BUY") && trend1h === "Bullish"){

    confidence += 5;

}

if(signal.includes("SELL") && trend1h === "Bearish"){

    confidence += 5;

}

// ATR Filter
if(atr < 0.5){

    confidence -= 5;

}

// WAIT Filter
if(signal === "WAIT"){

    confidence = Math.min(confidence,40);

}

confidence = Math.max(0, Math.min(100, confidence));

console.log("Confidence =", confidence);

return {

    signal,
    confidence,
    score,
    bullish,
    bearish,
    buyReasons,
    sellReasons

};
}
