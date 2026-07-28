// =====================================
// AI Crypto Scalper Pro
// script.js
// Version 1.0
// =====================================

const USERNAME = "admin";
const PASSWORD = "1234";

let autoRefresh = null;

let scannerRefresh = null;

let lastHistorySignal = "";
let lastSignalTime = 0;
const scannerCoins = [

"BTCUSDT",
"ETHUSDT",
"BNBUSDT",
"SOLUSDT",
"XRPUSDT",
"DOGEUSDT",
"ADAUSDT",
"LINKUSDT",
"AVAXUSDT",
"SUIUSDT"

];
loadHistory();
runScanner();
if(Notification.permission !== "granted"){

    Notification.requestPermission();

}
// =============================
// Login
// =============================

function login(){

    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if(user === USERNAME && pass === PASSWORD){

        document.getElementById("login").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

    }
    else{

        alert("Invalid Login");

    }

}
// =============================
// Analyze Coin
// =============================

function analyzeCoin(){

    const symbol =
        document.getElementById("coin")
        .value
        .trim()
        .toUpperCase();

    if(symbol===""){

        alert("Enter Coin Symbol");

        return;

    }

    document.getElementById("coinName").innerText =
        symbol;

    loadChart(symbol);
    
    loadCoin(symbol);

    if(autoRefresh){

        clearInterval(autoRefresh);

    }

    autoRefresh = setInterval(function(){

        loadCoin(symbol);

    },5000);
if(scannerRefresh){

    clearInterval(scannerRefresh);

}

scannerRefresh = setInterval(function(){

    runScanner();

},30000);
}
function clearHistory(){

    const historyBody =
    document.getElementById("historyBody");

    historyBody.innerHTML = "";

    localStorage.removeItem("history");

    lastHistorySignal = "";

}
function loadHistory(){

    const history =
    localStorage.getItem("history");

    if(history){

        document.getElementById("historyBody").innerHTML =
        history;

    }

}
async function runScanner(){

    const body =
    document.getElementById("scannerBody");
const filter =
document.getElementById("scannerFilter").value;
    body.innerHTML = "";
   
    const scannerResults = [];

   for(const coin of scannerCoins){

    try{

        const candles =
        await getCandles(coin,"15m",200);

        const closes =
        candles.map(c => parseFloat(c[4]));

        const price =
closes[closes.length - 1];

const sr =
getSupportResistance(candles);

const support =
sr.support;

const resistance =
sr.resistance;
        const ema9 =
        getEMA(closes,9);

        const ema21 =
        getEMA(closes,21);
        const ema50 =
getEMA(closes,50);

const ema200 =
getEMA(closes,200);

const rsi =
calculateRSI(closes);

const macdData =
calculateMACD(closes);

const macd =
macdData.macd;

const volume =
calculateVolume(candles);

const adx =
calculateADX(candles);
        
const candles1h =
await getCandles(coin,"1h",200);

const closes1h =
candles1h.map(c => parseFloat(c[4]));

const ema50_1h =
getEMA(closes1h,50);

const ema200_1h =
getEMA(closes1h,200);

let trend1h = "Sideways";

if(ema50_1h > ema200_1h){

    trend1h = "Bullish";

}
else if(ema50_1h < ema200_1h){

    trend1h = "Bearish";

}
   
// =============================
// 4H Trend
// =============================

const candles4h =
await getCandles(coin,"4h",200);

const closes4h =
candles4h.map(c => parseFloat(c[4]));

const ema50_4h =
getEMA(closes4h,50);

const ema200_4h =
getEMA(closes4h,200);

let trend4h = "Sideways";

if(ema50_4h > ema200_4h){

    trend4h = "Bullish";

}
else if(ema50_4h < ema200_4h){

    trend4h = "Bearish";

}
const pattern =
detectPattern(candles);
const atr = 1;        
       
const result =
generateSignal(
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
);

let signal =
result.signal;

if(signal === "BUY" && trend1h === "Bullish"){

    signal = "STRONG BUY";

}
else if(signal === "SELL" && trend1h === "Bearish"){

    signal = "STRONG SELL";

}

       const ai =
result.confidence;

        const win =
        ai + "%";

        scannerResults.push({

coin,
signal,
ai,
win

});
    }
   catch(error){

    console.error("Coin:", coin);

    console.error(error);

}

}
scannerResults.sort((a,b)=>b.ai-a.ai);

console.log(scannerResults);
    
if(scannerResults.length === 0){

    console.log("Scanner Results Empty");

    return;

}
    
const bestCoin = scannerResults[0];

document.getElementById("topCoin").innerText =
bestCoin.coin;

document.getElementById("topSignal").innerText =
bestCoin.signal;

document.getElementById("topAI").innerText =
"AI: " + bestCoin.ai;

document.getElementById("topWin").innerText =
"Win: " + bestCoin.win;

for(const item of scannerResults){

    if(filter === "BUY" &&
!item.signal.includes("BUY")){

    continue;

}

if(filter === "SELL" &&
!item.signal.includes("SELL")){

    continue;

}

if(filter === "STRONG" &&
!item.signal.includes("STRONG")){

    continue;

}
    body.insertAdjacentHTML(
    "beforeend",
    `
<tr
class="${item.coin === bestCoin.coin ? 'bestCoin' : ''}"
onclick="selectCoin('${item.coin}')"
style="cursor:pointer;">
onclick="selectCoin('${item.coin}')"
style="cursor:pointer">
    <td
style="cursor:pointer;color:#00e5ff;font-weight:bold;"
onclick="selectCoin('${item.coin}')">

${item.coin}

</td>
    <td class="${
    item.signal.includes("BUY")
    ? "buy"
    : item.signal.includes("SELL")
    ? "sell"
    : "wait"
    }">
    ${item.signal}
    </td>
    <td>${item.ai}</td>
    <td>${item.win}</td>
    </tr>
    `
    );

}

}
function selectCoin(symbol){

    document.getElementById("coin").value = symbol;

    analyzeCoin();

}

function loadChart(symbol){

    document.getElementById("tvChart").innerHTML = "";

    new TradingView.widget({

        "autosize": true,

        "symbol": "BINANCE:" + symbol,

        "interval": "15",

        "timezone": "Etc/UTC",

        "theme": "dark",

        "style": "1",

        "locale": "en",

        "toolbar_bg": "#111",

        "enable_publishing": false,

        "hide_top_toolbar": false,

        "hide_side_toolbar": false,

        "container_id": "tvChart"

    });

}
function sendNotification(title,message){

    if(Notification.permission === "granted"){

        new Notification(title,{

            body: message,
            icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"

        });

    }

}
// =============================
// Load Coin
// =============================

async function loadCoin(symbol){

try{

const ticker =
await getCurrentPrice(symbol);

if(!ticker || ticker.code){

alert("Invalid Coin");

return;

}

const price =
parseFloat(ticker.price);

document.getElementById("price").innerText =
price.toFixed(2);

const candles =
await getCandles(symbol,"15m",200);

const candles1h =
await getCandles(symbol,"1h",200);
const candles4h =
await getCandles(symbol,"4h",200);
console.log("1H Candles:", candles1h);
const closes1h =
candles1h.map(c => parseFloat(c[4]));
const closes4h =
candles4h.map(c => parseFloat(c[4]));

const ema50_4h =
getEMA(closes4h,50);

const ema200_4h =
getEMA(closes4h,200);
const ema50_1h =
getEMA(closes1h,50);

const ema200_1h =
getEMA(closes1h,200);
    
const closes =
candles.map(c=>parseFloat(c[4]));

const ema9 =
getEMA(closes,9);

const ema21 =
getEMA(closes,21);

const ema50 =
getEMA(closes,50);

const ema200 =
getEMA(closes,200);

const rsi =
calculateRSI(closes);

const macdData =
calculateMACD(closes);

console.log(macdData);

const macd =
macdData.macd;

const atr =
calculateATR(candles);

const entryLow =
(price - (atr * 0.20)).toFixed(2);

const entryHigh =
(price + (atr * 0.20)).toFixed(2);

document.getElementById("entryZone").innerText =
entryLow + " - " + entryHigh;

const volume =
calculateVolume(candles);

const adx =
calculateADX(candles);

const sr =
getSupportResistance(candles);

const support =
sr.support;

const resistance =
sr.resistance;

const pattern =
detectPattern(candles);    

document.getElementById("ema9").innerText =
ema9.toFixed(2);

document.getElementById("ema21").innerText =
ema21.toFixed(2);

document.getElementById("ema50").innerText =
ema50.toFixed(2);

document.getElementById("ema200").innerText =
ema200.toFixed(2);

document.getElementById("rsi").innerText =
rsi.toFixed(2);

if(macdData.histogram > 0){

    document.getElementById("macd").innerText =
        "Bullish (" + macd.toFixed(3) + ")";

    document.getElementById("macd").className =
        "buy";

}
else{

    document.getElementById("macd").innerText =
        "Bearish (" + macd.toFixed(3) + ")";

    document.getElementById("macd").className =
        "sell";

}
document.getElementById("volume").innerText =
volume.toFixed(2);

document.getElementById("adx").innerText =
adx.toFixed(1);
if(adx >= 25){

    document.getElementById("trendStrength").innerText =
    "Strong";

    document.getElementById("trendStrength").className =
    "buy";

}
else if(adx >= 20){

    document.getElementById("trendStrength").innerText =
    "Moderate";

    document.getElementById("trendStrength").className =
    "wait";

}
else{

    document.getElementById("trendStrength").innerText =
    "Weak";

    document.getElementById("trendStrength").className =
    "sell";

}
document.getElementById("support").innerText =
sr.support.toFixed(2);

document.getElementById("resistance").innerText =
sr.resistance.toFixed(2);
document.getElementById("pattern").innerText =
pattern;

if(pattern === "Bullish Engulfing"){

    document.getElementById("pattern").className =
    "buy";

}
else if(pattern === "Bearish Engulfing"){

    document.getElementById("pattern").className =
    "sell";

}
else{

    document.getElementById("pattern").className =
    "wait";

}    

const trend =
getTrend(
ema9,
ema21,
ema50,
ema200
);

document.getElementById("trend").innerText =
trend;

let trend1h = "Sideways";

if(ema50_1h > ema200_1h){

    trend1h = "Bullish";

}
else if(ema50_1h < ema200_1h){

    trend1h = "Bearish";

}
console.log("EMA50 1H:", ema50_1h);
console.log("EMA200 1H:", ema200_1h);
console.log("Trend1H:", trend1h);
document.getElementById("trend1h").innerText =
trend1h;

if(trend1h === "Bullish"){

    document.getElementById("trend1h").className = "buy";

}
else if(trend1h === "Bearish"){

    document.getElementById("trend1h").className = "sell";

}
else{

    document.getElementById("trend1h").className = "wait";

}
let trend4h = "Sideways";

if(ema50_4h > ema200_4h){

    trend4h = "Bullish";

}
else if(ema50_4h < ema200_4h){

    trend4h = "Bearish";

}

document.getElementById("trend4h").innerText =
trend4h;

let marketSentiment = "Neutral";

if(
    trend1h === "Bullish" &&
    trend4h === "Bullish"
){

    marketSentiment = "Bullish";

}
else if(
    trend1h === "Bearish" &&
    trend4h === "Bearish"
){

    marketSentiment = "Bearish";

}

document.getElementById("marketSentiment").innerText =
marketSentiment;

if(marketSentiment === "Bullish"){

    document.getElementById("marketSentiment").className =
    "buy";

}
else if(marketSentiment === "Bearish"){

    document.getElementById("marketSentiment").className =
    "sell";

}
else{

    document.getElementById("marketSentiment").className =
    "wait";

}
    
if(trend4h === "Bullish"){

    document.getElementById("trend4h").className = "buy";

}
else if(trend4h === "Bearish"){

    document.getElementById("trend4h").className = "sell";

}
else{

    document.getElementById("trend4h").className = "wait";

}
const result =
generateSignal(
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
);

document.getElementById("signal").innerText =
result.signal;
let finalSignal = result.signal;

// =============================
// Multi-Timeframe Confirmation
// =============================

if(
    finalSignal === "BUY" &&
    (trend1h === "Bearish" || trend4h === "Bearish")
){

    finalSignal = "WAIT";

}

if(
    finalSignal === "SELL" &&
    (trend1h === "Bullish" || trend4h === "Bullish")
){

    finalSignal = "WAIT";

}
    
if(result.signal === "BUY" && trend1h === "Bullish"){

    finalSignal = "STRONG BUY";

}
else if(result.signal === "SELL" && trend1h === "Bearish"){

    finalSignal = "STRONG SELL";

}
if(finalSignal === "STRONG BUY"){

    sendNotification(

        "🚀 STRONG BUY",

        symbol + " is giving a STRONG BUY signal."

    );

}
else if(finalSignal === "STRONG SELL"){

    sendNotification(

        "🔻 STRONG SELL",

        symbol + " is giving a STRONG SELL signal."

    );

}
document.getElementById("signal").innerText =
finalSignal;
aiScore = Math.min(100, aiScore);

document.getElementById("confidence").innerText =
aiScore + "%";
let aiScore = result.confidence;

// 1H Trend Bonus
if(
    (finalSignal.includes("BUY") && trend1h === "Bullish") ||
    (finalSignal.includes("SELL") && trend1h === "Bearish")
){
    aiScore += 10;
}

// 4H Trend Bonus
if(
    (finalSignal.includes("BUY") && trend4h === "Bullish") ||
    (finalSignal.includes("SELL") && trend4h === "Bearish")
){
    aiScore += 10;
}
// Pattern Bonus
if(pattern === "Bullish Engulfing" ||
   pattern === "Bearish Engulfing"){

    aiScore += 10;

}

// Limit to 100
if(aiScore > 100){

    aiScore = 100;

}

document.getElementById("aiScore").innerText =
aiScore + " / 100";
if(aiScore >= 90){

    document.getElementById("aiScore").className = "buy";

}
else if(aiScore >= 70){

    document.getElementById("aiScore").className = "wait";

}
else{

    document.getElementById("aiScore").className = "sell";

}
let tradeStatus = "AVOID";

if(
    aiScore >= 90 &&
    (finalSignal === "STRONG BUY" ||
     finalSignal === "STRONG SELL")
){

    tradeStatus = "SAFE";

}
else if(aiScore >= 70){

    tradeStatus = "CAUTION";

}

document.getElementById("tradeStatus").innerText =
tradeStatus;

if(tradeStatus === "SAFE"){

    document.getElementById("tradeStatus").className =
    "buy";

}
else if(tradeStatus === "CAUTION"){

    document.getElementById("tradeStatus").className =
    "wait";

}
else{

    document.getElementById("tradeStatus").className =
    "sell";

}
let winProbability = aiScore;

// Strong Signal Bonus
if(
    finalSignal === "STRONG BUY" ||
    finalSignal === "STRONG SELL"
){

    winProbability += 5;

}

// Safe Trade Bonus
if(tradeStatus === "SAFE"){

    winProbability += 5;

}

// Limit to 100
if(winProbability > 100){

    winProbability = 100;

}

document.getElementById("winProbability").innerText =
winProbability + "%";
if(winProbability >= 90){

    document.getElementById("winProbability").className =
    "buy";

}
else if(winProbability >= 70){

    document.getElementById("winProbability").className =
    "wait";

}
else{

    document.getElementById("winProbability").className =
    "sell";

}

let quality = "Poor";

if(winProbability >= 95){

    quality = "Excellent";

}
else if(winProbability >= 85){

    quality = "Good";

}
else if(winProbability >= 70){

    quality = "Average";

}

document.getElementById("signalQuality").innerText =
quality;

if(quality === "Excellent"){

    document.getElementById("signalQuality").className =
    "buy";

}
else if(quality === "Good"){

    document.getElementById("signalQuality").className =
    "buy";

}
else if(quality === "Average"){

    document.getElementById("signalQuality").className =
    "wait";

}
else{

    document.getElementById("signalQuality").className =
    "sell";

}

// =============================
// Trade Checklist
// =============================

// Trend
document.getElementById("checkTrend").innerText =
(trend1h === trend4h ? "✅ Trend" : "❌ Trend");

// RSI
document.getElementById("checkRSI").innerText =
(rsi >= 40 && rsi <= 60 ? "⚠️ RSI" : "✅ RSI");

// ADX
document.getElementById("checkADX").innerText =
(adx >= 25 ? "✅ ADX" : "❌ ADX");

// Volume
document.getElementById("checkVolume").innerText =
(volume > 1 ? "✅ Volume" : "❌ Volume");

// Pattern
document.getElementById("checkPattern").innerText =
(
pattern === "Bullish Engulfing" ||
pattern === "Bearish Engulfing"
? "✅ Pattern"
: "❌ Pattern"
);

let reason = "";

reason += ema9 > ema21
? "✅ EMA Bullish Cross<br>"
: "❌ EMA Bearish Cross<br>";

reason += rsi >= 45 && rsi <= 70
? "✅ RSI Healthy<br>"
: "❌ RSI Weak<br>";

reason += adx >= 25
? "✅ Strong Trend<br>"
: "❌ Weak Trend<br>";

reason += (
pattern === "Bullish Engulfing" ||
pattern === "Bearish Engulfing"
)
? "✅ Pattern Confirmed"
: "❌ No Strong Pattern";

document.getElementById("signalReason").innerHTML =
reason;
    
if(

lastHistorySignal !== symbol + finalSignal &&

Date.now() - lastSignalTime > 300000

){

    lastHistorySignal = symbol + finalSignal;

    lastSignalTime = Date.now();

    const historyBody =
    document.getElementById("historyBody");

    historyBody.insertAdjacentHTML(
    "afterbegin",
    `
    <tr>
    <td>${new Date().toLocaleTimeString()}</td>
    <td>${symbol}</td>
    <td>${finalSignal}</td>
    <td>${aiScore}</td>
    <td>${winProbability}%</td>
    <td>${tradeStatus}</td>
    </tr>
    `
    );
localStorage.setItem(
"history",
historyBody.innerHTML
);
    while(historyBody.rows.length > 20){

        historyBody.deleteRow(20);

    }

}
const risk =
calculateRisk(
price,
atr,
result.signal
);

document.getElementById("sl").innerText =
risk.stopLoss;

document.getElementById("tp1").innerText =
risk.tp1;

document.getElementById("tp2").innerText =
risk.tp2;

document.getElementById("tp3").innerText =
risk.tp3;

document.getElementById("rr").innerText =
risk.rr;

const balance =
parseFloat(document.getElementById("balance").value);

const riskPercent =
parseFloat(document.getElementById("riskPercent").value);

const riskAmount =
balance * (riskPercent / 100);

const stopDistance =
Math.abs(price - parseFloat(risk.stopLoss));

let position = 0;

if(stopDistance > 0){

    position = riskAmount / stopDistance;

}

document.getElementById("positionSize").innerText =
position.toFixed(2);

// =============================
// Signal Colours
// =============================

if(finalSignal.includes("BUY")){

    document.getElementById("signal").className = "buy";

}
else if(finalSignal.includes("SELL")){

    document.getElementById("signal").className = "sell";

}
else{

    document.getElementById("signal").className = "wait";

}

if(trend === "Bullish"){

    document.getElementById("trend").className = "buy";

}
else if(trend === "Bearish"){

    document.getElementById("trend").className = "sell";

}
else{

    document.getElementById("trend").className = "wait";

}

}
catch(error){

    console.error(error);

    alert(error);

}

}
function detectPattern(candles){

    if(!candles || candles.length < 2){
        return "None";
    }

    const prev = candles[candles.length - 2];
    const last = candles[candles.length - 1];

    const prevOpen = parseFloat(prev[1]);
    const prevClose = parseFloat(prev[4]);

    const open = parseFloat(last[1]);
    const close = parseFloat(last[4]);
    const high = parseFloat(last[2]);
    const low = parseFloat(last[3]);

    const body = Math.abs(close - open);
    const range = high - low;

    // Bullish Engulfing
    if(
        prevClose < prevOpen &&
        close > open &&
        close >= prevOpen &&
        open <= prevClose
    ){
        return "Bullish Engulfing";
    }

    // Bearish Engulfing
    if(
        prevClose > prevOpen &&
        close < open &&
        open >= prevClose &&
        close <= prevOpen
    ){
        return "Bearish Engulfing";
    }

    // Hammer
    if(
        body > 0 &&
        (Math.min(open,close)-low) > body*2 &&
        (high-Math.max(open,close)) < body
    ){
        return "Hammer";
    }

    // Shooting Star
    if(
        body > 0 &&
        (high-Math.max(open,close)) > body*2 &&
        (Math.min(open,close)-low) < body
    ){
        return "Shooting Star";
    }

    // Doji
    if(range > 0 && body/range < 0.1){
        return "Doji";
    }

    return "None";

}
