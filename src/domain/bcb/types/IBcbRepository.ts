import { IBcbIndexParams, IBcbResponse, IBcbInflactionIndicatorResponse, IBcbIndexResponse, IBcbNewsResponse } from "./IBcb";

export interface IBcbRepository {
    index(params: IBcbIndexParams): Promise<IBcbResponse<IBcbIndexResponse>>
    inflactionIndicator(): Promise<IBcbInflactionIndicatorResponse | undefined >
    news(): Promise<IBcbNewsResponse[]>
}
