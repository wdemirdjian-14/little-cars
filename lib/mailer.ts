import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

// Envoi d'e-mails par SMTP. Sans SMTP_HOST, rien n'est envoyé : les demandes
// restent consultables dans le back-office et les réponses y sont marquées
// « non envoyée ».

let transport: Transporter | undefined;

export const mailConfigured = () => Boolean(process.env.SMTP_HOST);

export const notificationAddress = () => process.env.MAIL_TO || "contact@little-cars.fr";

export async function sendMail(mail: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!mailConfigured()) throw new Error("L'envoi d'e-mails n'est pas configuré (SMTP_HOST absent).");
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM || "Little <no-reply@little-cars.fr>",
    ...mail,
  });
}
