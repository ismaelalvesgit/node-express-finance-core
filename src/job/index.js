import { CronJob } from "cron";
import env from "../env";
import logger from "../logger";
import commands from "../commands";

if(env.env === "development"){
    logger.info("Registered service JOB batch is ON");
    commands.forEach((job)=>{
        new CronJob(job.schedule, async ()=>{
            await job.command();
        }, null, true, env.timezone);
    });
    logger.info(`Running ${commands.length} jobs`);
}else{
    logger.info(`Not Registered service JOB batch is OFF NODE_ENV is not development is ${env.env}`);
}
