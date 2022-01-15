import apm from "elastic-apm-node";
import env from "./env";
import logger from "./logger";

/** @type {import('elastic-apm-node')} */
let elasticAgent;
if(env.apm.serverUrl){
    elasticAgent = apm.start({
        serviceName: env.apm.serviceName,
        secretToken: env.apm.secretToken,
        apiKey: env.apm.apiKey,
        serverUrl: env.apm.serverUrl,
    });
    
    if(!elasticAgent.isStarted()){
        logger.info("Failed to start APM server");
    }else{
        logger.info(`Registered service "${env.apm.serviceName}" in APM Server: ${env.apm.serverUrl}`);
    }
}

export default elasticAgent;