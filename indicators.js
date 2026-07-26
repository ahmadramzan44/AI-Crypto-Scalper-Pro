// =====================================
// AI Crypto Scalper Pro
// Indicators
// Version 1.0
// =====================================

// =============================
// EMA
// =============================

function getEMA(prices, period){

    if(prices.length < period){
        return 0;
    }

    const multiplier = 2 / (period + 1);

    let ema = prices[0];

    for(let i = 1; i < prices.length; i++){

        ema = ((prices[i] - ema) * multiplier) + ema;

    }

    return ema;

}

// =============================
// RSI (14)
// =============================

function calculateRSI(prices, period = 14){

    if(prices.length < period + 1){
        return 50;
    }

    let gain = 0;
    let loss = 0;

    for(let i = prices.length - period; i < prices.length; i++){

        const change = prices[i] - prices[i - 1];

        if(change > 0){

            gain += change;

        }else{

            loss += Math.abs(change);

        }

    }

    if(loss === 0){
        return 100;
    }

    const rs = gain / loss;

    return 100 - (100 / (1 + rs));

}

// =============================
// MACD
// =============================

function calculateMACD(prices){

    if(prices.length < 35){

        return {

            macd:0,
            signal:0,
            histogram:0

        };

    }

    const ema12 = getEMA(prices,12);

    const ema26 = getEMA(prices,26);

    const macdLine = ema12 - ema26;

    // Temporary Signal Line
    const signalLine = macdLine * 0.90;

    const histogram = macdLine - signalLine;

    return{

        macd:macdLine,

        signal:signalLine,

        histogram:histogram

    };

}
// =============================
// ATR (Average True Range)
// =============================

function calculateATR(candles, period = 14){

    if(!candles || candles.length < period + 1){
        return 0;
    }

    let trValues = [];

    for(let i = 1; i < candles.length; i++){

        const high = parseFloat(candles[i][2]);
        const low = parseFloat(candles[i][3]);
        const prevClose = parseFloat(candles[i-1][4]);

        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );

        trValues.push(tr);

    }

    const recent = trValues.slice(-period);

    const atr = recent.reduce((a,b)=>a+b,0)/period;

    return atr;

}

// =============================
// Volume
// =============================

function calculateVolume(candles){

    if(!candles || candles.length===0){
        return 0;
    }

    return parseFloat(
        candles[candles.length-1][5]
    );

}

// =============================
// Trend Helper
// =============================

function getTrend(ema9, ema21, ema50, ema200){

    if(
        ema9 > ema21 &&
        ema21 > ema50 &&
        ema50 > ema200
    ){
        return "Bullish";
    }

    if(
        ema9 < ema21 &&
        ema21 < ema50 &&
        ema50 < ema200
    ){
        return "Bearish";
    }

    return "Sideways";

}
// =============================
// ADX (Trend Strength)
// =============================

function calculateADX(candles, period = 14){

    if(!candles || candles.length < period + 1){

        return 0;

    }

    let total = 0;

    for(let i = candles.length - period; i < candles.length; i++){

        const high = parseFloat(candles[i][2]);

        const low = parseFloat(candles[i][3]);

        total += (high - low);

    }

    const atr = calculateATR(candles, period);

    if(atr === 0){

        return 0;

    }

    const adx = (total / period) / atr * 10;

    return Math.min(50, adx);

}
