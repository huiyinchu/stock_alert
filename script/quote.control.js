/**
 * Created by kehuang on 4/4/14.
 */

var GOOGLE_QUERY_MODE = 'GoogleQueryMode';
var YAHOO_QUERY_MODE = 'YahooQueryMode';
var WEBSERVICE_QUERY_MODE = 'WebserviceQueryMode';

function Controller(view, myQuoteAlert, quoteList) {
    this.view = view;
    this.myQuoteAlert = myQuoteAlert;
    this.quoteList = quoteList;
    this.mode = GOOGLE_QUERY_MODE;
}

Controller.prototype.initView = function() {
    this.view.init(this.quoteList, this);// create the initial empty view by given symbols
}

Controller.prototype.setMode = function(mode) {
    if (mode == GOOGLE_QUERY_MODE) {
        this.mode = GOOGLE_QUERY_MODE;
    } else if (mode == YAHOO_QUERY_MODE) {
        this.mode = YAHOO_QUERY_MODE;
    } else if (mode == WEBSERVICE_QUERY_MODE) {
        this.mode = WEBSERVICE_QUERY_MODE;
    } else {
        console.error('Error: unknown mode.');
    }
}

Controller.prototype.enter = function(symbol) {
    if (this.quoteList.indexOf(symbol) == -1) { // a new symbol
        this.quoteList[this.quoteList.length] = symbol;
    }
    this.updateQuote(symbol);
}

Controller.prototype.updateAllQuotes = function() {
    this.updateQuote(this.quoteList);
}

/**
 * This method gets the live quote of the stock by the given symbol. It returns a QuoteModel object to
 * the call back function, and the call back function should use this model to update its view.
 *
 * @param symbol the symbol of the stock
 * @param updateCallback the call back function which should pass the returned QuoteModel object to update its view.
 * The call back method is 'updateHtml'.
 */
Controller.prototype.updateQuote = function (symbol) {
    // the symbol can be a single string symbol, or a list of symbols (updateAllQuotes will pass the whole list)
    if (this.mode == GOOGLE_QUERY_MODE) {
        this.googleUpdateQuote(symbol);
    } else if (this.mode == YAHOO_QUERY_MODE) {
        this.yqlUpdateQuote(symbol);
    } else if (this.mode == WEBSERVICE_QUERY_MODE) {
        this.webserviceUpdateQuote(symbol);
    } else {
        console.error('Error: unknown mode.');
    }

//    this.yqlUpdateQuote(symbol);
}


Controller.prototype.removeQuote =  function (symbol) {
    // update the list
    var index = this.quoteList.indexOf(symbol);
    if (index > -1) {
        this.quoteList.splice(index, 1);
    }
    // change the view
    this.view.removeView(symbol);
}


/**
 * This method start to get the real time information of the given ticker symbols at given interval.
 *
 * @param symbolList the string array which contains the symbols to query
 * @param interval the interval of refresh
 */
Controller.prototype.startStreamingQuote = function (interval) {
    var oThis = this;
    setInterval(function(){
        oThis.updateAllQuotes();
    }, interval);
}


/**
 * This method makes a simple query to get the latest information on stock from Yahoo finance. The returned object is
 * a JSON object which contains this information.
 * Example 1: http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22GOOG%22)&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json
 * Example 2: http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22GOOG%22%2C%20%22AAPL%22%2C%20%22YHOO%22%2C%20%22MSFT%22)&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json
 * @param symbols
 * @param callback
 */
Controller.prototype.yqlUpdateQuote = function(symbols) {

    var symbolString = '';
    if (Object.prototype.toString.call(symbols) === '[object Array]') { // if it is an array
        for (var i = 0; i < symbols.length; i++) {
            symbolString += '"' + symbols[i] + '", ';
        }
        symbolString = symbolString.substr(0, symbolString.length - 2);
    } else {
        symbolString = '"' + symbols + '"'; // if it is just a symbol string
    }
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var query = 'q=' + encodeURIComponent('select * from yahoo.finance.quotes where symbol in (' + symbolString + ')');
    query += '&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
    var oThis = this;
    var finalQuery = url + '?' + query;
    $.getJSON(url, query)
        .done(function (data){
            if (data.query.results != null) {
                var quotes = data.query.results.quote;
                if (Object.prototype.toString.call(quotes) === '[object Array]') {
                    for (var i = 0; i < quotes.length; i++) {
                        // encapsulate the information
                        var quoteModel = new QuoteModel(quotes[i], YAHOO_QUERY_MODE);
                        oThis.view.updateView(quoteModel);
                    }
                } else {
                    var quoteModel = new QuoteModel(quotes, YAHOO_QUERY_MODE);
                    oThis.view.updateView(quoteModel);
                }
            }


        })
        .fail(function(jqxhr, textStatus, error){
            var err = textStatus + ", " + error;
            console.error('Request failed: ' + err);
        });
}


Controller.prototype.checkAlert = function(quoteModel) {

}


/**
 * Google may require captcha.
 * @param symbol
 */
Controller.prototype.googleUpdateQuote = function(symbols) {
    var oThis = this;

    var baseUrl = "http://finance.google.com/finance/info";
    var query = '';

    if (Object.prototype.toString.call(symbols) === '[object Array]') { // if it is an array
        for (var i = 0; i < symbols.length; i++) {
            query += symbols[i] + ',';
        }
        query = query.substr(0, query.length - 1);
    } else {
        query = symbols;
    }

    var parameters = {client: 'ig', q: query};
    $.get(
        baseUrl,
        parameters,
        function (data) {
            try {
                var jsonString = data.substr(data.indexOf('['), data.lastIndexOf(']'));
                var jsonObjects = JSON.parse(JSON.stringify(eval("(" + jsonString + ")")));// parse the string to json object
                for (var i = 0; i < jsonObjects.length; i++) {
                    var jsonObject = jsonObjects[i];
                    var quoteModel = new QuoteModel(jsonObject, GOOGLE_QUERY_MODE); // get the model change
                    oThis.view.updateView(quoteModel);
                }
            } catch (err) {
                document.write("Error: " + err);
            }
        }
    );
}

Controller.prototype.webserviceUpdateQuote = function(symbols) {
    var query = '';
    if (Object.prototype.toString.call(symbols) === '[object Array]') { // if it is an array
        for (var i = 0; i < symbols.length; i++) {
            this.webserviceUpdateSingleQuote(symbols[i]);
        }
    } else {
        this.webserviceUpdateSingleQuote(symbols);
    }
}

Controller.prototype.webserviceUpdateSingleQuote = function(symbol) {
    var oThis = this;
    $.get(
        "http://www.webservicex.net/stockquote.asmx/GetQuote",
        {symbol: symbol},
        function (data) {
            try {
                var xmlString = data.lastElementChild.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                // use jQuery to parse
                var xml = $.parseXML(xmlString);

                var xmlDoc;
                if (window.DOMParser){
                    var parser=new DOMParser();
                    xmlDoc=parser.parseFromString(xmlString,"text/xml");
                } else {
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async=false;
                    xmlDoc.loadXML(xmlString);
                }

                // StockQuotes, Stock,Symbol
                var allStocks = xmlDoc.getElementsByTagName('StockQuotes')[0].childNodes;
                for (var i = 0; i < allStocks.length; i++) {
                    var symbol = xmlDoc.getElementsByTagName('Symbol')[i].childNodes[0].nodeValue;
                    var price = xmlDoc.getElementsByTagName('Last')[i].childNodes[0].nodeValue.toString();
                    var changePrice = xmlDoc.getElementsByTagName('Change')[i].childNodes[0].nodeValue;
                    var changePercent = xmlDoc.getElementsByTagName('PercentageChange')[i].childNodes[0].nodeValue.toString();// contains %
                    var daysLow = xmlDoc.getElementsByTagName('Low')[i].childNodes[0].nodeValue.toString();
                    var daysHigh = xmlDoc.getElementsByTagName('High')[i].childNodes[0].nodeValue;
                    var json = new Object();
                    json['symbol'] = symbol;
                    json['price'] = price;
                    json['changePrice'] = changePrice;
                    json['changePercent'] = changePercent;
                    json['daysLow'] = daysLow;
                    json['daysHigh'] = daysHigh;
                    var quoteModel = new QuoteModel(json, WEBSERVICE_QUERY_MODE); // get the model change
                    oThis.view.updateView(quoteModel);
                }
            } catch (err) {
                document.write("Error: " + err);
            }
        }
    );
}