import "server-only";
import { createClient } from "@sanity/client";

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Read-only client for fetching blog content. `useCdn: true` serves fast,
 * cached responses for published content — fine here since none of this
 * data needs to be real-time. The read token is optional; only needed if
 * your dataset is private or you want to preview unpublished drafts.
 */
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});

export function isSanityConfigured() {
  return Boolean(SANITY_PROJECT_ID);
}
