/**
 * Created by kehuang on 4/3/14.
 */

/**
 * The model here is responsible for parsing the given object (json object or just a string) to the
 * structured information we want.
 *
 * @param json
 * @constructor
 */
function QuoteModel(json, mode) {
    if (mode == GOOGLE_QUERY_MODE) {
        if (json['t'] !== undefined) {
            this.symbol = json['t'];
            this.price = json['l'];
            this.changePrice = json['c'];
            this.changePercent = json['cp'] + '%';
            this.DaysLow = json['lo'];
            this.DaysHigh = json['hi'];
            this.open = json['op'];
        } else {
            console.error("Error: cannot parse JSON result from Google");
        }
    } else if (mode == YAHOO_QUERY_MODE) {
        if (json['symbol'] !== undefined) {
            this.symbol = json['symbol'];
            this.price = json['LastTradePriceOnly'];
            this.changePrice = json['Change'];
            this.changePercent = json['PercentChange'];
            this.DaysLow = json['DaysLow'];
            this.DaysHigh = json['DaysHigh'];
            this.open = json['Open'];
        } else {
            console.error("Error: cannot parse JSON result from Yahoo");
        }
    } else if (mode == WEBSERVICE_QUERY_MODE) {
        if (json['symbol'] !== undefined) {
            this.symbol = json['symbol'];
            this.price = json['price'];
            this.changePrice = json['changePrice'];
            this.changePercent = json['changePercent'];
            this.DaysLow = json['daysLow'];
            this.DaysHigh = json['daysHigh'];
            this.open = json['Open'];
        } else {
            console.error("Error: cannot parse JSON result from Webservicex");
        }
    } else {
        this.symbol = json; // now the argument is just the symbol name without any information
        this.price = '';
        this.changePrice = '';
        this.changePercent = '';
        this.DaysLow = '';
        this.DaysHigh = '';
        this.open = '';
    }

}