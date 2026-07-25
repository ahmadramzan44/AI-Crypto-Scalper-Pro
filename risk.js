// ==============================
// Risk Management
// ==============================

function calculateRisk(price, atr, signal) {

    let stopLoss;
    let tp1;
    let tp2;
    let tp3;

    if (signal === "BUY") {

        stopLoss = price - atr;

        tp1 = price + (atr * 1);
        tp2 = price + (atr * 2);
        tp3 = price + (atr * 3);

    } else if (signal === "SELL") {

        stopLoss = price + atr;

        tp1 = price - (atr * 1);
        tp2 = price - (atr * 2);
        tp3 = price - (atr * 3);

    } else {

        return {
            stopLoss: "--",
            tp1: "--",
            tp2: "--",
            tp3: "--",
            rr: "--"
        };

    }

    return {

        stopLoss: stopLoss.toFixed(2),
        tp1: tp1.toFixed(2),
        tp2: tp2.toFixed(2),
        tp3: tp3.toFixed(2),
        rr: "1 : 3"

    };

}
