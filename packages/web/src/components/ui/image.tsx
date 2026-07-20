/**
 * Resolve an avatar / image src to a usable browser URL.
 *
 * `src` can be one of:
 *   - `blob:...`               local File preview (client-side crop preview, etc.)
 *   - `http(s)://...`           already-qualified URL (e.g. Google OAuth avatar) — used as-is
 *   - `data:...`                inlined image data — used as-is
 *   - anything else             treated as an S3 object key (e.g.
 *                               `users/user-…/images/image-xxx` returned by the
 *                               avatar-upload flow) and resolved against the
 *                               CloudFront distribution that fronts the
 *                               image-processor Lambda + OptimisedStorage bucket.
 *
 * `format` is a query-string-style transformation spec that the CloudFront
 * `rewrite-url.js` viewer-request function translates into the comma-separated
 * path suffix the image-processor expects. Examples:
 *   - `?width=400&height=400&format=webp`
 *   - `?height=600&format=webp`
 *
 * The CloudFront URL is read from `import.meta.env.VITE_CDN_URL`, which is
 * injected by SST (`infra/web.ts`) from the `Cdn` linkable's `properties.url`.
 * Vite statically inlines `import.meta.env.VITE_*` into both the SSR and
 * browser bundles at build time, so the CDN URL is available on the client
 * without depending on SST's runtime `Resource` proxy (which only has
 * `globalThis.$SST_LINKS` populated server-side).
 *
 * Without the CDN prefix, a bare S3 key returned from the avatar upload
 * flow gets resolved by the browser relative to the current page (e.g.
 * `/settings/account` + `users/...` → `/settings/users/...`) and returns
 * a 404. See `infra/cloudfront.ts` for the distribution setup.
 */
export const getImageUrl = (
    src: string | null | undefined,
    format?: string,
) => {
    if (!src) {
        return undefined;
    }
    // Local File preview from the cropper — never prefix.
    if (src.startsWith("blob:")) {
        return src;
    }
    // Already-qualified URL (Google avatar, data URL, etc.) — pass through.
    if (/^(https?:|data:)/i.test(src)) {
        return `${src}${format ?? ""}`;
    }
    // Otherwise `src` is a bare S3 object key — prepend the CloudFront
    // image-distribution URL so the browser hits the image-processor which
    // transforms on demand and serves the optimized variant from the
    // OptimisedStorage bucket.
    const cdn = import.meta.env.VITE_CDN_URL;
    if (!cdn) {
        if (typeof window !== "undefined") {
            console.warn(
                "VITE_CDN_URL is not set; image src will be relative and " +
                    "likely 404. Check infra/web.ts and redeploy.",
            );
        }
        return `${src}${format ?? ""}`;
    }
    return `${cdn}/${src}${format ?? ""}`;
};
