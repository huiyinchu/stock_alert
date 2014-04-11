/**
 * Created by kehuang on 4/9/14.
 */
var OPEN_MARKET_AM_TIME = '09:20:00';
var CLOSE_MARKET_PM_TIME = '04:00:00';

var CELL_TYPE_TITLE_BAR_HEADER = 'CELL_TYPE_TITLE_BAR_HEADER';
var CELL_TYPE_DATA = 'CELL_TYPE_TITLE_DATA';

function isMarketOpen () {
    var localeTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    localeTime = localeTime.split(/\s+/);
    if (localeTime[1].length != 8) {
        var tokens = localeTime[1].split(':');
        localeTime[1] = '';
        for (var i = 0; i < tokens.length; i++){
            if (tokens[i].length == 1) {
                tokens[i] = '0' + tokens[i];
            }
            localeTime[1] += tokens[i] + ':';
        }
        localeTime[1] = localeTime[1].substr(0, localeTime[1].length - 1);
    }
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

function getClassStyleAttribute(className, attributeName) {
    var div = $('<div>').addClass(className).hide();
    $('body').append(div);
    var val = div.css(attributeName);
    div.remove();
    return val;
}

function getClassWidth(className) {
    var val = getClassStyleAttribute(className, 'width');
    return parseInt(val.substr(0, val.length - 2));
}

function getElementNumericAttribute(id, attributeName) {
    var val = $('#' + id).css(attributeName);
    return parseInt(val.substr(0, val.length - 2));
}

function generateCellHTML(symbol, prefix, value, className, type) {
    if (type == CELL_TYPE_TITLE_BAR_HEADER) {
        return '<span id="' + getIdForTitle(prefix) + '" class="' + className + '">' + value + '</span>'
    } else if (type == CELL_TYPE_DATA) {
        if (isNaN(value)) {
            if (value.endsWith('%')) {
                value = parseInt(value.substr(0, value.length - 1));
                return '<span id="' + getKey(symbol, prefix) + '" class="'+className+'">(' + roundNumber(value) + '%)</span>';
            } else {
                return '<span id="' + getKey(symbol, prefix) + '" class="'+className+'">' + value + '</span>';
            }
        } else {
            return '<span id="' + getKey(symbol, prefix) + '" class="'+className+'">' + roundNumber(value) + '</span>';
        }

    } else {
        console.log("Error: unknown type.");
    }
}

function getIdForTitle(columnPrefix) {
    return getKey(tableTitlebarId, columnPrefix);
}

//String.prototype.isEarlierThan = function(time2) {
//    var time1 = this;
//
//    var time1s = time1.split(/\s/);
//    var time2s = time2.split(/\s/);
//
//    var time1Date = time1s[0];
//    var time2Date = time2s[0];
//    var time1Time = time1s[1];
//    var time2Time = time2s[1];
//    var time1AP = time1s[2];
//    var time2AP = time2s[2];
//
//    // skip date
//
//    // compare AM PM first
//    if (time1AP == 'AM' && time2AP == 'PM') {
//        return false;
//    } else if (time1AP == 'PM' && time2AP == 'AM') {
//        return true;
//    }
//
//    var time1Hour = time1Time.split(':')[0];
//    var time2Hour = time2Time.split(':')[0];
//    var time1Min = time1Time.split(':')[1];
//    var time2Min = time2Time.split(':')[1];
//    var time1Sec = time1Time.split(':')[2];
//    var time2Sec = time2Time.split(':')[2];
//
//    // compare time
//    // handle special case
//    if (time1AP == 'PM')
//
//    if (time1AP == 'AM' && time2AP == 'AM') {
//        if (time1Hour < time2Hour) {
//            return 1;
//        } else if (time2Hour < time1Hour) {
//            return -1;
//        } else {
//            if (time1Min < time2Min) {
//                return 1;
//            } else if (time2Min < time1Min) {
//                return -1;
//            } else {
//                if (time1Sec < time2Sec) {
//                    return 1;
//                } else if (time2Sec < time1Sec) {
//                    return -1;
//                } else {
//                    return 0;
//                }
//            }
//        }
//    } else if (time1AP == 'PM' && time2AP == 'PM') {
//
//    } else {
//        console.error("Error: wrong time format. The formate must be: MM/DD/YYYY HH:MM:SS AM(PM).");
//    }
//
//}