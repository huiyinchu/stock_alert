/**
 * Created by kehuang on 4/8/14.
 */
var initialQuoteList = ["BAC", "GOOG", "TSLA", "WUBA", "FEYE", "VEEV", "KNDI", "DDD", 'BID', 'KATE'];
var view = new View();
var myQuoteAlert = new MyQuoteAlert(initialQuoteList);
var controller = new Controller(view, myQuoteAlert, initialQuoteList);

//function removeQuote(symbol) {
//    controller.removeQuote(symbol);
//}

function showAddQuoteText() {
    $('#addSymbolText').css('visibility', 'visible');
}

$(document).ready(function () {
    startStockAlert();
});

function googleQueryTest() {
    controller.googleUpdateQuote("BAC");
}

function startStockAlert() {
    var oTextbox = new AutoSuggestControl(document.getElementById("addSymbolText"), new StateSuggestions(), controller);
    controller.initView(); // make the initial view

//    controller.setMode(YAHOO_QUERY_MODE);
//    controller.setMode(WEBSERVICE_QUERY_MODE);
//    controller.updateQuote(['GOOG', 'AAPL']);
//    controller.updateQuote('GOOG');

    controller.startStreamingQuote(1000);
}