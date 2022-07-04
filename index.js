import env from "./src/env";
import { httpServer } from "./src/app";
import { Logger } from "./src/logger";
import { startCollection } from "./src/utils/metric";
import { syncBound } from "./src/utils";
import { connect } from "./src/amqp";

setImmediate(() => {
    httpServer.listen(env.server.port, () => {
        import("./src/socket");
        startCollection();
        process.nextTick(async () => {
            try {
                await syncBound();
            } catch (e) {
                Logger.warning(e);
            }
        });
        Logger.info(`Server on http://localhost:${env.server.port}`);
    });

    if(env.amqp.active){
        connect()
    }
});