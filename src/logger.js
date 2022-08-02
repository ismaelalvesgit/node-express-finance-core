import { init } from "@somosphi/logger";
import env from "./env";

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
  Redact,
} = init({
  PROJECT_NAME: "finance-core",
  LOG_LEVEL: env.env === "test" ? "fatal" : "debug",
});
