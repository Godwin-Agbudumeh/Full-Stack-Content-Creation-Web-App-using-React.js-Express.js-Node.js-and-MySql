import nodemailer from 'nodemailer';

export const sendEmail = async (email, mailSubject, content, res)=>{

    const mail = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        // true for 465, false for other ports
        secure: false, 
        auth: {
        //sender gmail address
        user: process.env.EMAIL_USER,
        //app password from gmail account
        pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: {
            name: 'Tech Life',
            address: process.env.EMAIL_USER
        },
        // list of receivers
        to: email,
        // Subject line
        subject: mailSubject, 
        // html body
        html: content, 
      };

      await mail.sendMail(mailOptions, (error, info)=>{
        if(error){
            return res.status(500).json("Unable to send email, please check your internet connection")
            console.log(error);
        }else{
            return res.status(200).json("Email link to reset password sent successfully, please check your email")
        }
      });
}
