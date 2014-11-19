var nodemailer = require('nodemailer');

module.exports = {

  arrhythmiaNotify: function(user, email, timestamp){
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ekgwebapi@gmail.com',
            pass: 'ekgteam123!'
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'EKG Web App ✔ <ekgwebapi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'ALERT: Arrhythmia detected', // Subject line
        text: 'Hello '+ user +', ur heart is about to EXPLOOOOOODE <3', // plaintext body
        html: '<b>Hello '+ user +', ur heart is about to EXPLOOOOOODE <3</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
    });
  }

};
