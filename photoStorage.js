"use client";
import { supabase } from "@/lib/supabaseClient";
import { shrinkImage } from "@/lib/imageResize";

// Generic helpers for the private photo buckets (cloth varieties, dealer bills,
// expense receipts). Each bucket's access rules are set in schema.sql.
export async function uploadPhoto(bucket, rawFile, nameHint) {
  const file = await shrinkImage(rawFile);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${nameHint || "photo"}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

// ---- Signed links, fetched in batches and remembered ----
// A page with 12 cloth photos used to make 12 separate requests. Requests made
// within a few milliseconds of each other are now combined into one, and a link
// that's already been fetched is reused until shortly before it expires.
const urlCache = new Map(); // "bucket|path" -> { url, expires }
const pending = new Map();  // bucket -> { waiters: Map(path -> [resolve, ...]) }

export function getPhotoUrl(bucket, path, expiresInSeconds = 3600) {
  if (!path) return Promise.resolve(null);
  const hit = urlCache.get(`${bucket}|${path}`);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.url);

  return new Promise((resolve) => {
    let batch = pending.get(bucket);
    if (!batch) {
      batch = { waiters: new Map() };
      pending.set(bucket, batch);
      setTimeout(() => flush(bucket, expiresInSeconds), 25);
    }
    if (!batch.waiters.has(path)) batch.waiters.set(path, []);
    batch.waiters.get(path).push(resolve);
  });
}

async function flush(bucket, expiresInSeconds) {
  const batch = pending.get(bucket);
  pending.delete(bucket);
  if (!batch) return;

  const paths = [...batch.waiters.keys()];
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresInSeconds);
  const urlByPath = new Map();
  if (!error && data) data.forEach((d) => { if (d.signedUrl) urlByPath.set(d.path, d.signedUrl); });

  for (const [path, resolvers] of batch.waiters) {
    const url = urlByPath.get(path) || null;
    if (url) urlCache.set(`${bucket}|${path}`, { url, expires: Date.now() + (expiresInSeconds - 300) * 1000 });
    resolvers.forEach((r) => r(url));
  }
}
