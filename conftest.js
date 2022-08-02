import { exec, echo, exit } from "shelljs";

setImmediate(()=>{
    /* eslint-disable max-len*/
    if(exec(`docker run --rm -v ${process.cwd()}:/project openpolicyagent/conftest test --policy docker-security.rego Dockerfile`).code !== 0){
        echo("Error: Conftest failed");
        exit(1);
    }
});