import { supabase } from "@/integrations/supabase/client";

const BUCKET = "site-media";
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_DATA_URL_BYTES = 900_000; // ~0.9MB — evita truncar no Postgres

async function fileToBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a imagem"));
    };
    img.src = url;
  });
}

/** Redimensiona e comprime para JPEG (evita data:URL gigante que “corrompe” no banco). */
export async function compressImageFile(file: File): Promise<Blob> {
  const src = await fileToBitmap(file);
  const w = "width" in src ? src.width : (src as ImageBitmap).width;
  const h = "height" in src ? src.height : (src as ImageBitmap).height;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(src as CanvasImageSource, 0, 0, tw, th);
  if ("close" in src && typeof src.close === "function") src.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Falha ao comprimir imagem");
  return blob;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/**
 * Sobe imagem para o bucket público `site-media` e devolve URL pública.
 * Se o bucket ainda não existir / RLS bloquear, cai em data:URL comprimida
 * (com limite de tamanho para não corromper no Postgres).
 */
export async function uploadSiteImage(file: File, folder: string): Promise<string> {
  const compressed = await compressImageFile(file);
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "misc";
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: "image/jpeg",
    upsert: false,
    cacheControl: "31536000",
  });

  if (!error) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (data?.publicUrl) return data.publicUrl;
  } else {
    console.warn(`[uploadSiteImage] Storage "${BUCKET}" falhou:`, error.message);
  }

  // Sem bucket: ainda salva comprimido (nunca o arquivo original gigante).
  if (compressed.size > MAX_DATA_URL_BYTES) {
    throw new Error(
      `Não foi possível enviar ao Storage (${error?.message ?? "bucket ausente"}). ` +
        `Crie o bucket público "${BUCKET}" no Supabase (SQL da migration site_media_bucket) ` +
        `ou use uma imagem menor / URL externa.`,
    );
  }

  return blobToDataUrl(compressed);
}
