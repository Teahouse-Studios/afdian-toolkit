const { resolve } = require('path')
require('dotenv').config({ path: resolve(__dirname, '../.env') })
const express = require('express')
const compression = require('compression')
const nodemailer = require('nodemailer');


const app = express()
app.use(compression())
app.use(require('body-parser').json({
    limit: '10mb'
}));
(async () => {
    app.post('/mail_order', async (req, res) => {
        try {
            var transporter = nodemailer.createTransport(
                {
                    host: process.env.TRANSPORT_HOST,
                    port: process.env.TRANSPORT_PORT,
                    secure: true,
                    auth: {
                        user: process.env.TRANSPORT_USER,
                        pass: process.env.TRANSPORT_PWD,
                    },
                });

            var mailOptions = {
                from: process.env.TRANSPORT_USER,
                to: process.env.MAILTO_USER,
                subject: '来自爱发电的消息',
                text: JSON.stringify(req.body),
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).json({ "ec": 500 })
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ "ec": 200 })
                }
            });
        } catch (e) {
            res.status(500).json({
                message: e.message,
                stack: e.stack
            })
        }

    })
    const server = app.listen(~~process.env.FC_SERVER_PORT || 15111)
})()