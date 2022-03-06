import { currencyApiService, currencyService } from "../services";
import { coinService } from "../socket/services";
import logger from "../logger";

const name = "notify-currency";
const group = "second";
const schedule = "*/30 * * * * 1-5";
const deadline = 180;

const command = async () => {
    try {
        const currency = await currencyService.findCache();
        if (currency) {
            const data = await currencyApiService.getCurrency(currency);
            coinService.sendNotification(data);
            logger.info("Notify price currency sucess");
        }
    } catch (error) {
        logger.error(`Failed Notify price currency ${error}`);
    }
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};