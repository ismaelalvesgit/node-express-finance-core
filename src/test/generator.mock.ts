import { IBroker } from "@domain/broker/types/IBroker";
import { CategorySelect, ECategoryType, ICategory } from "@domain/category/types/ICategory";
import { EDividendsStatus, EDividendsType, IDividends } from "@domain/dividends/types/IDividends";
import { IEvents } from "@domain/events/types/IEvents";
import { IInvestment, InvestmentSelect } from "@domain/investment/types/IInvestiment";
import { ETransactionType, ITransaction } from "@domain/transaction/types/ITransaction";
import Common from "@helpers/Common";
import knex from "@infrastructure/knex/knex";
import Chance from "chance";

const chance = new Chance();

export class GeneratorMock {

    static async clearTable(tables: string[]) {
        return knex.transaction(async(trx)=>{
            return Promise.all(tables.map((table)=>{
                return knex(table).del().transacting(trx);
            }));
        });
    }

    static async events(quantity: number): Promise<IEvents[]> {
        const [investment] = await  GeneratorMock.investment(1);
        return knex.transaction(async(trx)=>{
            const events = Array.from({length: quantity}, ()=> { return {
                investmentId: investment.id,
                dateReference: new Date(),
                dateDelivery: new Date(),
                link: chance.url(),
                description: chance.string()
            };});
            await knex("events").insert(events).transacting(trx);
            return knex("events").where({investmentId: investment.id}).transacting(trx);
        });
    }

    static async dividends(quantity: number): Promise<IDividends[]> {
        const [[investment], [broker]] = await Promise.all([
            GeneratorMock.investment(1),
            GeneratorMock.broker(1)
        ]);
        return knex.transaction(async(trx)=>{
            const dividends = Array.from({length: quantity}, ()=> {
                const qnt = 10;
                const price = chance.integer({max: 10, min: 1});
                const total = qnt * price;
                return {
                    qnt,
                    price,
                    total,
                    investmentId: investment.id,
                    brokerId: broker.id,
                    status: EDividendsStatus.PROVISIONED,
                    type: EDividendsType.DIVIDEND,
                    dueDate: new Date(),
                    dateBasis: new Date()
                };
            });
            await knex("dividends").insert(dividends).transacting(trx);
            return knex("dividends").where({investmentId: investment.id}).transacting(trx);
        });
    }

    /**
     * 
     * @param quantity // Limit 5 itens
     * @returns 
     */
    static async investment(quantity: number): Promise<IInvestment[]> {
        quantity = quantity > 5 ? 5 : quantity;
        const categorys = await GeneratorMock.category();
        return knex.transaction(async(trx)=>{
            const fiis = categorys.find((category)=> category.name === ECategoryType.FIIS);
            const acao = categorys.find((category)=> category.name === ECategoryType.ACAO);
            const investmentsData = [
                {
                    name: "VISC11",
                    categoryId: fiis?.id
                },
                {
                    name: "HGLG11",
                    categoryId: fiis?.id
                },
                {
                    name: "VALE3",
                    categoryId: acao?.id
                },
                {
                    name: "BBSA3",
                    categoryId: acao?.id
                },
                {
                    name: "GGBR3",
                    categoryId: acao?.id
                }
            ];
            const insertData: any[] = [];
            let index = 0;
            while (index !== quantity) {
                insertData.push(investmentsData[index]);
                index++;
            }
            await knex("investment").del().transacting(trx);
            await knex("investment").insert(insertData).transacting(trx);
            return knex("investment")
                .select(["investment.*", knex.raw(Common.jsonQuerySelect("category", CategorySelect))])
                .innerJoin("category", "category.id", "=", "investment.categoryId")
                .whereIn("investment.name", insertData.map((inv)=> inv.name))
                .transacting(trx);
        });
    }
    
    static async transaction(quantity: number): Promise<ITransaction[]> {
        const [[investment], [broker]] = await Promise.all([
            GeneratorMock.investment(1),
            GeneratorMock.broker(1)
        ]);
        let balance = 0;
        return knex.transaction(async(trx)=>{
            const transactions = Array.from({length: quantity}, ()=> {
                const qnt = 10;
                const price = chance.integer({min: 10, max: 15});
                const total = qnt * price;
                balance =+ total;
                return {
                    negotiationDate: new Date(),
                    type: ETransactionType.BUY,
                    brokerage: 0,
                    fees: 0,
                    taxes: 0,
                    qnt,
                    price,
                    total,
                    investmentId: investment.id,
                    brokerId: broker.id
                };
            });
            await knex("transaction").insert(transactions).transacting(trx);
            await knex("investment").update({
                balance
            }).where({id: investment.id}).transacting(trx);
            return knex("transaction")
                .select([
                    "transaction.*", 
                    knex.raw(Common.jsonQuerySelect("investment", InvestmentSelect,
                    true, 
                    CategorySelect.map((cat)=> `category.${cat}`)))
                ])
                .innerJoin("investment", "investment.id", "=", "transaction.investmentId")
                .innerJoin("category", "category.id", "=", "investment.categoryId")
                .where({investmentId: investment.id})
                .transacting(trx);
        });
    }

    static async broker(quantity: number): Promise<IBroker[]> {
        return knex.transaction(async(trx)=>{
            const brokers: string[] = Array.from({length: quantity}, ()=> chance.name());
            await knex("broker").insert(brokers.map((name)=> {return {name};})).transacting(trx);
            return knex("broker").whereIn("name", brokers).transacting(trx);
        });
    }
 
    static async category(): Promise<ICategory[]> {
        return knex.transaction(async(trx)=>{
            const categorys: string[] = Object.values(ECategoryType);
            await knex("category").del().transacting(trx);
            await knex("category").insert(categorys.map((name)=> {return {name};}))
                .transacting(trx);
            return knex("category").whereIn("name", categorys).transacting(trx);
        });
    } 
}
