import { IHeaders, RecordMetadata } from "kafkajs";

export interface IKafkaAdapterParams {
    topic: string
}

export interface IKafkaAdapter {
    execute(data: Object[] | Object, headers?: IHeaders): Promise<RecordMetadata[]>
}