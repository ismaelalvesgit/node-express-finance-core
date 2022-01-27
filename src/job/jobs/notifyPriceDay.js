import { investmentService } from "../../services";
import { isSaturday, isSunday } from "date-fns";
import logger from "../../logger";
import { send } from "../../utils/mail";
import env from "../../env";

const name = "notify-price-day";
const group = "day";
const schedule = "10 18 * * *";
const deadline = 180;

const command = async () => { 
    if(!isSaturday(new Date()) && !isSunday(new Date())){
        const priceHigh = await investmentService.findAll(null, null, "changePercentDay", "desc", 3);
        const priceLow = await investmentService.findAll(null, null, "changePercentDay", "asc", 3);
        await send({
            to: env.email.notificator, 
            subject: "Altas / Baixas do Dia",
            template: "price-day", 
            data: {
                url: env.server.url,
                priceHigh: priceHigh.filter((e) => priceLow.include((t) => t.id = e.id)),
                priceLow
            },
        });
        logger.info("Notify price day sucess");
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