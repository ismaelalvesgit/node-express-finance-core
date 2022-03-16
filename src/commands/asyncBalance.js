import { investmentService } from "../services";
import logger from "../logger";

const name = "async-balance";
const group = "day";
const schedule = "0 10,20 * * 1-5";
const deadline = 180;

const command = async () => {
    const data = await investmentService.syncBalance();
    await Promise.all(data.map(async(e)=>{
        const { id, name: investment, balance, asyncBalance } = e;
        try {
            if(Number(balance) !== Number(asyncBalance)){
                await investmentService.update({
                    id
                }, {
                    balance: asyncBalance
                });
                logger.info(`Aync Balance Investment ${investment}`);
            }    
        } catch (error) {
            logger.error(`Falied to async balance investment ${investment}, error: ${error}`);
        }
    }));
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};