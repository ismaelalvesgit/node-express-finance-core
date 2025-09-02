import { inject, injectable } from "tsyringe";
import { IBcbRepository } from "../types/IBcbRepository";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import HttpClient from "@infrastructure/axios/http";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IBcbIndexParams, IBcbInflactionIndicatorResponse, IBcbResponse, IBcbIndexResponse, IBcbNewsResponse } from "../types/INews";
import * as R from "ramda";
import { subYears } from "date-fns";
import { BcbApi } from "@infrastructure/exceptions/errorException";

@injectable()
export default class BcbRepository implements IBcbRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.bcb
        });
    }

    async index(params: IBcbIndexParams): Promise<IBcbResponse<IBcbIndexResponse>> {
        try {
            const { data } = await  this.http.send<IBcbResponse<IBcbIndexResponse>>({
                url: "/api/servico/sitebcb/bcdatasgs",
                method: "GET",
                params: R.reject(R.isNil, {
                    serie: params.type,
                    dataInicial: params.dateStart ? params.dateStart : subYears(new Date(), 1).toLocaleDateString(),
                    dataFinal: params.dateEnd ? params.dateEnd : new Date().toLocaleDateString(),
                })
            });
            return data;
        } catch (error) {
            const defaultMessage = `Failed to get ${params.type} data`;
            const message = JSON.stringify(R.pathOr(
                defaultMessage,
                ["response", "data", "error"],
                error,
            ));

            throw new BcbApi(message);
        }
    }

    async inflactionIndicator(): Promise<IBcbInflactionIndicatorResponse> {
        try {
            const { data: { conteudo } } = await  this.http.send<IBcbResponse<IBcbInflactionIndicatorResponse>>({
                url: "/api/servico/sitebcb/indicadorinflacao",
                method: "GET"
            });
            return conteudo[0];
        } catch (error) {
            const defaultMessage = "Failed to get inflactionIndicator data";
            const message = JSON.stringify(R.pathOr(
                defaultMessage,
                ["response", "data", "error"],
                error,
            ));

            throw new BcbApi(message);
        }
    }

    async news(): Promise<IBcbNewsResponse[]> {
        try {
            const { data: { conteudo } } = await  this.http.send<IBcbResponse<IBcbNewsResponse>>({
                url: "/api/servico/sitebcb/manchetes",
                method: "GET",
                params: R.reject(R.isNil, {
                    listsite: "content/home",
                    listname: "Manchetes",
                    q: "campanha",
                })
            });
            return conteudo;
        } catch (error) {
            const defaultMessage = "Failed to get news data";
            const message = JSON.stringify(R.pathOr(
                defaultMessage,
                ["response", "data", "error"],
                error,
            ));

            throw new BcbApi(message);
        }
    }
}
