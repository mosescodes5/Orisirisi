import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "orisirisi-blog",
  title: "Orísirísi with Taiwo — Blog",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool(),
    // "Vision" is a GROQ playground inside the Studio — handy for testing
    // queries, safe to leave in.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
