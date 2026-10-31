export function createSlugger() {
  const seen = new Map();
  return {
    slug(value) {
      const base =
        String(value)
          .toLowerCase()
          .trim()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-+|-+$/g, "") || "section";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return count === 0 ? base : `${base}-${count}`;
    },
  };
}
