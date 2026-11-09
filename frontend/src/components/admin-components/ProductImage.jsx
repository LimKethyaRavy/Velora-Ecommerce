import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ProductImages({ images, variants = [], onChange, error }) {
  const [previews, setPreviews] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || "");

  useEffect(() => {
    // Map over images which can now be an object containing { file, variant_id } or plain files
    const next = images.map((item) => {
      const file = item.file || item;
      return URL.createObjectURL(file);
    });
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

    // Attach the currently selected variant_id to each new image file object
    const newImagesWithVariant = valid.map((file) => ({
      file,
      variant_id: selectedVariantId || null,
      is_primary: images.length === 0 && valid[0] === file ? true : false,
    }));

    onChange([...images, ...newImagesWithVariant]);
    event.target.value = "";
  };

  return (
    <section className="px-6 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#1f1b2d]">Photos</h3>
          <p className="mt-1 text-sm text-[#6b6880]">
            Assign photos to specific colors. First photo is the cover.
          </p>
        </div>

        {/* Color Variant Selector Dropdown */}
        {variants.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[#6b6880] mb-1">
              Select Color Variant for Upload
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="rounded-md border border-[#e4e1ec] px-3 py-1.5 text-sm text-[#1f1b2d] bg-white focus:outline-none focus:border-[#5b2d8e]"
            >
              <option value="">General / No Color</option>
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.color} {variant.size ? `(${variant.size})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          {previews.map((url, index) => {
            const currentItem = images[index];
            const matchedVariant = variants.find(v => v.id == currentItem?.variant_id);

            return (
              <div
                key={url}
                className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#e4e1ec] bg-[#f4f3f8]"
              >
                <img
                  src={url}
                  alt={`Product photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                
              
                {matchedVariant && (
                  <span className="absolute top-1.5 left-1.5 rounded bg-indigo-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow">
                    {matchedVariant.color}
                  </span>
                )}

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
            );
          })}

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