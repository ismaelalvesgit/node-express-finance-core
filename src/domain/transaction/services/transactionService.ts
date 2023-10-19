import { inject, injectable } from "tsyringe";
import { ITransactionService } from "../types/ITransactionService";
import { IQueryData, IPagination, IInnerJoinData, EWhereOperator } from "@helpers/ICommon";
import { ETransactionEventDirection, ETransactionType, ITransaction, ITransactionEventQnt } from "../types/ITransaction";
import { tokens } from "@di/tokens";
import { ITransactionRepository } from "../types/ITransactionRepository";
import { BrokerSelect } from "@domain/broker/types/IBroker";
import { InvestmentSelect } from "@domain/investment/types/IInvestiment";
import { IInvestmentRepository } from "@domain/investment/types/IInvestmentRepository";
import { IBrokerRepository } from "@domain/broker/types/IBrokerRepository";
import { BadRequest, NotFound } from "@infrastructure/exceptions/errorException";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";
import { ICategoryRepository } from "@domain/category/types/ICategoryRepository";
import { IInvestmentViewRepository } from "@domain/investment/types/IInvestmentViewRepository";
import { IDividendsRepository } from "@domain/dividends/types/IDividendsRepository";

@injectable()
export default class TransactionService implements ITransactionService {

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
        @inject(tokens.TransactionRepository)
        private transactionRepository: ITransactionRepository,
       
        @inject(tokens.DividendsRepository)
        private dividendsRepository: IDividendsRepository,

        @inject(tokens.InvestmentRepository)
        private investmentRepository: IInvestmentRepository,

        @inject(tokens.InvestmentViewRepository)
        private investmentViewRepository: IInvestmentViewRepository,

        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,

        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,

        @inject(tokens.BrokerRepository)
        private brokerRepository: IBrokerRepository,
    ) { }

    private async groupingTransaction(params: ITransactionEventQnt){
        await this.transactionRepository.transaction(async(trx)=>{
            const quantity = Number(params.quantity);
            const [transactions, dividends] = await Promise.all([
                this.transactionRepository.find(
                    {filterBy: [`investmentId ${EWhereOperator.Equal} ${params.investmentId}`]},
                    trx
                ),
                this.dividendsRepository.find(
                    {filterBy: [`investmentId ${EWhereOperator.Equal} ${params.investmentId}`]},
                    trx
                )
            ])

            if(transactions.items.length === 0) throw new NotFound("InvestmentId");

            await Promise.all(transactions.items.map(async({id, qnt, total})=>{
                const newQnt = Number(qnt) / quantity;
                const newPrice = Number(total) / newQnt;
                return this.transactionRepository.update(id, {
                    qnt: newQnt,
                    price: newPrice
                }, trx);
            }));
            
            await Promise.all(dividends.items.map(async({id, qnt, total})=>{
                const newQnt = Number(qnt) / quantity;
                const newPrice = Number(total) / newQnt;
                return this.dividendsRepository.update(id, {
                    qnt: newQnt,
                    price: newPrice
                }, trx);
            }));
        });
    }

    private async splitTransaction(params: ITransactionEventQnt){
        await this.transactionRepository.transaction(async(trx)=>{
            const quantity = Number(params.quantity);
            const [transactions, dividends] = await Promise.all([
                this.transactionRepository.find(
                    {filterBy: [`investmentId ${EWhereOperator.Equal} ${params.investmentId}`]},
                    trx
                ),
                this.dividendsRepository.find(
                    {filterBy: [`investmentId ${EWhereOperator.Equal} ${params.investmentId}`]},
                    trx
                )
            ])

            if(transactions.items.length === 0) throw new NotFound("InvestmentId");

            await Promise.all(transactions.items.map(async({id, qnt, price})=>{
                const newQnt = Number(qnt) * quantity;
                const newPrice = Number(price) / quantity;
                return this.transactionRepository.update(id, {
                    qnt: newQnt,
                    price: newPrice
                }, trx);
            }));
            
            await Promise.all(dividends.items.map(async({id, qnt, price})=>{
                const newQnt = Number(qnt) * quantity;
                const newPrice = Number(price) / quantity;
                return this.dividendsRepository.update(id, {
                    qnt: newQnt,
                    price: newPrice
                }, trx);
            }));
        });
    }

    async event(params: ITransactionEventQnt): Promise<void> {
        if(params.direction === ETransactionEventDirection.GROUPING)
            return this.groupingTransaction(params);
        return this.splitTransaction(params);
    }

    find(params: Partial<IQueryData>): Promise<IPagination<ITransaction>> {
        return this.transactionRepository.find({
            ...params,
            join: this.defaultJoin
        });
    }

    findById(id: string | number): Promise<ITransaction> {
        return this.transactionRepository.findById(id, this.defaultJoin);
    }

    async create(data: ITransaction): Promise<void> {
        await this.transactionRepository.transaction(async(trx)=>{
            const [broker, investmentDb] = await Promise.all([
                this.brokerRepository.findById(data.brokerId, undefined, trx),
                this.investmentViewRepository.findOne({name: data.investment.name}, undefined, trx),
            ]);
            if(!broker) throw new NotFound("Broker");
            let investment = investmentDb;

            if(!investment){
                // Created Investment
                const category = await this.categoryRepository.findOne({name: data.category}, undefined, trx);
                await this.investmentRepository.create({ name: data.investment.name, categoryId: category.id }, trx);
                investment = await this.investmentViewRepository.findOne({name: data.investment.name}, undefined, trx);
            }

            let total = 0;
            let qnt = 0;
            let profit = 0;

            if(data.type === ETransactionType.BUY){
                total = Number(data.qnt) * Number(data.price);
                qnt = Number(data.qnt);
            }else{
                total = (Number(data.qnt) * Number(data.price)) * -1;
                qnt = Number(data.qnt) * -1;
                profit = (Number(data.price) - Number(investment.priceAverage)) * Number(data.qnt);
                if(Number(data.qnt) >= Number(investment.qnt)){
                    const block = Number(data.qnt) > Number(investment.qnt);
                    if(block) throw new BadRequest({code: "Transaction.qnt"});
                    if(Number(data.qnt) === Number(investment.qnt)){
                        total = Number(investment.balance) * -1;
                        profit = (Number(data.qnt) * Number(data.price)) - Number(investment.balance);
                    }
                }
            } 
            
            await this.transactionRepository.create({
                brokerId: broker.id,
                investmentId: investment.id,
                type: data.type,
                negotiationDate: data.negotiationDate,
                qnt,
                price: data.price,
                total,
                profit,
                fees: data.fees,
                taxes: data.taxes,
                brokerage: data.brokerage,
            } as ITransaction, trx);

            return this.investmentService.updateBalance(investment.id, trx);
        });
    }

    async update(id: string | number, data: ITransaction): Promise<void> {
        await this.transactionRepository.transaction(async(trx)=>{
            const transaction = await this.transactionRepository.findById(id, undefined, trx);
            if(!transaction) throw new NotFound("Transaction");

            if(data.brokerId){
                const broker = await this.brokerRepository.findById(data.brokerId, undefined, trx);
                if(!broker) throw new NotFound("Broker");
            }

            if (data.investment?.name){                
                const investment = await this.investmentRepository.findOne({name: data.investment?.name}, undefined, trx);
                if(!investment) throw new NotFound("Investment");
            }

            let total = 0;
            let qnt = 0;
            let profit = 0;

            if(data.type === ETransactionType.BUY){
                total = Number(data.qnt) * Number(data.price);
                qnt = Number(data.qnt);
            }else{
                const { priceAverage, balance, quantity } = await this.transactionRepository.getLastAveragePrice({
                    id: Number(id),
                    investmentId: transaction.investmentId
                }, trx);

                total = (Number(data.qnt) * Number(data.price)) * -1;
                qnt = Number(data.qnt) * -1;
                profit = (Number(data.price) - Number(priceAverage)) * Number(data.qnt);
                if(Number(data.qnt) >= Number(quantity || transaction.qnt)){
                    const block = Number(data.qnt) > Number(quantity || transaction.qnt);
                    if(block) throw new BadRequest({code: "Transaction.qnt"});
                    if(Number(data.qnt) === Number(quantity || transaction.qnt)){
                        total = Number(balance) * -1;
                        profit = (Number(data.qnt) * Number(data.price)) - Number(balance);
                    }
                }
            } 
            
            await this.transactionRepository.update(id, {
                brokerId: data.brokerId,
                investmentId: data.investmentId,
                type: data.type,
                negotiationDate: data.negotiationDate,
                price: data.price,
                qnt,
                total,
                profit,
                fees: data.fees,
                taxes: data.taxes,
                brokerage: data.brokerage,
            }, trx);

            return this.investmentService.updateBalance(data.investmentId || transaction.investmentId, trx);
        });
    }

    async delete(id: string | number): Promise<void> {
        await this.transactionRepository.transaction(async (trx)=>{
            const transaction = await this.transactionRepository.findById(id, undefined, trx);
            if (!transaction) throw new NotFound("Transaction");

            await this.transactionRepository.delete(id, trx);
            return this.investmentService.updateBalance(transaction.investmentId, trx);
        });
    }

}
