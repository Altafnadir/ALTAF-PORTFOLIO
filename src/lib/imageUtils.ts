/**
 * High-quality shimmer base64 placeholder for Next.js Image
 */
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#0f1f1b" offset="20%" />
      <stop stop-color="#1b3831" offset="50%" />
      <stop stop-color="#0f1f1b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0f1f1b" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const shimmerBlurDataUrl = (w: number = 700, h: number = 438) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
