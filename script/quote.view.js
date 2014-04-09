/**
 * Created by kehuang on 4/3/14.
 */

var fa_minus_square_red = 'fa fa-minus-square fa-color_red';
var fa_trash_o_grey = 'fa fa-trash-o fa-color_grey';
var fa_gear_lg_grey = "fa fa-gear fa-lg fa-color_grey";
var fa_gear_lg_grey_spin = "fa fa-gear fa-lg fa-color_grey fa-spin";

function View() {

    this.viewWidth = 0;

    this.tableTitlebarId = "table_title_bar";// need to change stock_alert.css
    this.tableTitlebarMarginBottom = -10;

    this.symbolWidth = 50;
    this.symbolLabel = "Symbol";

    this.priceWidth = 40;
    this.priceLabel = "Price";
    this.priceIdPrefix = 'priceId';

    this.changePriceWidth = 30;
    this.changePriceLabel = "Change";
    this.changePriceIdPrefix = 'changePriceId';

    this.changePercentWidth = 60;
    this.changePercentLabel = " ";
    this.changePercentIdPrefix = 'changePercentId';

    this.daysLowOrHighWidth = 40;
    this.daysLowLabel = "Low";
    this.daysHighLabel = "High";
    this.daysLowIdPrefix = 'daysLowId';
    this.daysHighIdPrefix = 'daysHighId';

    this.stopLossWidth = 40;//TODO CONTINUE HERE


    this.deleteButtonWidth = 11;
    this.deleteButtonLabel = " ";
    this.deleteButtonIdPrefix = 'deleteButtonId';

    this.addButtonWidth = 11;
}

View.prototype.init = function(quoteList, controller) {

    this.controller = controller;

    this.createTableTitlebar();

    // add the quotes
    if (quoteList.length > 0) {
        for (var i = 0; i < quoteList.length; i++) {
            var quoteModel = new QuoteModel(quoteList[i]);
            this.updateView(quoteModel); // initialize the table
        }
    }

    // update the configButton
    var configButton = document.getElementById('config');
    // add the mouse over and mouse out actions
    if (configButton) {
        configButton.addEventListener('mouseover', function(){
            configButton.className = fa_gear_lg_grey_spin;
        });
        configButton.addEventListener('mouseout', function(){
            configButton.className = fa_gear_lg_grey;
        });
    }
}

View.prototype.createTableTitlebar = function() {
    // add the title
    var html = '<div id="'+this.tableTitlebarId+'" style="display: inline-block; margin-bottom: ' + this.tableTitlebarMarginBottom + 'px">';
    html += this.getSymbolHtml(this.symbolLabel);
    html += this.getPriceHtml(null, this.priceLabel, 0);
    html += this.getChangePriceHtml(null, this.changePriceLabel);
    html += this.getChangePercentHtml(null, this.changePercentLabel);
    html += this.getDaysLowOrHighHtml(null, this.daysLowLabel, null);
    html += this.getDaysLowOrHighHtml(null, this.daysHighLabel, null);
    html += this.getDeleteButtonHtml(this.deleteButtonLabel);
    html += '</div>'
    $("#livequotes").append(html);
}

View.prototype.updateDimension = function() {
    $("#livequotes").css('width', this.viewWidth + 'px');
}

/**
 * Update the view for the given data (QuoteModel) which contain symbol, price, change etc. information.
 * @param quoteModel the QuoteModel object
 */
View.prototype.updateView = function(quoteModel) {
    var selector = "#" + quoteModel.symbol;
    if ($(selector).length == 0) {
        // add the child
        var quoteHtml = this.getWellFormedHtml(quoteModel); // update the view
        $("#livequotes").append(quoteHtml);
        this.addDeleteButton(quoteModel);
        this.updateDimension();
    } else {
        // replace the child
//        $(selector).replaceWith(quoteHtml);
        this.liteUpdateViewForSymbol(quoteModel)
    }
}

/**
 * Update the action
 * @param quoteModel
 */
View.prototype.addDeleteButton = function(quoteModel) {
    // add the delete action
    var deleteButton = document.getElementById(this.getKey(quoteModel.symbol, this.deleteButtonIdPrefix));
    var oThis = this;
    var symbol = quoteModel.symbol;
    if (deleteButton) {
        deleteButton.addEventListener('click', function(){
            oThis.controller.removeQuote(symbol);
        });
    } else {
        console.error("Error: delete button not found.");
    }

    // add the mouse over and mouse out actions
    if (deleteButton) {
        deleteButton.addEventListener('mouseover', function(){
            deleteButton.className = fa_minus_square_red;
        });
        deleteButton/addEventListener('mouseout', function(){
            deleteButton.className = fa_trash_o_grey;
        });
    }
}

/**
 * Only update the numbers, avoid unnecessary overhead
 *
 * @param symbol
 */
View.prototype.liteUpdateViewForSymbol = function(quoteModel) {
    var symbol = quoteModel.symbol;
    $('#' + this.getKey(symbol, this.priceIdPrefix)).replaceWith(this.getPriceHtml(quoteModel.symbol, quoteModel.price, quoteModel.changePercent));
    $('#' + this.getKey(symbol, this.changePriceIdPrefix)).replaceWith(this.getChangePriceHtml(quoteModel.symbol, quoteModel.changePrice));
    $('#' + this.getKey(symbol, this.changePercentIdPrefix)).replaceWith(this.getChangePercentHtml(quoteModel.symbol, quoteModel.changePercent));
    $('#' + this.getKey(symbol, this.daysLowIdPrefix)).replaceWith(this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysLow, this.daysLowLabel));
    $('#' + this.getKey(symbol, this.daysHighIdPrefix)).replaceWith(this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysHigh, this.daysHighLabel));
}

/**
 * Remove the stock symbol from the watchlist.
 * @param symbol
 */
View.prototype.removeView = function(symbol) {
    var selector = '#' + symbol;
    if ($(selector).length != 0) {
        $(selector).remove();
    }
}

View.prototype.getWellFormedHtml = function (quoteModel) {
    var html = '<div id="' + quoteModel.symbol + '" style="padding-top:0px;padding-bottom:0px">';
    html += '<p>';
    html += this.getSymbolHtml(quoteModel.symbol);
    html += this.getPriceHtml(quoteModel.symbol, quoteModel.price, quoteModel.changePercent);
    html += this.getChangePriceHtml(quoteModel.symbol, quoteModel.changePrice);
    html += this.getChangePercentHtml(quoteModel.symbol, quoteModel.changePercent);
    console.log(this.getChangePercentHtml(quoteModel.symbol, quoteModel.changePercent));
    html += this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysLow, this.daysLowLabel);
    html += this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysHigh, this.daysHighLabel);
    html += this.getDeleteButtonHtml(quoteModel.symbol);
    html += '</p>';
    html += '<hr style="margin-top: -0.8em; margin-bottom: -0.8em">';
    html += '</div>';
    return html;
}

View.prototype.getDeleteButtonHtml = function(symbol) {
    if (symbol == this.deleteButtonLabel) {
        this.viewWidth += this.deleteButtonWidth;
        return '<span style="display: inline-block; width: ' + this.deleteButtonWidth + 'px"></span>';
    }

    return '<i id="' + this.getKey(symbol, this.deleteButtonIdPrefix) + '" class="' + fa_trash_o_grey+'"></i>';
//    return '<img id="' + this.getKey(symbol, this.deleteButtonIdPrefix) + '" src="./../resources/trash.png" style="vertical-align: middle ;display: inline-block; width: ' + this.deleteButtonWidth + 'px;"/>';
}

//View.prototype.getAddButtonHtml = function() {
//    return '<img id="addSymbolButton" src="./../resources/plus_16x16.png" style="vertical-align: middle ;display: inline-block; width: ' + this.addButtonWidth + 'px;"/>';
//}

View.prototype.getSymbolHtml = function(symbol) {
    if (symbol == this.symbolLabel) {
        this.viewWidth += this.symbolWidth;
        return '<span style="display: inline-block; width: ' + this.symbolWidth + 'px;">' + symbol + '</span>';
    } else {
        return '<span style="display: inline-block; width: ' + this.symbolWidth + 'px;">' + '<a target="_blank" href="https://www.google.com/finance?q=' + symbol + '"> ' + symbol + '</a></span>';
    }
}
View.prototype.getPriceHtml = function(symbol, price, change) {
    if (price == this.priceLabel) {
        this.viewWidth += this.priceWidth;
        return '<span style="color: black;display: inline-block; width: ' + this.priceWidth + 'px;">' + price + '</span>';
    } else {
        if (change > 0) {
            return '<span id="' + this.getKey(symbol, this.priceIdPrefix) + '" style="color: green;display: inline-block; width: ' + this.priceWidth + 'px;">' + this.roundNumber(price) + '</span>';
        } else if (change < 0) {
            return '<span id="' + this.getKey(symbol, this.priceIdPrefix) + '" style="color: red;display: inline-block; width: ' + this.priceWidth + 'px;">' + this.roundNumber(price) + '</span>';
        } else {
            return '<span id="' + this.getKey(symbol, this.priceIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.priceWidth + 'px;">' + this.roundNumber(price) + '</span>';
        }
    }


}
View.prototype.getChangePriceHtml = function(symbol, number) {
    if (number == this.changePriceLabel) {
        this.viewWidth += this.changePriceWidth;
        return '<span style="color: black;display: inline-block; width: ' + this.changePriceWidth + 'px;">' + number + '</span>';
    } else {
        if (number > 0) {
            return '<span id="' + this.getKey(symbol, this.changePriceIdPrefix) + '" style="color: green;display: inline-block; width: ' + this.changePriceWidth + 'px;">' + this.roundNumber(number) + '</span>';
        } else if (number < 0) {
            return '<span id="' + this.getKey(symbol, this.changePriceIdPrefix) + '" style="color: red;display: inline-block; width: ' + this.changePriceWidth + 'px;">' + this.roundNumber(number) + '</span>';
        } else {
            return '<span id="' + this.getKey(symbol, this.changePriceIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.changePriceWidth + 'px;">' + this.roundNumber(number) + '</span>';
        }
    }
}
View.prototype.getChangePercentHtml = function(symbol, num) {
    if (num == this.changePercentLabel) {
        this.viewWidth += this.changePercentWidth;
        return '<span style="color: black;display: inline-block; width: ' + this.changePercentWidth + 'px;">' + num + '</span>';
    } else {
        if (num.match('%$')) {
            var number = num.substr(0, num.length - 1); // remove %
            if (isNaN(number) || number == "") {
                return '<span style="color: black;display: inline-block; width: ' + this.changePercentWidth + 'px;">' + num + '</span>';
            } else {
                if (number > 0) {
                    return '<span id="' + this.getKey(symbol, this.changePercentIdPrefix) + '" style="color: green;display: inline-block; width: ' + this.changePercentWidth + 'px;">(' + this.roundNumber(number) + '%)</span>';
                } else if (number < 0) {
                    return '<span id="' + this.getKey(symbol, this.changePercentIdPrefix) + '" style="color: red;display: inline-block; width: ' + this.changePercentWidth + 'px;">(' + this.roundNumber(number) + '%)</span>';
                } else {
                    return '<span id="' + this.getKey(symbol, this.changePercentIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.changePercentWidth + 'px;">(' + this.roundNumber(number) + '%)</span>';
                }
            }
        } else {
            return '<span id="' + this.getKey(symbol, this.changePercentIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.changePercentWidth + 'px;"></span>'; // space hold
        }
    }
}

View.prototype.getDaysLowOrHighHtml = function(symbol, num, type) {
    if (num == this.daysLowLabel || num == this.daysHighLabel) {
        this.viewWidth += this.daysLowOrHighWidth;
        return '<span style="color: black;display: inline-block; width: ' + this.daysLowOrHighWidth + 'px;">' + num + '</span>';
    } else if (type == this.daysLowLabel) {
        return '<span id="' + this.getKey(symbol, this.daysLowIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.daysLowOrHighWidth + 'px;">' + this.roundNumber(num) + '</span>';
    } else if (type == this.daysHighLabel) {
        return '<span id="' + this.getKey(symbol, this.daysHighIdPrefix) + '" style="color: black;display: inline-block; width: ' + this.daysLowOrHighWidth + 'px;">' + this.roundNumber(num) + '</span>';
    } else {
        console.error("Error: unknown parameters.");
    }
}

View.prototype.hideAddSymbolText = function() {
    $('#addSymbolText').css('visibility', 'hidden');
}

View.prototype.roundNumber = function(num) {
    if (isNaN(num) || num == "") {
        return num;
    }
    var x = parseFloat(num).toFixed(2);
    return x;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

View.prototype.getKey = function(symbol, prefix) {
    return prefix + '_' + symbol;
}