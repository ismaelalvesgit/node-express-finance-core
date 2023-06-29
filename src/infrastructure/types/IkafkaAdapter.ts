import { IHeaders, RecordMetadata } from "kafkajs";

export interface IKafkaAdapterParams <IEntity> {
    topic: string
    data: IEntity[] | IEntity, 
    headers?: IHeaders
}

export interface IKafkaAdapter {
    execute<IEntity>(params: IKafkaAdapterParams<IEntity>): Promise<RecordMetadata[]>
}