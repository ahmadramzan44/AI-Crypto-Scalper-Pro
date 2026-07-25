// ==============================
// Binance API Functions
// ==============================

const BINANCE_API = "https://api.binance.com/api/v3";

// Live Price
async function getCurrentPrice(symbol) {

    try {

        const response = await fetch(
            `${BINANCE_API}/ticker/price?symbol=${symbol}`
        );

        return await response.json();

    } catch (error) {

        console.log(error);
        return null;

    }

}

// Last 200 Candles
async function getCandles(symbol, interval = "15m", limit = 200) {

    try {

        const response = await fetch(

            `${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

        );

        return await response.json();

    } catch (error) {

        console.log(error);
        return [];

    }

}
