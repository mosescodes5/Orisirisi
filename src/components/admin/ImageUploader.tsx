"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

export function ImageUploader({
  initialImages = [],
  name = "images_json",
}: {
  initialImages?: string[];
  name?: string;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    setImages((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      return [chosen, ...next];
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-ink/[0.04]">
              <Image src={src} alt="" fill className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-orisirisi px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-paper">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    aria-label="Make primary photo"
                    onClick={() => makePrimary(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-110"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => removeAt(i)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-110"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-ink/[0.16] text-ink/50 transition-colors hover:border-orisirisi hover:text-orisirisi">
        {uploading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-semibold">Uploading…</span>
          </>
        ) : (
          <>
            <ImagePlus size={20} />
            <span className="text-xs font-semibold">Add photos</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
      <p className="mt-2 text-[11.5px] text-ink/40">
        First photo is the primary/thumbnail shot — hover any other photo and click the star to make it primary.
      </p>
    </div>
  );
}
