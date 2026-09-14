import { createInvitation, type Role } from "@/lib/auth";
import { UserError, adminRoute, json } from "@/lib/http";
import { mailConfigured, sendMail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/seo";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Invitation d'un membre, ou lien de réinitialisation pour un compte existant. */
export const POST = adminRoute(
  async (req, user) => {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const nom = String(body.nom ?? "").trim().slice(0, 120);
    const role = (body.role === "admin" ? "admin" : "editeur") as Role;
    if (!EMAIL.test(email)) throw new UserError("Adresse e-mail invalide.");

    const token = createInvitation(email, nom, role, user.id);
    const lien = `${SITE_URL}/admin/activation/?jeton=${token}`;

    let envoye = false;
    if (mailConfigured()) {
      try {
        await sendMail({
          to: email,
          subject: "Votre accès au back-office Little",
          text: `Bonjour${nom ? ` ${nom}` : ""},\n\n${user.nom} vous donne accès au back-office du site Little.\nChoisissez votre mot de passe avec ce lien, valable 72 heures :\n\n${lien}\n\nL'équipe Little`,
        });
        envoye = true;
      } catch (err) {
        console.error("[équipe] envoi de l'invitation impossible", err);
      }
    }
    return json(200, { lien, envoye });
  },
  { role: "admin" },
);
