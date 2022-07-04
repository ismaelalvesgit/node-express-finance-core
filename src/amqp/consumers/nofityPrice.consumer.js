import elasticAgent from "../../apm";
import { Logger } from "../../logger";
import { sendNotification } from "../../socket/services/main.socket.service";
import { ValidadeSchema } from "../../utils/erro";
import parseMessage from "../middlewares/parse";
import validator from "../middlewares/validator";
import { notifySchema } from "./schemas/notify";

export class NotfyPriceConsumer {

    _onConsume

    consumers = {
        main: "notify-price-socket"
    }

    constructor(_onConsume){
        this._onConsume = _onConsume;
    }


    /**
     * 
     * @param {import('amqplib').Channel} channel 
     */
    assertQueue(channel){
        channel.consume(
            this.consumers.main,
            this._onConsume(
                channel,
                this._finisher.bind(this),
                parseMessage,
                validator(notifySchema),
                this.notify
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
    ){
        if(error){
            let response;
            switch (error.constructor) {
                case ValidadeSchema: {
                    response = JSON.parse(error.message).map((i)=>{
                        return {
                            name: i.context.key,
                            message: i.message
                        };
                    });
                    break;
                }
                default: 
                    if(elasticAgent){
                        elasticAgent.captureError(error);
                    }
                    break;
            }
            Logger.error(`${message.fields.routingKey} ${JSON.stringify(response)}`);
        }
        channel.ack(message);
    }

    /**
     * 
     * @param {{
     *  fields: import('amqplib').MessageFields,
     *  properties: import('amqplib').MessageProperties,
     *  content: import('../../model/contato.model').Contato,
     * }} msg 
     */
    async notify(msg){
        const { key, data } = msg.content;
        await sendNotification(key, data)
    }
}