
const nodemailer = require('nodemailer')
const { host, port, user, pass } = require('../config/mail.json')

module.exports = (email, nome, time, precision) => {
    
    const smtpTransport = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass }
    })
    
    const mail = {
        from: "Telemedicina <fatec.telemedicina@gmail.com>",
        to: email,
        subject: `[TELEMED] ${nome}, Faltam Menos de ${time} ${precision} para sua Consulta`,
        html: `Sua Consulta se aproxima, fique Atento!`
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