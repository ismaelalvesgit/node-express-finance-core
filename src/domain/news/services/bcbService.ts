import { inject, injectable } from "tsyringe";
import { IBcbService } from "../types/IBcbService";
import { IBcbIndex, IBcbIndexParams, IBcbInflactionIndicator, IBcbNews } from "../types/INews";
import { tokens } from "@di/tokens";
import { IBcbRepository } from "../types/IBcbRepository";
import BcbMapper from "../mapper/bcbMapper";
import { Config } from "@config/config";
import { IInvestRepository } from "@domain/investment/types/IInvestRepository";
import { IIndex, IIndexer, IIndexerParams, IIndexParams } from "@domain/investment/types/IInvest";
import { NotFound } from "@infrastructure/exceptions/errorException";

@injectable()
export default class BcbService implements IBcbService {

    constructor(
        @inject(tokens.Config)
        private config: Config,

        @inject(tokens.BcbRepository)
        private bcbRepository: IBcbRepository,
        
        @inject(tokens.InvestRepository)
        private investRepository: IInvestRepository,
    ) { }

    async indexer(params: IIndexerParams): Promise<IIndexer> {
        const data = await this.investRepository.indexer(params);
        return BcbMapper.indexerMapper(data);
    }

    async indexV2(params: IIndexParams): Promise<IIndex[]> {
        return await this.investRepository.index(params);
    }

    async index(params: IBcbIndexParams): Promise<IBcbIndex[]> {
        const { conteudo } = await this.bcbRepository.index(params);
        return BcbMapper.indexMapper(conteudo);
    }

    async inflactionIndicator(): Promise<IBcbInflactionIndicator> {
        const data = await this.bcbRepository.inflactionIndicator();
        if(!data?.Acumulada) throw new NotFound("Bcb");
        return BcbMapper.inflactionIndicatorMapper(data);
    }

    async news(): Promise<IBcbNews[]> {
        const data = await this.bcbRepository.news();
        return BcbMapper.newsMapper(data, this.config.get().backend.bcb);
    }
    
}
