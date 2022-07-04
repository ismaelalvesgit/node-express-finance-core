import * as R from "ramda";
import { Logger } from "../../logger";

/**
 * @param {Array} handlers
 */
export default (handlers)=> {
  return R.tryCatch(
    R.ifElse(
      // verify if the list of handlers has at least one handler
      (l) => R.gte(R.length(l), 1),
      // creates a pipe with all handlers
      (l) => R.pipe(...l),
      () => { throw new Error("Invalid number of handlers"); },
    ),
    // catch the execution error
    R.tap((e) => Logger.error(`Error: ${e}`)),
  )(handlers);
};