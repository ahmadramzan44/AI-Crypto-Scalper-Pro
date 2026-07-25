// Demo Login
const USERNAME = "admin";
const PASSWORD = "1234";

let autoRefresh = null;

// Login Function
function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === USERNAME && password === PASSWORD) {

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

    } else {

        alert("Wrong Username or Password");

    }

}

// Analyze Coin
function analyzeCoin() {

    const coin = document.getElementById("coin").value.toUpperCase().trim();

    if (coin === "") {
        alert("Enter Coin Name");
        return;
    }

    document.getElementById("coinName").innerText = coin;

    loadCoin(coin);

    if (autoRefresh) {
        clearInterval(autoRefresh);
    }

    autoRefresh = setInterval(() => {
        loadCoin(coin);
    }, 5000);

}

// Load Coin Data
async function loadCoin(symbol) {

    try {

        const response = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );

        const data = await response.json();

        if (data.code) {
            alert("Invalid Coin");
            return;
        }

        const price = parseFloat(data.lastPrice);
const candles = await getCandles(symbol, "15m", 200);

const closes = candles.map(candle => parseFloat(candle[4]));

const ema9 = getEMA(closes, 9);
const ema21 = getEMA(closes, 21);
const ema50 = getEMA(closes, 50);
const ema200 = getEMA(closes, 200); 

const rsi = calculateRSI(closes);
        
document.getElementById("rsi").innerText = rsi.toFixed(2);

document.getElementById("price").innerText =
            price.toFixed(2);
document.getElementById("ema9").innerText = ema9.toFixed(2);
document.getElementById("ema21").innerText = ema21.toFixed(2);
document.getElementById("ema50").innerText = ema50.toFixed(2);
document.getElementById("ema200").innerText = ema200.toFixed(2);
        document.getElementById("entry").innerText =
            price.toFixed(2);

        document.getElementById("update").innerText =
            new Date().toLocaleTimeString();
document.getElementById("ema9").innerText = ema9.toFixed(2);
document.getElementById("ema21").innerText = ema21.toFixed(2);
document.getElementById("ema50").innerText = ema50.toFixed(2);
document.getElementById("ema200").innerText = ema200.toFixed(2);
        // Temporary Demo Signal
        const signals = ["BUY", "SELL", "WAIT"];
        const signal = signals[Math.floor(Math.random() * 3)];

        document.getElementById("signal").innerText = signal;

        document.getElementById("trend").innerText = signal;

        document.getElementById("confidence").innerText =
            (80 + Math.floor(Math.random() * 20)) + "%";

        if (signal === "BUY") {

            document.getElementById("sl").innerText =
                (price * 0.995).toFixed(2);

            document.getElementById("tp1").innerText =
                (price * 1.005).toFixed(2);

            document.getElementById("tp2").innerText =
                (price * 1.010).toFixed(2);

            document.getElementById("tp3").innerText =
                (price * 1.015).toFixed(2);

        } else if (signal === "SELL") {

            document.getElementById("sl").innerText =
                (price * 1.005).toFixed(2);

            document.getElementById("tp1").innerText =
                (price * 0.995).toFixed(2);

            document.getElementById("tp2").innerText =
                (price * 0.990).toFixed(2);

            document.getElementById("tp3").innerText =
                (price * 0.985).toFixed(2);

        } else {

            document.getElementById("sl").innerText = "--";
            document.getElementById("tp1").innerText = "--";
            document.getElementById("tp2").innerText = "--";
            document.getElementById("tp3").innerText = "--";

        }

        document.getElementById("rr").innerText = "1 : 3";

    } catch (error) {

        alert("Unable to connect to Binance API.");

    }

}
