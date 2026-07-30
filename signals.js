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
    trend,
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

const resistanceDistance =
((resistance - price) / price) * 100;

const supportDistance =
((price - support) / price) * 100;

console.log({
    resistanceDistance,
    supportDistance
});
     
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
if(volume >= 0.30){
    bullish++;
    score += 10;
}
else if(volume >= 0.15){
    bullish++;
    score += 5;
}
else if(volume >= 0.08){
    score += 0;
}
else{
    bearish++;
    score -= 5;
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
    confidence += 5;
    buyReasons.push("Bullish Engulfing");

}
else if(pattern === "Hammer"){

    bullish++;
    confidence += 4;
    buyReasons.push("Hammer");

}
else if(pattern === "Morning Star"){

    bullish++;
    confidence += 5;
    buyReasons.push("Morning Star");

}
else if(pattern === "Bearish Engulfing"){

    bearish++;
    confidence += 5;
    sellReasons.push("Bearish Engulfing");

}
else if(pattern === "Shooting Star"){

    bearish++;
    confidence += 4;
    sellReasons.push("Shooting Star");

}
else if(pattern === "Evening Star"){

    bearish++;
    confidence += 5;
    sellReasons.push("Evening Star");

}

// =============================
// Entry Distance Filter (15m Scalping)
// =============================

const distanceToResistance =
((resistance - price) / price) * 100;

const distanceToSupport =
((price - support) / price) * 100;

// BUY ke liye resistance bohat qareeb hai
if(distanceToResistance < 0.40){

    score -= 5;
    buyReasons.push("Resistance Too Close");

}

// SELL ke liye support bohat qareeb hai
if(distanceToSupport < 0.40){

    score -= 5;
    sellReasons.push("Support Too Close");

}

console.log({
    distanceToResistance,
    distanceToSupport
});     
// =============================
// Multi Timeframe Filter
// =============================

if(trend1h === trend4h){

    score += 10;

}
     
// =============================
// FINAL SIGNAL ENGINE V5
// =============================

// STRONG BUY
const strongBuyPass =
    bullish >= 5 &&
    score >= 55 &&
    macd > 0 &&
    adx >= 25 &&
    volume >= 0.30 &&
    trend === "Bullish" &&
    trend1h === "Bullish" &&
    resistanceDistance >= 0.10;

// BUY
const buyPass =
    bullish >= 4 &&
    score >= 40 &&
    macd > 0 &&
    adx >= 20 &&
    volume >= 0.15 &&
    trend === "Bullish" &&
    trend1h === "Bullish" &&
    resistanceDistance >= 0.10;

// STRONG SELL
const strongSellPass =
    bearish >= 5 &&
    score <= -55 &&
    macd < 0 &&
    adx >= 25 &&
    volume >= 0.30 &&
    trend === "Bearish" &&
    trend1h === "Bearish" &&
    supportDistance >= 0.10;

// SELL
const sellPass =
    bearish >= 4 &&
    score <= -40 &&
    macd < 0 &&
    adx >= 20 &&
    volume >= 0.15 &&
    trend === "Bearish" &&
    trend1h === "Bearish" &&
    supportDistance >= 0.10;


// Final Decision

if (strongBuyPass) {

    signal = "STRONG BUY";

}
else if (buyPass) {

    signal = "BUY";

}
else if (strongSellPass) {

    signal = "STRONG SELL";

}
else if (sellPass) {

    signal = "SELL";

}
else {

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

// Multi-Timeframe Confirmation
if(signal.includes("BUY")){

    if(trend1h === "Bullish"){
        confidence += 5;
    }

    if(trend4h === "Bullish"){
        confidence += 3;
    }

}

if(signal.includes("SELL")){

    if(trend1h === "Bearish"){
        confidence += 5;
    }

    if(trend4h === "Bearish"){
        confidence += 3;
    }

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
