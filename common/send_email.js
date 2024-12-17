import nodemailer from "nodemailer";

const sendEmail = async (user, subject, html, attachment = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: "MASHFiX",
        address: process.env.user,
      }, // sender address
      to: user.email,
      subject: subject,
      html: html,
      ...(attachment && {
        attachments: [
          {
            filename: "receipt.pdf",
            content: attachment,
            encoding: "base64",
          },
        ],
      }),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sendEmail;
