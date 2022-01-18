import { CronJob } from "cron";
import env from "../env";
import logger from "../logger";
import * as updateInvestment from "./jobs/updateInvestment";
import * as updateDividends from "./jobs/updateDividends";
import * as asyncDividends from "./jobs/asyncDividends";

logger.info("Registered service JOB batch is ON");

const jobs = [
    new CronJob(updateInvestment.schedule, async ()=>{
        await updateInvestment.command();
    }, null, true, env.timezone),
    new CronJob(updateDividends.schedule, async ()=>{
        await updateDividends.command();
    }, null, true, env.timezone),
    new CronJob(asyncDividends.schedule, async ()=>{
        await asyncDividends.command();
    }, null, true, env.timezone),
];

logger.info(`Running ${jobs.length} jobs`);