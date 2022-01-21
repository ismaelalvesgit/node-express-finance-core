import env from "../env";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import ejs from "ejs";
import path from "path";

const _transport = ()=>{
    if(env.email.type !== "OAuth2"){
        return nodemailer.createTransport({
            host: env.email.host,
            port: env.email.port,
            auth:{
                user: env.email.notificator,
                pass: env.email.pass,
            },
            secure: env.email.secure
        });
    }else{
        const oauth2Client = new google.auth.OAuth2(
            env.email.OAuth2.clientId,
            env.email.OAuth2.clientSecret,
            env.email.OAuth2.redirectUri
        );
        oauth2Client.setCredentials({
            refresh_token: env.email.OAuth2.refreshToken,
        });
        const accessToken = oauth2Client.getAccessToken();

        return nodemailer.createTransport({
            service: "gmail",
            auth:{
                type: "OAuth2",
                user: env.email.notificator,
                clientId: env.email.OAuth2.clientId,
                clientSecret: env.email.OAuth2.clientSecret,
                refreshToken: env.email.OAuth2.refreshToken,
                accessToken: accessToken,
            },
        });
    }
};

/**
 * 
 * @param {string} to 
 * @param {string} subject 
 * @param {string} template 
 * @param {Object} data 
 * @param {import('nodemailer').SendMailOptions['attachments']} attachments 
 * @returns 
 */
export const send = ({to, subject, template, data = {}, attachments})=>{
    return new Promise((resolve, reject)=>{
        ejs.renderFile(path.join(__dirname, `../views/mail/${template}.ejs`), data, (err, html)=>{
            if(err){
                reject(new Error(err));
            }
            _transport().sendMail({
                to,
                from: env.email.notificator,
                subject,
                html,
                attachments
            }).then(resolve).catch((err)=>{
                reject(new Error(err));
            });
        });
    });
};