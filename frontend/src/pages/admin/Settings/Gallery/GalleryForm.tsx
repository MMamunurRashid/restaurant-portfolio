import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, X, ImagePlus, GripVertical } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONFIG } from '@/config';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import {
  useAddGalleryMutation,
  useGetGalleryByIdQuery,
  useUpdateGalleryMutation,
} from '@/redux/features/gallery/galleryApi';
import type { IGallery } from '@/interface/galleryInterface';

/* ─── Types ─────────────────────────────────────────────── */
type NewImage = { kind: 'new'; id: string; file: File; preview: string; title: string };
type ExistingImage = { kind: 'existing'; id: string; image: string; title: string };
type GalleryItem = NewImage | ExistingImage;

/* ─── Helpers ────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2);

/* ─── ImageCard ──────────────────────────────────────────── */
function ImageCard({
  item,
  onRemove,
  onTitleChange,
}: {
  item: GalleryItem;
  onRemove: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
}) {
  const src = item.kind === 'new' ? item.preview : item.image;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={src}
          alt={item.title || 'gallery image'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-destructive shadow opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-white"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>

        {/* Drag handle (visual only) */}
        <div className="absolute top-2 left-2 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical size={16} />
        </div>

        {/* New badge */}
        {item.kind === 'new' && (
          <span className="absolute bottom-2 left-2 text-[10px] font-semibold tracking-widest uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            New
          </span>
        )}
      </div>

      {/* Title input */}
      <div className="px-3 py-2.5">
        <input
          type="text"
          value={item.title}
          onChange={(e) => onTitleChange(item.id, e.target.value)}
          placeholder="Image caption…"
          className="w-full text-xs text-slate-600 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0"
        />
      </div>
    </div>
  );
}

/* ─── DropZone ───────────────────────────────────────────── */
function DropZone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border-2 border-dashed cursor-pointer
        transition-all duration-200 select-none
        ${dragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-slate-200 bg-slate-50/60 hover:border-primary/50 hover:bg-slate-50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
        <ImagePlus size={22} />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">
          {dragging ? 'Drop images here' : 'Click or drag to upload'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP · Multiple allowed</p>
      </div>
    </div>
  );
}

/* ─── GalleryForm ────────────────────────────────────────── */
export default function GalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: galleryData } = useGetGalleryByIdQuery(id as string, { skip: !isEdit });
  const [addGallery, { isLoading: adding }] = useAddGalleryMutation();
  const [updateGallery, { isLoading: updating }] = useUpdateGalleryMutation();

  const { register, handleSubmit, reset } = useForm<any>();
  const [items, setItems] = useState<GalleryItem[]>([]);

  /* Populate existing images when editing */
  useEffect(() => {
    if (isEdit && galleryData?.data) {
      const g = galleryData.data as IGallery & { _id?: string };
      reset({ title: g.title, isActive: g.isActive, order: g.order });
      setItems(
        (g.images ?? []).map((img) => {
          const raw = img.image || '';
          const imageUrl = raw.startsWith('http')
            ? raw
            : `${CONFIG.BASE_URL}/${raw.replace(/^\/+/, '')}`;

          return {
            kind: 'existing',
            id: uid(),
            image: imageUrl,
            title: img.title ?? '',
          } as ExistingImage;
        })
      );
    }
  }, [galleryData, isEdit, reset]);

  /* Handle file selection */
  const handleFiles = useCallback((files: FileList) => {
    const incoming: NewImage[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        kind: 'new',
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        title: '',
      }));
    setItems((prev) => [...prev, ...incoming]);
  }, []);

  /* Remove */
  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.kind === 'new') URL.revokeObjectURL(removed.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  /* Title update */
  const updateTitle = useCallback((id: string, title: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
  }, []);

  /* Submit */
  const onSubmit = async (form: any) => {
    const formData = new FormData();

    const newImageTitles: string[] = [];
    const existingImages: { image: string; title: string }[] = [];

    items.forEach((item) => {
      if (item.kind === 'new') {
        formData.append('gallery', item.file);
        newImageTitles.push(item.title);
      } else {
        // strip CONFIG.BASE_URL if present so backend receives relative path
        let imagePath = item.image || '';
        if (imagePath.startsWith(CONFIG.BASE_URL)) {
          imagePath = imagePath.replace(`${CONFIG.BASE_URL}/`, '');
        } else if (imagePath.startsWith('http')) {
          try {
            const u = new URL(imagePath);
            imagePath = u.pathname.replace(/^\/+/, '');
          } catch (e) {
            imagePath = imagePath.replace(/^\/+/, '');
          }
        } else {
          imagePath = imagePath.replace(/^\/+/, '');
        }

        existingImages.push({ image: imagePath, title: item.title });
      }
    });

    // coerce types for backend validation: select/input values are strings
    const isActive = form.isActive === true || form.isActive === 'true';
    let order: number = (form.order ?? 0) as any;
    if (typeof order === 'string') order = Number(order) || 0;

    const payload = {
      title: form.title,
      images: existingImages,
      newImageTitles,
      isActive,
      order,
    };

    formData.append('data', JSON.stringify(payload));

    try {
      let res: TResponse;
      if (isEdit && id) {
        res = (await updateGallery({ id, data: formData })) as TResponse;
      } else {
        res = (await addGallery(formData)) as TResponse;
      }

      if (res?.data?.success) {
        toast.success(res.data.message || (isEdit ? 'Gallery updated' : 'Gallery added'));
        navigate('/admin/setting/gallery/all');
      } else {
        toast.error(res?.error?.data?.message || 'Something went wrong!');
      }
    } catch {
      toast.error('Failed to save gallery');
    }
  };

  const isBusy = adding || updating;
  const newCount = items.filter((i) => i.kind === 'new').length;
  const existingCount = items.filter((i) => i.kind === 'existing').length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/setting/gallery/all"
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-primary transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Gallery' : 'Add Gallery'}
            </h1>
            {items.length > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                {items.length} image{items.length !== 1 ? 's' : ''}
                {newCount > 0 && ` · ${newCount} new`}
                {existingCount > 0 && isEdit && ` · ${existingCount} existing`}
              </p>
            )}
          </div>
        </div>

        <button type="submit" disabled={isBusy} className="admin_primary_btn">
          <Save size={18} />
          {isBusy ? 'Saving…' : isEdit ? 'Update Gallery' : 'Save Gallery'}
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Images */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800">Gallery Title</label>
            <input
              type="text"
              {...register('title', { required: true })}
              placeholder="e.g. Summer Collection"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">Images</label>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => items.forEach((i) => removeItem(i.id))}
                  className="text-xs text-primary hover:text-destructive transition-colors"
                >
                  Remove all
                </button>
              )}
            </div>

            {/* Drop zone */}
            <DropZone onFiles={handleFiles} />

            {/* Image grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                {items.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onTitleChange={updateTitle}
                  />
                ))}
              </div>
            )}

            {items.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-2">
                No images added yet. Upload above to get started.
              </p>
            )}
          </div>
        </div>

        {/* Right: Settings */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800">Status</label>
            <select {...register('isActive')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800">Display Order</label>
            <input
              type="number"
              {...register('order')}
              placeholder="0"
              min={0}
            />
          </div>

          {/* Summary card */}
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">Summary</p>
            <div className="flex justify-between">
              <span>Total images</span>
              <span className="font-semibold text-slate-800">{items.length}</span>
            </div>
            {isEdit && (
              <>
                <div className="flex justify-between">
                  <span>Existing</span>
                  <span className="font-semibold text-slate-800">{existingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>New uploads</span>
                  <span className="font-semibold text-primary">{newCount}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
