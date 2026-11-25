// Normaliza enlaces copiados desde Google Imágenes o Wikipedia/Commons a la imagen real.
// Cualquier otra URL se usa tal cual: el navegador decide según Content-Type, no según la extensión.
export function resolveImageUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // Google Imágenes: "Copiar enlace" suele traer la imagen real en imgurl.
    if (/(^|\.)google\.[a-z.]+$/.test(host)) {
      const direct = parsed.searchParams.get('imgurl');
      if (direct && /^https?:\/\//i.test(direct)) return direct;
    }

    // Wikipedia / Commons: la página "Archivo:" no es la imagen.
    if (/(^|\.)(wikipedia|wikimedia)\.org$/.test(host)) {
      const match = parsed.pathname.match(/^\/wiki\/(?:Archivo|File):(.+)$/i);
      if (match) {
        const fileName = decodeURIComponent(match[1]);
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}
