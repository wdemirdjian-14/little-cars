import { SESSION_COOKIE, checkPassword, destroyUserSessions, passwordProblem, setPassword } from "@/lib/auth";
import { UserError, adminRoute, json } from "@/lib/http";

/** Changement de son propre mot de passe : les autres sessions sont fermées. */
export const POST = adminRoute(async (req, user) => {
  const body = await req.json().catch(() => ({}));
  if (!checkPassword(user.id, String(body.actuel ?? ""))) throw new UserError("Le mot de passe actuel est incorrect.");
  const next = String(body.nouveau ?? "");
  const problem = passwordProblem(next);
  if (problem) throw new UserError(problem);
  setPassword(user.id, next);
  destroyUserSessions(user.id, req.cookies.get(SESSION_COOKIE)?.value);
  return json(200, { ok: true });
});
