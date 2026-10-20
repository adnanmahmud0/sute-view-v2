export default function Home() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-video">
        <iframe
          src="https://player.vimeo.com/video/459093662?muted=1&autoplay=1&loop=1&transparent=0&background=1&app_id=122963"
          className="absolute inset-0 h-full w-full border-0 pointer-events-none"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="The Sartorialist Zürich - Tailoring Video"
        />
      </div>
    </section>
  );
}
