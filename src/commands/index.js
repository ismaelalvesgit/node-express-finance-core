import * as example from "./example";

/**
 * @typedef Command
 * @type {Object}
 * @property {Promise<String>} command
 * @property {String} name
 * @property {String} group
 * @property {String} schedule
 */

const commands = [];

commands.push(example);

export default commands;
