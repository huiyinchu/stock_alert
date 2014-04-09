/**
 * Created by kehuang on 4/4/14.
 */

function Controller(view, myQuoteAlert, quoteList) {
    this.view = view;
    this.myQuoteAlert = myQuoteAlert;
    this.quoteList = quoteList;
}

Controller.prototype.initView = function() {
    this.view.init(this.quoteList, this);// create the initial empty view by given symbols
}

Controller.prototype.enter = function(symbol) {
    this.updateQuote(symbol);
//    this.view.hideAddSymbolText(); // don't hide the text box
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
    var oThis = this;
    if (this.quoteList.indexOf(symbol) == -1) { // a new symbol
        this.quoteList[this.quoteList.length] = symbol;
    }
    this.yqlUpdateQuote(symbol);
}

Controller.prototype.updateAllQuotes = function() {
    this.yqlUpdateQuote(this.quoteList);
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
//    console.log(finalQuery);
    $.getJSON(url, query)
        .done(function (data){
            if (data.query.results != null) {
                var quotes = data.query.results.quote;
                if (Object.prototype.toString.call(quotes) === '[object Array]') {
                    for (var i = 0; i < quotes.length; i++) {
                        // encapsulate the information
                        var quoteModel = new QuoteModel(quotes[i]);
                        oThis.view.updateView(quoteModel);
                    }
                } else {
                    var quoteModel = new QuoteModel(quotes);
                    oThis.view.updateView(quoteModel);
                }
            }


        })
        .fail(function(jqxhr, textStatus, error){
            var err = textStatus + ", " + error;
            console.log('Request failed: ' + err);
        });
}


Controller.prototype.checkAlert = function(quoteModel) {

}


/**
 * @deprecated Google will ask for captcha.
 * @param symbol
 */
Controller.prototype.googleUpdateQuote = function(symbol) {
    var oThis = this;
    $.get(
        "http://finance.google.com/finance/info",
        {client: "ig", q: symbol},
        function (data) {
            try {
                document.write(data.t);
                document.write(data.p);
                document.write(data.c);
                document.write(data.cp);
//                var quoteModel = new QuoteModel(data.substr(5, data.length - 7)); // get the model change
//                oThis.view.updateView(quoteModel);
            } catch (err) {
                document.write("Error: " + err);
            }
        }
    );
}