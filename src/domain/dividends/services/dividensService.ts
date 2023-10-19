import { inject, injectable } from "tsyringe";
import { IDividendsService } from "../types/IDividendsService";
import { IQueryData, IPagination, IInnerJoinData } from "@helpers/ICommon";
import { EDividendsStatus, IDividends } from "../types/IDividends";
import { tokens } from "@di/tokens";
import { IDividendsRepository } from "../types/IDividendsRepository";
import { BrokerSelect } from "@domain/broker/types/IBroker";
import { InvestmentSelect } from "@domain/investment/types/IInvestiment";
import { IBrokerRepository } from "@domain/broker/types/IBrokerRepository";
import { NotFound } from "@infrastructure/exceptions/errorException";
import { IInvestmentRepository } from "@domain/investment/types/IInvestmentRepository";
import Common from "@helpers/Common";
import { Logger } from "@infrastructure/logger/logger";
import { ITransactionRepository } from "@domain/transaction/types/ITransactionRepository";
import { Config } from "@config/config";
import { CategoryIsBR } from "@domain/category/types/ICategory";
import DateHelper from "@helpers/Date";

@injectable()
export default class DividendsService implements IDividendsService {

    private defaultJoin: IInnerJoinData[] = [
        {
            tableName: "broker",
            key: "id",
            reference: "brokerId",
            columns: BrokerSelect
        },
        {
            tableName: "investment",
            key: "id",
            reference: "investmentId",
            columns: InvestmentSelect
        }
    ];

    constructor(
        @inject(tokens.Config)
        private config: Config,

        @inject(tokens.DividendsRepository)
        private dividendsRepository: IDividendsRepository,

        @inject(tokens.BrokerRepository)
        private brokerRepository: IBrokerRepository,

        @inject(tokens.InvestmentRepository)
        private investmentRepository: IInvestmentRepository,

        @inject(tokens.TransactionRepository)
        private transactionRepository: ITransactionRepository
    ) { }

    async autoCreate(data: IDividends[]): Promise<void> {
        await this.dividendsRepository.transaction(async(trx)=>{
            await Promise.all(data.map(async({ investmentId, type, dateBasis, dueDate, price, fees }) => {
                const transactions = await this.transactionRepository.findTransactionByBrokerQntCount({investmentId}, dateBasis, trx);
                await Promise.all(transactions.map(async({ qnt, broker: { id: brokerId, name }, currency })=>{
                    const total = Number(qnt) * Number(price);
                    const dividendCreate = {
                        investmentId,
                        brokerId,
                        dateBasis,
                        dueDate,
                        price,
                        qnt,
                        type,
                        total,
                        fees: Common.parsePercent(fees ?? 0, total),
                        currency
                    } as IDividends;
                    const dividendCreateFind = {
                        investmentId,
                        brokerId,
                        dateBasis,
                        dueDate,
                        type,
                    } as IDividends;
                    const dividends = await this.dividendsRepository.findOrCreate(dividendCreate, trx, dividendCreateFind);
                    if(dividends && Number(qnt) !== Number(dividends.qnt)){
                        // Update qnt after created last time
                        await this.dividendsRepository.update(
                            dividends.id, 
                            { qnt, price, total }, 
                            trx
                        );
                    }
                    Logger.info(`Auto created dividend, ${JSON.stringify({ 
                        investmentId, 
                        broker: name,                                        
                        dateBasis, 
                        dueDate, 
                        price
                    })}`);
                }));
            }));
        });
    }

    async paid(dueDate: Date): Promise<void> {
       await this.dividendsRepository.transaction(async(trx)=>{
            const dividends = await this.dividendsRepository.findUpdateStatusByPaid(DateHelper.formatDate(dueDate), trx);
            await Promise.all(dividends.map(async ({ id, investment, broker, dateBasis, price, category: { name: categoryType } }) => {
                try {
                    const transactions = await this.transactionRepository.findTransactionByBrokerQntCount(
                        {brokerId: broker.id, investmentId: investment.id}, 
                        dateBasis, 
                        trx
                    );
                    await Promise.all(transactions.map(async({qnt})=>{
                        const fees = CategoryIsBR(categoryType) ? 0 : this.config.get().system.fees.outsidePercent;
                        const total = Number(qnt) * Number(price);
                        return this.dividendsRepository.update(id, {
                            status: EDividendsStatus.PAID,
                            qnt,
                            price,
                            total,
                            fees: Common.parsePercent(fees, total)
                        }, trx);
                    }));
                } catch (error) {
                    Logger.error(`Failed to update dividend - error: ${error}`);
                }
            }));
       });
    }

    find(params: Partial<IQueryData>): Promise<IPagination<IDividends>> {
        return this.dividendsRepository.find({
            ...params,
            join: this.defaultJoin
        });
    }

    findById(id: string | number): Promise<IDividends> {
        return this.dividendsRepository.findById(id, this.defaultJoin);
    }

    async create(data: IDividends): Promise<void> {
        await this.dividendsRepository.transaction(async(trx)=>{
            const broker = await this.brokerRepository.findById(data.brokerId, undefined, trx);
            if (!broker) throw new NotFound("Broker");
            
            const investment = await this.investmentRepository.findById(data.investmentId, undefined, trx);
            if (!investment) throw new NotFound("Investment");
            
            return this.dividendsRepository.create({
                ...data,
                total: Number(data.qnt) * Number(data.price)
            }, trx);
        });
    }

    async update(id: string | number, data: IDividends): Promise<void> {
        await this.dividendsRepository.transaction(async(trx)=>{
            if (data.brokerId) {
                const broker = await this.brokerRepository.findById(data.brokerId, undefined, trx);
                if (!broker) throw new NotFound("Broker");
            }
       
            if (data.investmentId) {
                const investment = await this.investmentRepository.findById(data.investmentId, undefined, trx);
                if (!investment) throw new NotFound("Investment");
            }

            if (data.qnt && data.price) {
                data.total = Number(data.qnt) * Number(data.price);
            }

            return this.dividendsRepository.update(id, data, trx);
        });
    }

    delete(id: string | number): Promise<void> {
        return this.dividendsRepository.delete(id);
    }

}
