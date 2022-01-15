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

        it.skip("mail", async() => {
            const res = await request(app)
            .post("/system/mail")
            .send({
                email: "cearaismael1997@gmail.com"
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });

        it("upload", async() => {
            const res = await request(app)
            .post("/system/upload")
            .attach('file', './test/assets/test.png')
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });

        it("download", async() => {
            const res = await request(app)
            .get("/system/download")
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it.skip("pdf", async() => {
            const res = await request(app)
            .get("/system/pdf")
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("spreadSheet", async() => {
            const res = await request(app)
            .get("/system/spreadSheet")
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("docx", async() => {
            const res = await request(app)
            .get("/system/docx")
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
    });
});