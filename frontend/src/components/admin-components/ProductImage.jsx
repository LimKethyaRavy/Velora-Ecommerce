import { useEffect, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

export default function ProductImages({ images, onChange, error }) {
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const next = images.map((file) => URL.createObjectURL(file));
    setPreviews(next);
    return () => next.forEach(URL.revokeObjectURL);
  }, [images]);

  const addImages = (event) => {
    const incoming = Array.from(event.target.files || []);
    const valid = incoming.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 2 * 1024 * 1024
    );
    if (valid.length !== incoming.length) {
      window.alert("Only JPG, PNG or WEBP images up to 2 MB are accepted.");
    }
    onChange([...images, ...valid]);
    event.target.value = "";
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Product images</h2>
      <p className="mt-1 text-sm text-slate-500">Upload JPG, PNG or WEBP images (max 2 MB each).</p>
      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-5 py-8 text-center hover:bg-violet-50">
        <ImagePlus className="mb-2 text-violet-600" size={28} />
        <span className="text-sm font-semibold text-violet-700">Choose product images</span>
        <span className="mt-1 text-xs text-slate-500">You can select multiple files</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={addImages} />
      </label>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img src={url} alt={`Product upload ${index + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute right-2 top-2 rounded-lg bg-white/95 p-1.5 text-red-600 shadow" aria-label={`Remove image ${index + 1}`}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </section>
  );
}
