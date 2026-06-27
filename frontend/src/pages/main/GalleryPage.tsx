import Gallery from '@/components/modules/home/Gallery';

export default function GalleryPage() {
  window.scrollTo(0, 0);
  return (
    <section className="min-h-screen bg-white py-24">
      <div className="">
        <Gallery showAll />
      </div>
    </section>
  );
}
