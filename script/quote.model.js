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
function QuoteModel(json) {
    if (json['symbol'] !== undefined) {
        this.symbol = json['symbol'];
        this.price = json['LastTradePriceOnly'];
        this.changePrice = json['Change'];
        this.changePercent = json['PercentChange'];
        this.DaysLow = json['DaysLow'];
        this.DaysHigh = json['DaysHigh'];
    } else {
        this.symbol = json; // now the argument is just the symbol name without any information
        this.price = '';
        this.changePrice = '';
        this.changePercent = '';
        this.DaysLow = '';
        this.DaysHigh = '';
    }
}