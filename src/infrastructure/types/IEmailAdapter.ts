import { AxiosResponse } from "axios";

export interface IEmailAdapterAttachment {
    ContentType: string
    Filename: string
    Base64Content: string
    ContentID?: string
}

export interface IEmailAdapterReponseItemTo {
    Email: string
    MessageUUID: string
    MessageID: number
    MessageHref: string
}

export interface IEmailAdapterReponseItem {
    Status: string
    To: IEmailAdapterReponseItemTo
}

export interface IEmailAdapterReponse {
    Messages: IEmailAdapterReponseItem[]
}

export interface IEmailAdapterUser {
    email?: string
    name: string
}

export interface IEmailAdapterParams {
    to: IEmailAdapterUser
    from?: IEmailAdapterUser
    subject: string
    template: string
    data: unknown
    attachments?: IEmailAdapterAttachment[]
}

export interface IEmailAdapter {
    send(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>>
}