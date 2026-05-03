import Gallery from '@/components/modules/home/Gallery';

export default function GalleryPage() {
  return (
    <section className="min-h-screen bg-white py-24">
      <div className="container px-4">
        <Gallery showAll />
      </div>
    </section>
  );
}
