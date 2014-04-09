/**
 * Created by kehuang on 4/8/14.
 */
var initialQuoteList = ["BAC", "GOOG", "TSLA", "WUBA", "FEYE", "VEEV", "KNDI", "DDD"];
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
    controller.startStreamingQuote(1000);
}