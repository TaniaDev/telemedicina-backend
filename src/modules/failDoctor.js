
const nodemailer = require('nodemailer')
const { host, port, user, pass } = require('../config/mail.json')

module.exports = (nome, email) => {
    
    const smtpTransport = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass }
    })
    
    const mail = {
        from: "Telemedicina <fatec.telemedicina@gmail.com>",
        to: email,
        subject: `Dr(a) ${nome}, seu cadastro foi recusado`,
        html: `<p align="center">${nome}, lamentamos o inconveniente, mas seu cadastro foi recusado.</p><p align="center"><a href="localhost:3000/cadastro">Refaça-o</a></p>`
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