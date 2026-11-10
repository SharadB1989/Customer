"use client";
import { useEffect, useState } from "react";
import { getPhotoUrl } from "@/lib/photoStorage";

// Shows a cloth variety's photo from the private 'cloth-variety-photos' bucket
// (signed URL fetched on mount), or a dashed placeholder when none is set.
// Used by both the Stock tab and the customer booking page.
export default function ClothPhoto({ path, alt = "Cloth", className = "w-14 h-14" }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    if (path) getPhotoUrl("cloth-variety-photos", path).then((u) => { if (active) setUrl(u); });
    return () => { active = false; };
  }, [path]);

  if (!url) {
    return (
      <div className={`${className} rounded border border-dashed border-line flex items-center justify-center text-line text-xs shrink-0`} aria-hidden="true">
        ▦
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} loading="lazy" decoding="async" className={`${className} rounded border border-line object-cover shrink-0`} />;
}
