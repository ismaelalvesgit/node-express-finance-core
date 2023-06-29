import { Config } from "@config/config";
import { IKafkaAdapter, IKafkaAdapterParams } from "@infrastructure/types/IkafkaAdapter";
import { Producer, Kafka, Partitioners, Message, IHeaders, RecordMetadata } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

export default class KafkaClient implements IKafkaAdapter {
    
    protected topic: string;
    protected kafka?: Kafka;
    protected producer?: Producer;

    constructor({ topic }: IKafkaAdapterParams){
        const { kafka: { brokers, connectionTimeout }, serviceName } = new Config().get();
        this.topic = topic;
        this.kafka = brokers.length > 0 ? new Kafka({
            brokers,
            clientId: serviceName,
            connectionTimeout: connectionTimeout,
        }) : undefined;

        this.producer = this.kafka?.producer({
            createPartitioner: Partitioners.LegacyPartitioner, 
            transactionTimeout: 3000,
            allowAutoTopicCreation: true
        });
    }

    async execute(data: Object[] | Object, headers?: IHeaders): Promise<RecordMetadata[]> { 
        if(this.kafka == undefined || this.producer === undefined){
            return [];
        }

        let messages: Message[] = [];
        const identifier = uuidv4();

        if(!Array.isArray(data)){
            messages.push({
                timestamp: new Date().getTime().toString(),
                value: JSON.stringify({
                    ...data,
                    identifier
                }),
                headers,

            });
        } else {
            messages = data.map((message: Object)=>{
                return {
                    timestamp: new Date().getTime().toString(),
                    value: JSON.stringify({
                        ...message,
                        identifier
                    }),
                    headers
                };
            });
        }

        await this.producer?.connect();
        const record = await this.producer?.send({
            topic: this.topic,
            messages
        });
        await this.producer?.disconnect();

        return record;
    }
}