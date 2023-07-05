import { inject, singleton } from "tsyringe";
import { Config } from "@config/config";
import { EnvironmentType } from "@config/types/config";
import { ExpressLogger, Logger } from "@infrastructure/logger/logger";
import express from "express";
import http from "http";
import cors from "cors";
import helmet, { hsts } from "helmet";
import xssFilter from "x-xss-protection";
import hidePoweredBy from "hide-powered-by";
import responseTime from "response-time";
import { tokens } from "@di/tokens";
import Routes from "@presentation/http/routes";
import requestId from "@presentation/http/middlewares/requestId";
import i18n from "@presentation/http/middlewares/i18n";
import { errorHandler } from "@presentation/http/middlewares/errorHandler";
import changeLocale from "@presentation/http/middlewares/changeLocale";
import { Server } from "socket.io";
import path from 'path'
import socketIo from "@presentation/http/middlewares/socket";

@singleton()
export class App {
    private io: Server;
    private app: express.Application;
    private server: http.Server;

    constructor(
        @inject(tokens.Config)
        private config: Config,
        
        @inject(tokens.Routes)
        private routes: Routes,
    ) {
        this.config = config;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server)
        this.setupApplication();
    }

    private setupApplication() {
        this.app.use(
            express.json(),
            express.urlencoded({extended: true}),
            cors(),
            helmet({
                contentSecurityPolicy: this.config.get().environment === EnvironmentType.Production,
            }),
            hsts({
                maxAge: 31536000,
                includeSubDomains: true, 
                preload: true
            }),
            xssFilter(),
            hidePoweredBy(),
            requestId,
            i18n.init,
            changeLocale,
            responseTime(),
            socketIo(this.io)
        );
        /** Engine View */
        this.app.set("view engine", "ejs");
        this.app.set("views", `${__dirname}/presentation/views`);
        this.app.use("/static", express.static(`${__dirname}/public`));

        this.app.use(ExpressLogger.onSuccess.bind(ExpressLogger));
        this.app.use(ExpressLogger.onError.bind(ExpressLogger));

        this.routes.setupRouter(this.app);

        this.app.use(errorHandler);
    }

    get getSocket() {
        return this.io
    }

    get getApp(){
        return this.app;
    }

    listen() {
        const { port } = this.config.get();
        this.io.on('connection', socket=>{
            socket.on('/example', msg=>{
                Logger.info(msg)
            })
        })
        this.server.listen(port, ()=>{
            Logger.info(`Server on http://localhost:${port}`);
        });
    }
}