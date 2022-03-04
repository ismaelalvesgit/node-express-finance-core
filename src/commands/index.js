import * as updateInvestment from "./updateInvestment";
import * as updateDividends from "./updateDividends";
import * as asyncDividendsFiis from "./asyncDividendsFiis";
import * as asyncDividendsAcao from "./asyncDividendsAcao";
import * as asyncDividendsStoke from "./asyncDividendsStoke";
import * as asyncEventsFiis from "./asyncEventsFiis";
import * as asyncEventsAcao from "./asyncEventsAcao";
import * as backupData from "./backupData";
import * as notifyPriceDay from "./notifyPriceDay";

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
commands.push(backupData);
commands.push(notifyPriceDay);

export default commands;