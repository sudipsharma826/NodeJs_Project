 const nodeMailer = require('nodemailer');
 require('dotenv').config();
 const sendEmail = async (options) => {
     // Create a transporter
     const transporter = nodeMailer.createTransport({
        // host:"smtp.zoho.com",
        // port:465,
        service: 'gmail',
         auth: {
             user: process.env.EMAIL,
             pass: process.env.PASSWORD
         }
     });
     // Define the email options
    const mailOptions = {
        from: 'Sudip Sharma <noreply-sudeepsharma826@gmail.com>', // Correct format for the sender
        to: options.email, // Ensure options.email is defined
        subject: options.subject, // Ensure options.subject is defined
        html: options.html// Template literal for OTP message
        //here options.message is the message that we are sending to the user ( where options. is the ysntax and the message is the data)
    };
    
     await transporter.sendMail(mailOptions);
    };
    module.exports = sendEmail;