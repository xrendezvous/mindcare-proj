import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class EmailProvider {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.ukr.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        this.sender = process.env.SMTP_USER || "mindcare_platform@ukr.net";
    }
};