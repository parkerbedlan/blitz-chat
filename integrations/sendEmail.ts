import nodemailer from "nodemailer"

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS, // sender address
      to: to, // list of receivers
      subject, // Subject line
      html,
    },
    (err, info) => {
      console.log("err", err, "info", info)
    }
  )
}
