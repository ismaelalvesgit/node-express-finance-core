import { Config } from "@config/config";
import { tokens } from "@di/tokens";
import { IKafkaAdapter, IKafkaAdapterParams } from "@infrastructure/types/IkafkaAdapter";
import { Producer, Kafka, Partitioners, Message, RecordMetadata } from "kafkajs";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

@injectable()
export default class KafkaClient implements IKafkaAdapter {
    
    protected kafka?: Kafka;
    protected producer?: Producer;

    constructor(
        @inject(tokens.Config)
        private config: Config,
    ){
        const { kafka: { brokers, connectionTimeout }, serviceName } = this.config.get();
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

    async execute<IEntity>({topic, data, headers}: IKafkaAdapterParams<IEntity>): Promise<RecordMetadata[]> { 
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
            messages = data.map((message: IEntity)=>{
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
            topic,
            messages
        });
        await this.producer?.disconnect();

        return record;
    }
}