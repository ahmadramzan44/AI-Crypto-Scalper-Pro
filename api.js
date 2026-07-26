// =====================================
// AI Crypto Scalper Pro
// Binance API
// Version 1.0
// =====================================

const BINANCE_API = "https://api.binance.com/api/v3";

// =============================
// Get Current Price
// =============================

async function getCurrentPrice(symbol){

    try{

        const response = await fetch(

            `${BINANCE_API}/ticker/price?symbol=${symbol}`

        );

        return await response.json();

    }

    catch(error){

        console.error(error);

        return null;

    }

}

// =============================
// Get Candles
// =============================

async function getCandles(

    symbol,
    interval="15m",
    limit=200

){

    try{

        const response = await fetch(

`${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

        );

        return await response.json();

    }

    catch(error){

        console.error(error);

        return [];

    }

}

// =============================
// Get 24H Statistics
// =============================

async function get24HStats(symbol){

    try{

        const response = await fetch(

`${BINANCE_API}/ticker/24hr?symbol=${symbol}`

        );

        return await response.json();

    }

    catch(error){

        console.error(error);

        return null;

    }

}
