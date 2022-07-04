import { exec, echo, exit } from 'shelljs'

setImmediate(()=>{
    if(exec(`docker run --rm -v ${process.cwd()}:/project openpolicyagent/conftest test --policy opa-docker-security.rego Dockerfile`).code !== 0){
        echo('Error: Conftest failed');
        exit(1);
    }
})