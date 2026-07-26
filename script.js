// =====================================
// AI Crypto Scalper Pro
// script.js
// Version 1.0
// =====================================

const USERNAME = "admin";
const PASSWORD = "1234";

let autoRefresh = null;

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

    loadCoin(symbol);

    if(autoRefresh){

        clearInterval(autoRefresh);

    }

    autoRefresh = setInterval(function(){

        loadCoin(symbol);

    },5000);

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
console.log("1H Candles:", candles1h);
const closes1h =
candles1h.map(c => parseFloat(c[4]));

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

document.getElementById("signal").innerText =
result.signal;

document.getElementById("confidence").innerText =
result.confidence + "%";

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

if(result.signal === "BUY"){

    document.getElementById("signal").className = "buy";

}
else if(result.signal === "SELL"){

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
