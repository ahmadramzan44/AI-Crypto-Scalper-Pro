// ==============================
// AI Crypto Scalper Pro
// script.js (Part 1)
// ==============================

const USERNAME = "admin";
const PASSWORD = "1234";

let autoRefresh = null;

// ----------------------
// Login
// ----------------------

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username !== USERNAME || password !== PASSWORD) {

        alert("Wrong Username or Password");
        return;

    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

}

// ----------------------
// Analyze
// ----------------------

function analyzeCoin() {

    const coin = document
        .getElementById("coin")
        .value
        .toUpperCase()
        .trim();

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

// ----------------------
// Load Coin
// ----------------------

async function loadCoin(symbol) {

    try {

        const ticker = await getCurrentPrice(symbol);

        if (!ticker || ticker.code) {

            alert("Invalid Symbol");
            return;

        }

        const price = parseFloat(ticker.price);

        document.getElementById("price").innerText =
            price.toFixed(2);

        document.getElementById("entry").innerText =
            price.toFixed(2);

        document.getElementById("update").innerText =
            new Date().toLocaleTimeString();

        const candles = await getCandles(symbol, "15m", 200);
        const atr = calculateATR(candles);
        const closes = candles.map(c =>
            parseFloat(c[4])
        );

        const ema9 = getEMA(closes, 9);
        const ema21 = getEMA(closes, 21);
        const ema50 = getEMA(closes, 50);
        const ema200 = getEMA(closes, 200);

        const rsi = calculateRSI(closes);

        const macd = calculateMACD(closes);

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

        if (macd > 0) {

            document.getElementById("macd").innerText =
                "Bullish";

            document.getElementById("macd").style.color =
                "lime";

        } else {

            document.getElementById("macd").innerText =
                "Bearish";

            document.getElementById("macd").style.color =
                "red";

        }

        // PART 2 continues...

    }

    catch (error) {

        console.log(error);

        alert("Unable to load market data.");

    }

}
        // ----------------------
        // Signal Engine
        // ----------------------

        const result = generateSignal(
            ema9,
            ema21,
            ema50,
            ema200,
            rsi,
            macd
        );
const risk = calculateRisk(
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
        document.getElementById("signal").innerText =
            result.signal;

        document.getElementById("confidence").innerText =
            result.confidence + "%";

        if (result.signal === "BUY") {

            document.getElementById("signal").style.color = "lime";
            document.getElementById("trend").innerText = "Bullish";
            document.getElementById("trend").style.color = "lime";

            const sl = price * 0.995;

            document.getElementById("sl").innerText =
                sl.toFixed(2);

            document.getElementById("tp1").innerText =
                (price + (price - sl)).toFixed(2);

            document.getElementById("tp2").innerText =
                (price + ((price - sl) * 2)).toFixed(2);

            document.getElementById("tp3").innerText =
                (price + ((price - sl) * 3)).toFixed(2);

        }

        else if (result.signal === "SELL") {

            document.getElementById("signal").style.color = "red";
            document.getElementById("trend").innerText = "Bearish";
            document.getElementById("trend").style.color = "red";

            const sl = price * 1.005;

            document.getElementById("sl").innerText =
                sl.toFixed(2);

            document.getElementById("tp1").innerText =
                (price - (sl - price)).toFixed(2);

            document.getElementById("tp2").innerText =
                (price - ((sl - price) * 2)).toFixed(2);

            document.getElementById("tp3").innerText =
                (price - ((sl - price) * 3)).toFixed(2);

        }

        else {

            document.getElementById("signal").style.color =
                "orange";

            document.getElementById("trend").innerText =
                "Sideways";

            document.getElementById("trend").style.color =
                "orange";

            document.getElementById("sl").innerText = "--";
            document.getElementById("tp1").innerText = "--";
            document.getElementById("tp2").innerText = "--";
            document.getElementById("tp3").innerText = "--";

        }

        document.getElementById("rr").innerText =
            "1 : 3";
