import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";

describe("System Router", () => {
    describe("sucess", ()=>{
        it("healthcheck", async() => {
            const res = await request(app)
            .get("/system/healthcheck")
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
    });
});