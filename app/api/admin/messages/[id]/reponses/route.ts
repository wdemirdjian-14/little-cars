import { UserError, adminRoute, json } from "@/lib/http";
import { mailConfigured, notificationAddress, sendMail } from "@/lib/mailer";
import { addReponse, getMessage } from "@/lib/messages";

type Ctx = { params: Promise<{ id: string }> };

const dateFr = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

/**
 * Réponse à un message. Toujours enregistrée ; envoyée par e-mail si le SMTP
 * est configuré. Les réponses du client arrivent dans la messagerie de
 * l'équipe (Reply-To), pas dans le back-office.
 */
export const POST = adminRoute<Ctx>(async (req, user, ctx) => {
  const id = Number((await ctx.params).id);
  const found = getMessage(id);
  if (!found) throw new UserError("Message introuvable.", 404);
  const { message } = found;
  if (!message.email) throw new UserError("Ce message n'a pas d'adresse e-mail.");

  const body = await req.json().catch(() => ({}));
  const sujet = String(body.sujet ?? "").trim().slice(0, 200);
  const corps = String(body.corps ?? "").trim().slice(0, 20000);
  if (!sujet || !corps) throw new UserError("L'objet et le message sont obligatoires.");

  let envoyee = false;
  let erreur: string | null = null;
  if (!mailConfigured()) {
    erreur = "envoi d'e-mails non configuré";
  } else {
    try {
      const recu = dateFr.format(new Date(`${message.cree_le.replace(" ", "T")}Z`));
      const quote = message.corps
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n");
      await sendMail({
        to: message.email,
        replyTo: notificationAddress(),
        subject: sujet,
        text: `${corps}\n\n\nLe ${recu}, ${message.nom || message.email} a écrit :\n${quote}`,
      });
      envoyee = true;
    } catch (err) {
      erreur = (err as Error).message.slice(0, 300);
      console.error("[réponse] envoi impossible", err);
    }
  }

  addReponse({ messageId: id, auteurId: user.id, sujet, corps, envoyee, erreur });
  return json(200, { envoyee, erreur });
});
