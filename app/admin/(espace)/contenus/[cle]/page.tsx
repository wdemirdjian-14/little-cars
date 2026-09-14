import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { listHistory, readDocument } from "@/lib/content";

export const metadata = { title: "Modifier un contenu" };

type Props = { params: Promise<{ cle: string }> };

export default async function EditContentPage({ params }: Props) {
  const { cle } = await params;
  const doc = readDocument(cle);
  if (!doc) notFound();
  // La clé force un nouvel éditeur après enregistrement, restauration ou réinitialisation.
  return <ContentEditor key={`${cle}-${doc.modifie_le ?? "origine"}`} doc={doc} history={listHistory(cle)} />;
}
