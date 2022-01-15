import { Chance } from "chance";
import { findAllContact, createContact, updateContact, delContact } from "../../../src/services/contato.service";
import * as model from "../../../src/model/contato.model";

const chance = new  Chance();
const id = chance.string({numeric: true, length: 1});
describe("Contato Service", () => {

    describe("sucess", ()=>{
        it("findContato", async() => {
            model.findAllContact = jest.fn().mockResolvedValue({
                id,
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 13})
            });
            await expect(findAllContact({id})).resolves.toBeDefined();
        });
        
        it("createContato", async() => {
            model.createContact = jest.fn().mockResolvedValue([1]);
            const [ contatoId ] = await createContact({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 13})
            });
            expect(contatoId).toBe(1);
        });
        
        it("updateContato", async() => {
            model.updateContact = jest.fn().mockResolvedValue([1]);
            await expect(updateContact({id}, {nome: chance.name()})).resolves.toBeDefined();
        });
        
        it("deleteContato", async() => {
            model.delContact = jest.fn().mockResolvedValue([1]);
            await expect(delContact({id})).resolves.toBeDefined();
        });
    });
    
    describe("error", ()=>{
        it("createContato - sem os dados necessario", async() => {
            model.createContact = jest.fn().mockRejectedValue(new Error());
            await expect(createContact({
                nome: chance.name(),
            })).rejects.toThrow();
        });
        
        it("updateContato - ID inexistente", async() => {
            model.updateContact = jest.fn().mockResolvedValue(0);
            await expect(updateContact({id: chance.integer()}, {nome: chance.name()})).resolves.toBe(0);
        });
        
        it("deleteContato - ID inexistente", async() => {
            model.delContact = jest.fn().mockResolvedValue(0);
            await expect(delContact({id: chance.integer()})).resolves.toBe(0);
        });
    });

});