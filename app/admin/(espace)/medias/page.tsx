import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata = { title: "Médias" };

export default function MediasPage() {
  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Médias</h1>
          <p className="bo-sub">Photos du site d&apos;origine et images téléversées, utilisables dans tous les contenus.</p>
        </div>
      </header>
      <MediaLibrary />
    </div>
  );
}
