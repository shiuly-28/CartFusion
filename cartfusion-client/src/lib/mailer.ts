import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port:587,
secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

(async () => {
    const info = await transporter.sendMail({
        from: '"Maddison Foo koch" <cartfution@gmail.com>',
        to: "bar@example.com, bar@example.com",
        subject:"Hello World",
        text: "Hello world",
        html: "<b>Hello?<b>"
    })
    console.log("Message sent:", info.messageId)
})
