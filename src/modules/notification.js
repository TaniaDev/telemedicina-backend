
const nodemailer = require('nodemailer')
const { host, port, user, pass } = require('../config/mail.json')

module.exports = (email, nome, time, precision, doctor, specialty, date) => {
    const smtpTransport = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass }
    })
    
    const mail = {
        from: "Telemedicina <fatec.telemedicina@gmail.com>",
        to: email,
        subject: `${nome}, faltam menos de ${time} ${precision} para sua consulta`,
        html: `
                <h2 align="center">Sua consulta se aproxima, fique atento!</h2>
                <p align="center"><b>Médico:</b> ${doctor}</p>
                <p align="center"><b>Especialidade:</b> ${specialty}</p>
                <p align="center"><b>Data:</b> ${date}</p>
            `
    }
    
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail)
            .then(response => {
                smtpTransport.close();
                return resolve(response);
            })
            .catch(error => {
                smtpTransport.close();
                return reject(error);
            });
    })
}