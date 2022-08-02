import elasticAgent from "../../apm";
import { Logger } from "../../logger";
import { sendNotification } from "../../socket/services/main.socket.service";
import { ValidadeSchema } from "../../utils/erro";
import parseMessage from "../middlewares/parse";
import validator from "../middlewares/validator";
import { investmentSchema } from "./schemas/investment";
import { notifySchema } from "./schemas/notify";
import knex from "../../db";
import { investmentService } from "../../services";
import { delKeysCache } from "../../utils/cache";

export class MainConsumer {

    _onConsume

    consumers = {
        notifyPrice: "notify-price-socket",
        updateInvestment: "update-investment-data",
    }

    constructor(_onConsume) {
        this._onConsume = _onConsume;
    }


    /**
     * 
     * @param {import('amqplib').Channel} channel 
     */
    assertQueue(channel) {
        channel.consume(
            this.consumers.notifyPrice,
            this._onConsume(
                channel,
                this._finisher.bind(this),
                parseMessage,
                validator(notifySchema),
                this.notify
            )
        );
        channel.consume(
            this.consumers.updateInvestment,
            this._onConsume(
                channel,
                this._finisher.bind(this),
                parseMessage,
                validator(investmentSchema),
                this.updateInvestment
            )
        );
    }

    /**
     * 
     * @param {import('amqplib').Channel} channel 
     * @param {*} message 
     * @param {*} err 
     */
    _finisher(
        channel,
        message,
        error
    ) {
        const { fields, content } = message;
        try {
            if (fields.deliveryTag > 5 && error) {
                Logger.error(`FAIL TO CONSUMER,
                    ROUTER KEY: ${fields.routingKey} - 
                    EXCHANGE: ${fields.exchange} - 
                    DATA: ${JSON.stringify(content)}`
                );
                channel.ack(message);
            }

            if (error) {
                let response = error;
                switch (error.constructor) {
                    case ValidadeSchema: {
                        response = JSON.parse(error.message).map((i) => {
                            return {
                                name: i.context.key,
                                message: i.message
                            };
                        });
                        break;
                    }
                    default:
                        if (elasticAgent) {
                            elasticAgent.captureError(response);
                        }
                        break;
                }
                Logger.error(`${message.fields.routingKey} ${JSON.stringify(response)}`);
                channel.nack(message);
            }
            channel.ack(message);
        } catch (err) {
            if (elasticAgent) {
                elasticAgent.captureError(err);
            }
            channel.nack(message);
        }
    }

    /**
     * 
     * @param {{
     *  fields: import('amqplib').MessageFields,
     *  properties: import('amqplib').MessageProperties,
     *  content: import('../../model/contato.model').Contato,
     * }} msg 
     */
    async notify(msg) {
        const { key, data } = msg.content;
        await sendNotification(key, data);
    }

    /**
     * 
     * @param {{
     *  fields: import('amqplib').MessageFields,
     *  properties: import('amqplib').MessageProperties,
     *  content: import('../../model/contato.model').Contato,
     * }} msg 
     */
    async updateInvestment(msg) {
        const clearCachePath = ["investment", "transaction", "dividends"];
        const investments = msg.content;
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async (invest) => {
                try {
                    const id = invest.id;
                    delete invest.id;
                    await investmentService.update({ id }, invest, trx);
                    Logger.error(`Update investment: ${invest?.name}`);
                } catch (error) {
                    Logger.error(`Faill to update investment: ${invest.name} - error: ${error}`);
                }
            }));
        });
        delKeysCache(clearCachePath);
    }

}