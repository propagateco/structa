// Import Buffer polyfill first (before any other imports that might use it)
import './buffer-polyfill';

import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  author?: string;
  publishedAt: string;
  readTime?: string;
  previewPercentage: number; // Percentage of content to show as preview
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  content: string;
}

export interface BlogPostPreview {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  readTime?: string;
  coverImage?: string;
  isGated: boolean;
}

/**
 * Parse a markdown file and extract front matter
 */
export function parseMarkdown(markdownContent: string): BlogPost {
  try {
    const { data, content } = matter(markdownContent);

    return {
      title: data.title || 'Untitled',
      slug: data.slug || '',
      description: data.description || '',
      author: data.author,
      publishedAt: data.publishedAt || new Date().toISOString(),
      readTime: data.readTime,
      previewPercentage: data.previewPercentage || 30, // Default to 30%
      coverImage: data.coverImage,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    // Fallback if gray-matter fails (e.g., during HMR in browser)
    console.error('Failed to parse markdown:', error);
    return {
      title: 'Untitled',
      slug: '',
      description: '',
      publishedAt: new Date().toISOString(),
      previewPercentage: 30,
      tags: [],
      content: markdownContent,
    };
  }
}

/**
 * Calculate preview content based on percentage
 * Truncates at paragraph boundary for better UX
 */
export function getPreviewContent(content: string, percentage: number): string {
  const targetLength = Math.floor(content.length * (percentage / 100));
  let previewContent = content.slice(0, targetLength);

  // Truncate at paragraph boundary (prefer \n\n for markdown)
  const lastParagraph = Math.max(
    previewContent.lastIndexOf('\n\n'),
    previewContent.lastIndexOf('\n#'), // Also truncate at heading
  );

  if (lastParagraph > targetLength * 0.5) {
    // Only use paragraph boundary if it's not cutting off too much content
    previewContent = previewContent.slice(0, lastParagraph);
  }

  return previewContent;
}
