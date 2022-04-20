
const nodemailer = require('nodemailer')

module.exports = function sendResetPasswordEmail(email, nome, token) {
    
    const smtpTransport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
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