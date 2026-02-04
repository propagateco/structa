// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import matter from "gray-matter";
function extractFrontMatter(content) {
  const { data, content: body } = matter(content);
  return { data, body };
}
var blogPosts = defineCollection({
  name: "posts",
  directory: "./src/blog",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    author: z.string().optional(),
    publishedAt: z.string(),
    readTime: z.string().optional(),
    previewPercentage: z.number().default(30),
    coverImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tags: z.array(z.string()).optional(),
    content: z.string()
  }),
  transform: (document) => {
    const frontMatter = extractFrontMatter(document.content);
    return {
      ...document,
      slug: document._meta.path.replace(".md", ""),
      content: frontMatter.body,
      ...frontMatter.data
    };
  }
});
var content_collections_default = defineConfig({
  collections: [blogPosts]
});
export {
  content_collections_default as default
};
