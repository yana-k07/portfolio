import { useState } from "react";

// Shows the image, or a neutral placeholder if the file isn't there yet.
// `placeholderClassName` lets the placeholder have a size even when the image itself is auto-height.
export default function Img({ src, alt = "", className = "", placeholderClassName }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Image placeholder"}
        className={`grid place-items-center bg-muted text-sm text-muted-foreground ${placeholderClassName ?? className}`}
      >
        {src?.split("/").pop()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
