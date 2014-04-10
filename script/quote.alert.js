/**
 * Created by kehuang on 4/7/14.
 */

/**
 *
 * @param quoteList
 * @constructor
 */
function MyQuoteAlert(quoteList) {

    this.daysLowPrefix = 'daysLow'; // constant
    this.daysHighPrefix = 'daysHigh'; // constant
    this.stopLossPrefix = 'stopLoss'; // constant

    this.daysLows = new Object(); // map for days low
    this.daysHighs = new Object(); // map for days high
    this.stopLosses = new Object(); // map for stop loss

    this.readModelFromLocalStorage(quoteList);
}

MyQuoteAlert.prototype.readModelFromLocalStorage = function(quoteList) {
    // read days low and high
    if (window.localStorage) {
        if (Object.prototype.toString.call(quoteList) === '[object Array]') {
            for (var i = 0; i < quoteList.length; i++) {
                if (localStorage[getKey(quoteList[i], this.stopLossPrefix)]) { // read stop loss
                    this.stopLosses[quoteList[i]] = localStorage[getKey(quoteList[i], this.stopLossPrefix)];
                }
                //
            }
        } else {
            if (localStorage[getKey(quoteList, this.stopLossPrefix)]) { // read stop loss
                this.stopLosses[quoteList] = localStorage[getKey(quoteList, this.stopLossPrefix)];
            }
        }
    }
}

MyQuoteAlert.prototype.checkDaysLow = function (quoteModel) {
    var symbol = quoteModel.symbol;
    if (symbol in this.daysLows) { // if contains the historical data
        if (this.daysLows[symbol] > quoteModel.DaysLow) {
            // TODO here we should trigger the alert if it is set
            this.updateDaysLowOrHighModel(symbol, quoteModel.DaysLow, this.daysLowPrefix);
        }
    } else {
        this.updateDaysLowOrHighModel(symbol, quoteModel.DaysLow, this.daysLowPrefix);
    }
}

MyQuoteAlert.prototype.checkDaysHigh = function (quoteModel) {
    var symbol = quoteModel.symbol;
    if (symbol in this.daysHighs) { // if contains the historical data
        if (this.daysHighs[symbol] < quoteModel.DaysHigh) {
            // TODO here we should trigger the alert if it is set
            this.updateDaysLowOrHighModel(symbol, quoteModel.DaysHigh, this.daysHighPrefix);
        }
    } else {
        this.updateDaysLowOrHighModel(symbol, quoteModel.DaysHigh, this.daysHighPrefix);
    }
}

MyQuoteAlert.prototype.updateDaysLowOrHighModel = function (symbol, newVal, prefix) {
    // update the value in the memory
    if (prefix == this.daysLowPrefix) {
        this.daysLows[symbol] = newVal;

    } else if (prefix == this.daysHighPrefix) {
        this.daysHighs[symbol] = newVal;
    }
}


MyQuoteAlert.prototype.checkStopLoss = function (quoteModel) {
    var symbol = quoteModel.symbol;
    if (symbol in this.stopLosses) {
        if (quoteModel.price < this.stopLosses[symbol]) {
            // TODO here we should trigger the alert if it is set
        }
    }
}


MyQuoteAlert.prototype.setStopLoss = function(symbol) {
    var stopLossVal;
    if (symbol in this.stopLosses) {
        stopLossVal = prompt("Stop loss setup for : " + symbol, this.stopLosses[symbol]);
    } else {
        stopLossVal = prompt("Stop loss setup for : " + symbol, "Enter stop loss here");
    }

    if (isNaN(stopLossVal)) {
        alert("Error: not a number");
    } else {
        this.stopLosses[symbol] = stopLossVal;
        if (window.localStorage) {
            localStorage.setItem(getKey(symbol, this.stopLossPrefix), stopLossVal);// persist the data in browser
        }
    }
}