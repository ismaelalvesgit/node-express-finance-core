import path from "path";
import { I18n } from "i18n";
import { Config } from "@config/config";
import { Logger } from "@infrastructure/logger/logger";
import { EnvironmentType } from "@config/types/config";

const config = new Config();

const i18n = new I18n({
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
    autoReload: config.get().environment !== EnvironmentType.Test,
    extension: ".json",
    queryParameter: "lang",
    header: "accept-language",
    logErrorFn: (msg)=> Logger.error(msg)
});

export default i18n;