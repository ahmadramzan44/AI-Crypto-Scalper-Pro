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

document.getElementById("entry").innerText =
price.toFixed(2);

document.getElementById("update").innerText =
new Date().toLocaleTimeString();

const candles =
await getCandles(symbol,"15m",200);

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

const volume =
calculateVolume(candles);

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

const result =
generateSignal(
ema9,
ema21,
ema50,
ema200,
rsi,
macd,
volume
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

    alert("Unable to load market data.");

}

}
