import { currencyApiService, currencyService } from "../services";
import { coinService } from "../socket/services";
import { Logger } from "../logger";

const name = "notify-currency";
const group = "second";
const schedule = "*/30 * 9-19 * * 1-5";
const deadline = 180;

const command = async () => {
    try {
        const currency = await currencyService.findCache();
        if (currency) {
            const data = await currencyApiService.getCurrency(currency);
            coinService.sendNotification(data);
            Logger.info("Notify price currency sucess");
        }
    } catch (error) {
        Logger.error(`Failed Notify price currency ${error}`);
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