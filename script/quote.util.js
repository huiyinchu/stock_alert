/**
 * Created by kehuang on 4/9/14.
 */
var OPEN_MARKET_AM_TIME = '09:20:00';
var CLOSE_MARKET_PM_TIME = '04:00:00';

function isMarketOpen () {
    var localeTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    localeTime = localeTime.split(/\s+/);
    if (localeTime[2].endsWith('PM')) {
        if (localeTime[1].startsWith('12:')) { // 12 PM
            return true;
        } else if (localeTime[1] < CLOSE_MARKET_PM_TIME) {
            return true;
        } else {
            return false;
        }
    } else if (localeTime[2].endsWith('AM')) {
        if (localeTime[1] > OPEN_MARKET_AM_TIME) {
            return true;
        } else {
            return false;
        }
    }
    alert("Error");
}


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

function roundNumber(num) {
    if (isNaN(num) || num == "") {
        return num;
    } else if (num == null) {
        return 'N/A';
    }
    var x = parseFloat(num).toFixed(2);
    return x;
}

function getKey(symbol, prefix) {
    return prefix + '_' + symbol;
}