const nodemailer = require('nodemailer');
const promisify = require('es6-promisify');

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.GmailID, 
        pass: process.env.GmailPass 
    },
    tls:{
        rejectUnauthorized: false
    }
});

exports.sendMail = async(data) =>{

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Ashish Mehra 👻" <singhashu163@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html // html body
    };

    const mail = promisify(transporter.sendMail,transporter); 
    return mail(mailOptions);
};