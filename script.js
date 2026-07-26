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

    const username =
        document.getElementById("user").value.trim();

    const password =
        document.getElementById("pass").value.trim();

    if(
        username !== USERNAME ||
        password !== PASSWORD
    ){

        alert("Wrong Username or Password");

        return;

    }

    document.getElementById("login").style.display = "none";

    document.getElementById("dashboard").style.display = "block";

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

    body.innerHTML = "";
   
    const scannerResults = [];

   for(const coin of scannerCoins){

    try{

        const candles =
        await getCandles(coin,"15m",200);

        const closes =
        candles.map(c => parseFloat(c[4]));

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
       const result =
generateSignal(
ema9,
ema21,
ema50,
ema200,
rsi,
macd,
volume,
adx
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

        console.log(coin,error);

    }

}
scannerResults.sort((a,b)=>b.ai-a.ai);

for(const item of scannerResults){

    body.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
    <td>${item.coin}</td>
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
calculateSupportResistance(candles);
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
ema9,
ema21,
ema50,
ema200,
rsi,
macd,
volume,
adx,
trend1h
);

document.getElementById("signal").innerText =
result.signal;
let finalSignal = result.signal;

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
document.getElementById("confidence").innerText =
result.confidence + "%";
let aiScore = result.confidence;

// 1H Trend Bonus
if(trend1h === trend){

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
if(lastHistorySignal !== symbol + finalSignal){

    lastHistorySignal = symbol + finalSignal;

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
function loadChart(symbol){

    document.getElementById("tvChart").innerHTML = "";

    new TradingView.widget({

        autosize: true,
        symbol: "BINANCE:" + symbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        container_id: "tvChart"

    });

}
function sendNotification(title, message){

    if(Notification.permission === "granted"){

        new Notification(title, {
            body: message,
            icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
        });

    }

}
}
