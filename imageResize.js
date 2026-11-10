"use client";

// Phone cameras produce 3–8 MB photos. Nobody needs that to read a bill or
// pick a cloth, and it makes every screen that shows them slow. This shrinks
// a photo to at most 1280px on its longest side as a JPEG (typically 100–300 KB)
// before it's uploaded. If anything goes wrong, the original is used untouched.
export async function shrinkImage(file, maxDim = 1280, quality = 0.8) {
  try {
    if (!file || !file.type || !file.type.startsWith("image/")) return file;
    if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
    if (bitmap.close) bitmap.close();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file; // already small enough
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
