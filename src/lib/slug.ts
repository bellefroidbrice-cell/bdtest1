const DIACRITICS_REGEX = /[̀-ͯ]/g;

export function slugify(...parts: (string | number)[]) {
  const base = parts
    .join("-")
    .toString()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
