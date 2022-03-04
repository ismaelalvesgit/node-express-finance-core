import { CronJob } from "cron";
import env from "../env";
import logger from "../logger";
import commands from "../commands";

const jobs = [];

if(env.env === "development"){
    logger.info("Registered service JOB batch is ON");
    commands.forEach((job)=>{
        jobs.push(
            new CronJob(job.schedule, async ()=>{
                await job.command();
            }, null, true, env.timezone),
        );
    });
}else{
    logger.info("Not Registered service JOB batch is OFF NODE_ENV is not development");
}

logger.info(`Running ${jobs.length} jobs`);