import path from "path";
import { I18n } from "i18n";
import { Logger } from "../logger";
import elasticAgent from "../apm";
import env from "../env";

const i18n = new I18n();
i18n.configure({
    locales: [
        "pt-BR",
        "en-US",
    ],
    fallbacks: {
        pt: "pt-BR",
        en: "en-US",
    },
    defaultLocale: "pt-BR",
    directory: path.join(__dirname, "locales"),
    directoryPermissions: "755",
    register: global,
    autoReload: env.env !== "test",
    extension: ".json",
    queryParameter: "lang",
    header: "accept-language",
    logErrorFn: (msg)=>{
        if(elasticAgent && elasticAgent.isStarted()){
            elasticAgent.captureError(msg);
        }
        Logger.error(msg);
    }
});
export default i18n;