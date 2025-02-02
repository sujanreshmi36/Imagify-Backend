import { ForbiddenException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const sendMail = (email, subject, msg) => {
    try {
        //send mail.message.
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EmailUser,
                pass: process.env.Password
            }
        });

        const mailOptions = {
            from: process.env.EmailUser,
            to: email,
            subject: subject,
            html: msg
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                throw new ForbiddenException(error.message)
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }

}

export { sendMail }
