
import { inject, injectable } from "tsyringe";
import { IInvestmentService } from "../types/IInvestmentService";
import { IQueryData, IPagination, IInnerJoinData } from "@helpers/ICommon";
import { IInvestment } from "../types/IInvestiment";
import { tokens } from "@di/tokens";
import { IInvestmentRepository } from "../types/IInvestmentRepository";
import { CategorySelect, ECategoryType } from "@domain/category/types/ICategory";
import { ICategoryRepository } from "@domain/category/types/ICategoryRepository";
import { BadRequest, NotFound } from "@infrastructure/exceptions/errorException";
import { IQuoteBrapi } from "../types/IBrapi";
import { IBrapiRepository } from "../types/IBrapiRepository";
import { Knex } from "knex";
import { ITransactionRepository } from "@domain/transaction/types/ITransactionRepository";
import { Logger } from "@infrastructure/logger/logger";
import { IInvestmentViewRepository } from "../types/IInvestmentViewRepository";

@injectable()
export default class InvestmentService implements IInvestmentService {

    private defaultJoin: IInnerJoinData[] = [
        {
            tableName: "category",
            key: "id",
            reference: "categoryId",
            columns: CategorySelect
        }
    ];

    constructor(
        @inject(tokens.InvestmentRepository)
        private investmentRepository: IInvestmentRepository,

        @inject(tokens.InvestmentViewRepository)
        private investmentViewRepository: IInvestmentViewRepository,

        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,

        @inject(tokens.TransactionRepository)
        private transactionRepository: ITransactionRepository,

        @inject(tokens.BrapiRepository)
        private brapiRepository: IBrapiRepository,
    ) { }

    async syncBalance(trx?: Knex.Transaction<any, any[]> | undefined): Promise<void> {
        const investments = await this.investmentRepository.getSyncBalances(trx);
        await Promise.all(investments.map(async ({ id, name, balance, asyncBalance }) => {
            try {
                if (Number(balance) !== Number(asyncBalance)) {
                    return await this.investmentRepository.update(id, {balance: asyncBalance}, trx);
                }
            } catch (error) {
                Logger.error(`Falied to async balance investment ${name}, error: ${error}`);
            }
        }));
    }

    async updateBalance(id: number, trx?: Knex.Transaction<any, any[]> | undefined): Promise<void> {
        const balance = await this.investmentRepository.getBalance(id, trx);
        await this.investmentRepository.update(id, {
            balance: Number(balance) || 0
        }, trx);
    }

    getQoute(symbol: string, category: ECategoryType): Promise<IQuoteBrapi> {
       return this.brapiRepository.getQoute(symbol, category);
    }

    find(params: Partial<IQueryData>): Promise<IPagination<IInvestment>> {
        return this.investmentViewRepository.find({
            ...params
        });
    }

    findById(id: string | number): Promise<IInvestment> {
        return this.investmentViewRepository.findById(id);
    }

    async create(data: IInvestment, trx?: Knex.Transaction): Promise<void> {
        const investment = await this.investmentRepository.findOne({name: data.name}, undefined, trx);
        if(investment) throw new BadRequest({message: data.name});

        const category = await this.categoryRepository.findById(data.categoryId, undefined, trx);
        if(!category) throw new NotFound("Category");

        await this.getQoute(data.name, category.name); // Check is symbol exist

        return this.investmentRepository.create(data, trx);
    }

    async update(id: string | number, data: IInvestment, trx?: Knex.Transaction): Promise<void> {        
        if (data.categoryId) {
            const category = await this.categoryRepository.findById(data.categoryId, undefined, trx);
            if(!category) throw new NotFound("Category");
        }

        if(data.name){
            const investment = await this.investmentRepository.findById(id, this.defaultJoin, trx);
            await this.getQoute(data.name, investment.category.name); // Check is symbol exist
        }

        if (data.logoUrl && data.logoUrl.endsWith("favicon.svg")) {
            data.logoUrl = 
            "https://raw.githubusercontent.com/ismaelalvesgit/node-express-finance/master/src/public/uploads/system/default.png";
        }
        
        return this.investmentRepository.update(id, data, trx);
    }

    
    batchUpdate(data: IInvestment[]): Promise<IInvestment[]> {
        return this.investmentRepository.transaction(async (trx) => {
            return Promise.all(data.map(async(investment)=>{
                await this.update(investment.id, investment, trx);
                return this.investmentRepository.findById(investment.id, undefined, trx);
            }));
        });
    }

    async delete(id: string | number): Promise<void> {
        await this.investmentRepository.transaction(async (trx)=>{
            const transaction = await this.transactionRepository.findOne({investmentId: Number(id)}, undefined, trx);
            if (transaction) {
                throw new BadRequest({code: "Transaction.exist"});
            }
            return this.investmentRepository.delete(id, trx);
        });
    }

}
