import yaml from 'js-yaml'
import path from 'path'
import { writeFile, readFileSync } from 'fs'
import commands from '../commands'

setImmediate(()=>{
    const doc = yaml.load(readFileSync(path.join(__dirname, '../../scripts/helm/values.yaml'), 'utf-8'))
    const env = {}
    const envSecret = {}
    Object.keys(process.env).forEach((key)=>{
        if(!new RegExp(/\d|vscode|npm|temp|tmp|git|profile/gi).test(key) && (key === key.toLocaleUpperCase()) && process.env[key].length > 0){
            if(key.match(/pass|secret|key/gi)){
                Object.assign(envSecret, {
                    [key]: process.env[key]
                })
            }else{
                Object.assign(env, {
                    [key]: process.env[key]
                })
            }
        }
    });

    doc.env = env
    doc.secret = envSecret
    doc.jobs = []
    commands.forEach((job)=>{
        if(job.group !== 'second'){
            doc.jobs.push({
                name: job.name,
                command: job.name,
                schedule: job.schedule,
                labels: {
                    jobgroup: job.group
                },
            })
        }
    });

    writeFile(path.join(__dirname, '../../scripts/helm/values.prod.yaml'), yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
        process.exit(0)
    });
})