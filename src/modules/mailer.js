
const nodemailer = require('nodemailer')
const { host, port, user, pass } = require('../config/mail.json')

module.exports = (email, nome, token) => {
    
    const smtpTransport = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass }
    })
    
    const mail = {
        from: "Telemedicina <fatec.telemedicina@gmail.com>",
        to: email,
        subject: `${nome}, agora você pode redefinir a sua senha`,
        html: `<p>Você esqueceu sua senha? Não tem problema, acesse esse <a href="http://localhost:3000/usuario/redefinir_senha/${token}">link</a>.</p>`
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