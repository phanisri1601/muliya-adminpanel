/**
 * Shrinks large photos client-side so PUT/POST multipart stays under typical nginx limits (~1MB).
 */
function stripExtension(name) {
  return String(name || 'image').replace(/\.[^.]+$/, '') || 'image';
}

export async function compressImageForUpload(file, options = {}) {
  const { maxBytes = 280_000, maxEdgeStart = 1920 } = options;
  if (!(file instanceof File)) return file;
  if (!/^image\/(jpeg|jpg|pjpeg|png|webp)$/i.test(file.type)) return file;
  if (file.size <= maxBytes) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    let maxEdge = maxEdgeStart;
    for (let pass = 0; pass < 8; pass++) {
      const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) break;
      ctx.drawImage(bitmap, 0, 0, w, h);

      for (let q = 0.86; q >= 0.42; q -= 0.08) {
        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg', q);
        });
        if (blob && blob.size <= maxBytes) {
          return new File([blob], `${stripExtension(file.name)}.jpg`, { type: 'image/jpeg' });
        }
      }
      maxEdge = Math.floor(maxEdge * 0.72);
    }
  } finally {
    bitmap.close?.();
  }

  return file;
}
