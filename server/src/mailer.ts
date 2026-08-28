import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.CONTACT_TO_EMAIL ?? process.env.GMAIL_USER,
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}
