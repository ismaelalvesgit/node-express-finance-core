import { init } from "@ismaelalves/logger";
import { Config } from "@config/config";
import { EnvironmentType } from "@config/types/config";

const config = new Config();

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
  Redact,
  RequestLogger
} = init({
  PROJECT_NAME: config.get().serviceName,
  LOG_LEVEL: config.get().environment === EnvironmentType.Test ? "fatal" : "debug",
  OMIT_ROUTES: [
    "/v1/system/metrics"
  ]
});

