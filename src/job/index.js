import { CronJob } from "cron";
import env from "../env";
import logger from "../logger";
import * as updateInvestment from "./jobs/updateInvestment";
import * as updateDividends from "./jobs/updateDividends";
import * as asyncDividendsFiis from "./jobs/asyncDividendsFiis";
import * as asyncDividendsAcao from "./jobs/asyncDividendsAcao";
import * as backupData from "./jobs/backupData";

logger.info("Registered service JOB batch is ON");

const jobs = [
    new CronJob(updateInvestment.schedule, async ()=>{
        await updateInvestment.command();
    }, null, true, env.timezone),
    new CronJob(updateDividends.schedule, async ()=>{
        await updateDividends.command();
    }, null, true, env.timezone),
    new CronJob(asyncDividendsFiis.schedule, async ()=>{
        await asyncDividendsFiis.command();
    }, null, true, env.timezone),
    new CronJob(asyncDividendsAcao.schedule, async ()=>{
        await asyncDividendsAcao.command();
    }, null, true, env.timezone),
    new CronJob(backupData.schedule, async ()=>{
        await backupData.command();
    }, null, true, env.timezone),
];

logger.info(`Running ${jobs.length} jobs`);