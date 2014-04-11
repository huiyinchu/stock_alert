/**
 * Created by kehuang on 4/3/14.
 */

var fa_minus_square_red = 'fa fa-minus-square fa-color_red';
var fa_trash_o_grey = 'fa fa-trash-o fa-color_grey';
var fa_gear_lg_grey = "fa fa-gear fa-lg fa-color_grey";
var fa_gear_lg_grey_spin = "fa fa-gear fa-lg fa-color_grey fa-spin";
var DAYS_LOW_HIGH_PRICE_MODE = 'DAYS_LOW_HIGH_PRICE_MODE';
var DAYS_LOW_HIGH_PERCENT_MODE = 'DAYS_LOW_HIGH_PERCENT_MODE';
var tableTitlebarId = "table_title_bar";// need to change stock_alert.css

function View() {

    this.viewWidth = 0;


    this.tableTitlebarMarginBottom = -10;

    this.symbolLabel = "Symbol";
    this.symbolIdPrefix = 'symbolId';

    this.priceLabel = "Price";
    this.priceIdPrefix = 'priceId';

    this.changePriceLabel = "$";
    this.changePriceIdPrefix = 'changePriceId';

    this.changePercentLabel = "%";
    this.changePercentIdPrefix = 'changePercentId';

    this.openLabel = 'Open';
    this.openIdPrefix = 'openId';

    this.daysLowLabel = "Low";
    this.daysHighLabel = "High";

    this.daysLowIdPrefix = 'daysLowId';
    this.daysHighIdPrefix = 'daysHighId';

    this.daysLowMode = DAYS_LOW_HIGH_PRICE_MODE;
    this.daysHighMode = DAYS_LOW_HIGH_PRICE_MODE;
//    this.daysLowMode = DAYS_LOW_HIGH_PERCENT_MODE
//    this.daysHighMode = DAYS_LOW_HIGH_PERCENT_MODE;

    this.deleteButtonLabel = " ";
    this.deleteButtonIdPrefix = 'deleteButtonId';
}

View.prototype.init = function(quoteList, controller) {

    this.controller = controller;

    this.createTableTitlebar();

    // add the empty quotes
    if (quoteList.length > 0) {
        for (var i = 0; i < quoteList.length; i++) {
            var quoteModel = new QuoteModel(quoteList[i], null);
            this.updateView(quoteModel); // initialize the table
        }
    }

    // update the configButton
    var configButton = document.getElementById('config');
    $('#config').css('margin-left', (this.viewWidth
        - getElementNumericAttribute('addSymbolText', 'width')
        - getElementNumericAttribute('addSymbolButton', 'margin-left')
        - getElementNumericAttribute('addSymbolButton', 'width')
        - getElementNumericAttribute('config', 'width')
        - 20) + 'px');
    // add the mouse over and mouse out actions
    if (configButton) {
        configButton.addEventListener('mouseover', function(){
            configButton.className = fa_gear_lg_grey_spin;
        });
        configButton.addEventListener('mouseout', function(){
            configButton.className = fa_gear_lg_grey;
        });
    }

    this.updateDimension();
}

View.prototype.createTableTitlebar = function() {
    // add the title
    var html = '<div id="'+tableTitlebarId+'" style="display: inline-block; margin-bottom: ' + this.tableTitlebarMarginBottom + 'px">';

    // symbol column
    html += generateCellHTML(null, this.symbolIdPrefix, this.symbolLabel, 'title_symbol', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_symbol');

    // price column
    html += generateCellHTML(null, this.priceIdPrefix, this.priceLabel, 'title_price', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_price')

    // change $
    html += generateCellHTML(null, this.changePriceIdPrefix, this.changePriceLabel, 'title_change_price', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_change_price');

    // change %
    html += generateCellHTML(null, this.changePercentIdPrefix, this.changePercentLabel, 'title_change_percent', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_change_percent');

    // open
    html += generateCellHTML(null, this.openIdPrefix, this.openLabel, 'title_open', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_open');

    // days low
    html += generateCellHTML(null, this.daysLowIdPrefix, this.daysLowLabel, 'title_days_low_high', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_days_low_high');

    // days high
    html += generateCellHTML(null, this.daysHighIdPrefix, this.daysHighLabel, 'title_days_low_high', CELL_TYPE_TITLE_BAR_HEADER);
    this.viewWidth += getClassWidth('title_days_low_high');

    // delete button
    html += this.getDeleteButtonHtml(this.deleteButtonLabel);

    html += '</div>'
    $("#livequotes").append(html);
}

View.prototype.updateDimension = function() {
    var newWidth = this.viewWidth + 'px';
    $("#livequotes").css('width', this.viewWidth + 'px');
}

View.prototype.getLiveQuoteClientWidth = function() {
    var maxWidth = 0;
    var children = document.getElementById('livequotes').childNodes;
    for (var i = 0; i < children.length; i++) {
        if (maxWidth < children[i].clientWidth) {
            maxWidth = children[i].clientWidth;
        }
    }
    return maxWidth + 100;
}

/**
 * Update the view for the given data (QuoteModel) which contain symbol, price, change etc. information.
 * @param quoteModel the QuoteModel object
 */
View.prototype.updateView = function(quoteModel) {
    var selector = "#" + quoteModel.symbol;
    if ($(selector).length == 0) {
        // add the child
        var quoteHtml = this.createRowHTMLForQuote(quoteModel); // update the view
        $("#livequotes").append(quoteHtml);
        this.addDeleteButtonEvent(quoteModel);
    } else {
        // replace the child
//        $(selector).replaceWith(quoteHtml);
        this.liteUpdateViewForSymbol(quoteModel)
    }
    this.updateDimension();
}


/**
 * Only update the numbers, avoid unnecessary overhead
 *
 * @param symbol
 */
View.prototype.liteUpdateViewForSymbol = function(quoteModel) {
    var symbol = quoteModel.symbol;
    var element;

    // update the price
    $('#' + getKey(symbol, this.priceIdPrefix))[0].innerHTML = quoteModel.price;

    // update the change ($)
    element = $('#' + getKey(symbol, this.changePriceIdPrefix))[0];
    element.innerHTML = quoteModel.changePrice;
    if (quoteModel.changePrice > 0) {
        element.className = 'change_price_up';
    } else if (quoteModel.changePrice < 0) {
        element.className = 'change_price_down';
    } else {
        element.className = 'change_price_even';
    }

    // update the change (%)
    element = $('#' + getKey(symbol, this.changePercentIdPrefix))[0];
    element.innerHTML = '(' + quoteModel.changePercent + ')';
    if (parseFloat(quoteModel.changePercent.substr(0, quoteModel.changePercent.length - 1)) < 0) {
        element.className = 'change_percent_down';
    } else if (parseFloat(quoteModel.changePercent.substr(0, quoteModel.changePercent.length - 1)) > 0) {
        element.className = 'change_percent_up';
    } else {
        element.className = 'change_percent_even';
    }

    // update open
    element = $('#' + getKey(symbol, this.openIdPrefix))[0];
    element.innerHTML = quoteModel.open == ''? 'N/A' : quoteModel.open;

    // update days low
    var element2 = $('#' + getKey(symbol, this.daysLowIdPrefix));
    element = element2[0];
    var delta = ((quoteModel.DaysLow - quoteModel.open)/ quoteModel.open) * 100;
    if (isNaN(delta)) {
        element.innerHTML = 'N/A';
    } else {
        if (this.daysLowMode == DAYS_LOW_HIGH_PRICE_MODE) {
            element.innerHTML = quoteModel.DaysLow;
        } else {
            element.innerHTML = roundNumber(delta) + '%';
        }
        if (delta < 0) {
            element2.css('color', 'red');
        }
    }

//    $('#' + getKey(symbol, this.daysLowIdPrefix))[0].innerHTML = quoteModel.DaysLow;

    element2 = $('#' + getKey(symbol, this.daysHighIdPrefix));
    element = element2[0];
    delta = ((quoteModel.DaysHigh - quoteModel.open)/ quoteModel.open) * 100;
    if (isNaN(delta)) {
        element.innerHTML = 'N/A';
    } else {
        if (this.daysHighMode == DAYS_LOW_HIGH_PRICE_MODE) {
            element.innerHTML = quoteModel.DaysHigh;
        } else {
            element.innerHTML = roundNumber(delta) + '%';
        }
        if (delta > 0) {
            element2.css('color', 'green');
        }
    }

//    $('#' + getKey(symbol, this.daysHighIdPrefix))[0].innerHTML = quoteModel.DaysHigh;
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

View.prototype.createRowHTMLForQuote = function (quoteModel) {
    var html = '<div id="' + quoteModel.symbol + '" style="padding-top:0px;padding-bottom:0px">';
    html += '<p>';
    html += this.getSymbolHtml(quoteModel.symbol);
    html += this.getPriceHtml(quoteModel.symbol, quoteModel.price, quoteModel.changePercent);
    html += this.getChangePriceHtml(quoteModel.symbol, quoteModel.changePrice);
    html += this.getChangePercentHtml(quoteModel.symbol, quoteModel.changePercent);
    html += this.getOpenHtml(quoteModel.symbol, quoteModel.open);
    html += this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysLow, this.daysLowLabel);
    html += this.getDaysLowOrHighHtml(quoteModel.symbol, quoteModel.DaysHigh, this.daysHighLabel);
    html += this.getDeleteButtonHtml(quoteModel.symbol);
    html += '</p>';
    html += '<hr style="margin-top: -0.8em; margin-bottom: -0.8em">';
    html += '</div>';
    return html;
}

View.prototype.getSymbolHtml = function(symbol) {
    return generateCellHTML(symbol, this.symbolIdPrefix, symbol, 'symbol', CELL_TYPE_DATA);
}

View.prototype.getPriceHtml = function(symbol, price, change) {
    return generateCellHTML(symbol, this.priceIdPrefix, price, 'price', CELL_TYPE_DATA);
}

View.prototype.getChangePriceHtml = function(symbol, number) {
    return generateCellHTML(symbol, this.changePriceIdPrefix, number, 'change_price_even', CELL_TYPE_DATA);
}

View.prototype.getChangePercentHtml = function(symbol, num) {
    return generateCellHTML(symbol, this.changePercentIdPrefix, num, 'change_percent_even', CELL_TYPE_DATA);
}

View.prototype.getOpenHtml = function(symbol, num) {
    return generateCellHTML(symbol, this.openIdPrefix, num, 'open', CELL_TYPE_DATA);
}

View.prototype.getDaysLowOrHighHtml = function(symbol, num, type) {
    if (type == this.daysLowLabel) {
        return generateCellHTML(symbol, this.daysLowIdPrefix, num, 'days_low', CELL_TYPE_DATA);
    } else if (type == this.daysHighLabel) {
        return generateCellHTML(symbol, this.daysHighIdPrefix, num, 'days_high', CELL_TYPE_DATA);
    } else {
        console.error("Error: unknown parameters.");
    }
}

View.prototype.getDeleteButtonHtml = function(symbol) {
    if (symbol == this.deleteButtonLabel) {
        this.viewWidth += getClassWidth('title_delete_button');
        return '<span class="title_delete_button"></span>';
    }

    return '<i style="float: right; display: inline-block; width: ' + getClassWidth('title_delete_button') + 'px" id="' + getKey(symbol, this.deleteButtonIdPrefix) + '" class="' + fa_trash_o_grey+'"></i>';
}

View.prototype.hideAddSymbolText = function() {
    $('#addSymbolText').css('visibility', 'hidden');
}




/**
 * Update the action
 * @param quoteModel
 */
View.prototype.addDeleteButtonEvent = function(quoteModel) {
    // add the delete action
    var deleteButton = document.getElementById(getKey(quoteModel.symbol, this.deleteButtonIdPrefix));
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

View.prototype.addTitlebarClickableEvent = function() {
    // clickable the days low/high to switch between price/percentage

}