import env from "./src/env";
import { httpServer, app } from "./src/app";
import errorHandler from "./src/middleware/error.middleware";
import { Logger } from "./src/logger";
import { startCollection } from "./src/utils/metric";
import { syncBound } from "./src/utils";
import { currencyService } from "./src/services";

setImmediate(() => {
    if (env.server.active) {
        httpServer.listen(env.server.port, () => {
            app.use(errorHandler);
            import("./src/socket");
            import("./src/job");
            startCollection();
            process.nextTick(async () => {
                try {
                    await currencyService.updateCache();
                    await syncBound();
                } catch (e) {
                    Logger.warning(e);
                }
            });
            Logger.info(`Server on http://localhost:${env.server.port}`);
        });
    }
});