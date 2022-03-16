import * as updateInvestment from "./updateInvestment";
import * as updateDividends from "./updateDividends";
import * as asyncDividendsFiis from "./asyncDividendsFiis";
import * as asyncDividendsAcao from "./asyncDividendsAcao";
import * as asyncDividendsStoke from "./asyncDividendsStoke";
import * as asyncEventsFiis from "./asyncEventsFiis";
import * as asyncEventsAcao from "./asyncEventsAcao";
import * as asyncBalance from "./asyncBalance";
import * as backupData from "./backupData";
import * as notifyPriceDay from "./notifyPriceDay";
import * as notifyPriceCurrency from "./notifyPriceCurrency";

/**
 * @typedef Commands
 * @type {Object}
 * @property {Promise<string>} command
 * @property {String} name
 * @property {String} group
 * @property {String} schedule
 * @property {String} deadline
 */

/** @type {Array<Commands>} */
const commands = [];

commands.push(updateInvestment);
commands.push(updateDividends);
commands.push(asyncDividendsFiis);
commands.push(asyncDividendsAcao);
commands.push(asyncDividendsStoke);
commands.push(asyncEventsFiis);
commands.push(asyncEventsAcao);
commands.push(asyncBalance);
commands.push(backupData);
commands.push(notifyPriceDay);
commands.push(notifyPriceCurrency);

export default commands;