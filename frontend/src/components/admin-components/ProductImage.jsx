import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ProductImages({ images, onChange, error }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const next = images.map((file) => URL.createObjectURL(file));
    setPreviews(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const addImages = (event) => {
    const incoming = Array.from(event.target.files || []);
    const valid = incoming.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 2 * 1024 * 1024,
    );
    if (valid.length !== incoming.length) {
      window.alert("Only JPG, PNG or WEBP images up to 2 MB are accepted.");
    }
    onChange([...images, ...valid]);
    event.target.value = "";
  };

  return (
    <section className="px-6 py-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#1f1b2d]">Photos</h3>
        <p className="mt-1 text-sm text-[#6b6880]">
          The first photo is used as the cover. JPG, PNG or WEBP, up to 2 MB
          each.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {previews.map((url, index) => (
            <div
              key={url}
              className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#e4e1ec] bg-[#f4f3f8]"
            >
              <img
                src={url}
                alt={`Product photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-[#1f1b2d]/80 px-2 py-0.5 text-[11px] font-medium text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute right-1.5 top-1.5 rounded-full bg-white p-1 text-[#1f1b2d] shadow transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#c9c3da] text-center text-sm text-[#6b6880] transition focus-within:border-[#5b2d8e] hover:border-[#5b2d8e] hover:bg-[#5b2d8e]/5 hover:text-[#5b2d8e]">
            <ImagePlus size={24} />
            <span className="px-2">
              {previews.length === 0 ? "Add photos" : "Add more"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={addImages}
            />
          </label>
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </section>
  );
}