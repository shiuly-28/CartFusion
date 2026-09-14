import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port:465,
secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendDeliveryOtpEmail(
    email:string,
    otp: string
){
    await transporter.sendMail({
        from:`"Order Delivery" <${process.env.GMAIL_USER}`,
        to: email,
        subject: "Your Delivery OTP",
        html: `
        <div style="font-family:Arial,sans-serif>
        <h2>Delivery Verification</h2>
        <p>Your Order delivery OTP is:>/p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP is valid for 10 minutes.<p/>
        </div>
        `,
    })
}