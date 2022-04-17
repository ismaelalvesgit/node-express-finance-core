import { CronJob } from "cron";
import env from "../env";
import { Logger } from "../logger";
import commands from "../commands";

if(env.env === "development"){
    Logger.info("Registered service JOB batch is ON");
    commands.forEach((job)=>{
        new CronJob(job.schedule, async ()=>{
            await job.command();
        }, null, true, env.timezone);
    });
    Logger.info(`Running ${commands.length} jobs`);
}else{
    commands.forEach((job)=>{
        new CronJob(job.schedule, async ()=>{
            if(job.group === "second"){
                await job.command();
            }
        }, null, true, env.timezone);
    });
    Logger.info(`Not Registered ALL service JOB batch is OFF NODE_ENV is not development is ${env.env} registered jobs group "second"`);
}
