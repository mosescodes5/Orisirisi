import "server-only";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

// Minimal shape for a Sanity image field — avoids pulling in the full
// `sanity` package (Studio + schema types) just for one type annotation.
type SanityImageSource = { asset?: { _ref: string; _type: string } } | string | undefined;

/** Base (un-sized) CDN URL for a Sanity image reference. Actual sizing is applied later via `blogImage()` so every call site can request the dimensions it needs. */
export function urlForImage(source: SanityImageSource) {
  if (!source) return "";
  try {
    return builder.image(source).url();
  } catch {
    return "";
  }
}
