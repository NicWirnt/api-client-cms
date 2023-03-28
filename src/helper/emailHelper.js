import nodemailer from "nodemailer";

const emailProcessor = async (emailData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail(emailData);

  console.log("Message sendt : %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export const sendVerificationMail = async (emailData) => {
  const mailBody = {
    from: `"My Toys" ${process.env.EMAIL_USER}`,
    to: `${emailData.email}`,
    subject: `Email Verification ✅`,
    text: `Hi there, please follow the link to verify your email ${emailData.url}`,
    html: `
        <p>Hi ${emailData.fName} </p>
        <br/>
        <br/>
        Please follow the links below to verify your email so you can login into your account
        <br/>
        <br/>
        <a href= "${emailData.url}">${emailData.url} </a>

        <br/>
        <br/>
        Kind Regards, <br/>
        My Toys
        `,
  };
  emailProcessor(mailBody);
};
