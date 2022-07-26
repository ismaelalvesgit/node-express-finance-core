import { getChannel } from "../amqpClient";
import { Logger } from "../logger";
import { MainConsumer } from "./consumers/main.consumer";
import onConsume from "./middlewares/onConsume";

const _connectConsumers = async ()=>{
    const channel = await getChannel();
    [
        new MainConsumer(onConsume)
    ].forEach((consumer)=>{
        consumer.assertQueue(channel);
    });
};

export const connect = async ()=>{
    try {
        await _connectConsumers();
        Logger.info("Registered service AMQP is ON");
    } catch (error) {
        Logger.info("Not registered service AMQP");
    }
};