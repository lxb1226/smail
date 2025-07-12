// 由于 Cloudflare Workers 环境限制，我们需要使用静态导入
// 而不是动态文件系统操作

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  lang: string;
  featured?: boolean;
  readingTime: string;
  content: string;
  seo?: {
    keywords?: string;
    ogImage?: string;
  };
}

export interface BlogPostMeta extends Omit<BlogPost, 'content'> {}

// 静态文章列表配置
// 在实际使用中，您需要在这里手动添加新文章的元数据
const POSTS_MANIFEST: Record<string, BlogPostMeta[]> = {
  zh: [
    {
      slug: 'protect-email-privacy',
      title: '如何保护邮箱隐私安全',
      description: '学习如何使用临时邮箱保护个人隐私，避免垃圾邮件骚扰，确保邮箱账户安全的完整指南。',
      date: '2025-01-15',
      author: 'TmpMail Team',
      tags: ['隐私保护', '邮箱安全', '临时邮箱', '网络安全'],
      category: '安全指南',
      lang: 'zh',
      featured: true,
      readingTime: '5 分钟阅读',
      seo: {
        keywords: '临时邮箱,隐私保护,邮箱安全,垃圾邮件,网络安全',
        ogImage: '/blog/images/email-privacy.jpg',
      },
    },
  ],
  en: [
    {
      slug: 'protect-email-privacy',
      title: 'How to Protect Your Email Privacy and Security',
      description: 'Learn how to use temporary emails to protect your personal privacy, avoid spam harassment, and ensure email account security with this complete guide.',
      date: '2025-01-15',
      author: 'TmpMail Team',
      tags: ['Privacy Protection', 'Email Security', 'Temporary Email', 'Cybersecurity'],
      category: 'Security Guide',
      lang: 'en',
      featured: true,
      readingTime: '5 min read',
      seo: {
        keywords: 'temporary email,privacy protection,email security,spam protection,cybersecurity',
        ogImage: '/blog/images/email-privacy.jpg',
      },
    },
  ],
  ja: [],
};

// 获取指定语言的所有文章
export async function getAllPosts(lang: string = 'zh'): Promise<BlogPostMeta[]> {
  try {
    const posts = POSTS_MANIFEST[lang] || [];
    // 按日期排序，最新的在前
    return [...posts].sort((a: BlogPostMeta, b: BlogPostMeta) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error reading posts for language ${lang}:`, error);
    return [];
  }
}

// 根据 slug 获取单篇文章的元数据
export async function getPostMeta(slug: string, lang: string = 'zh'): Promise<BlogPostMeta | null> {
  try {
    const posts = POSTS_MANIFEST[lang] || [];
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting post meta: ${slug} (${lang})`, error);
    return null;
  }
}

// 根据 slug 获取单篇文章（包含内容）
export async function getPostBySlug(slug: string, lang: string = 'zh'): Promise<BlogPost> {
  const meta = await getPostMeta(slug, lang);
  if (!meta) {
    throw new Error(`Post not found: ${slug} (${lang})`);
  }

  // 这里返回不包含实际内容的元数据
  // 实际内容将通过 MDX 组件动态加载
  return {
    ...meta,
    content: '', // 内容由 MDX 组件提供
  };
}

// 获取所有可用的文章 slug（用于静态路由生成）
export async function getAllPostSlugs(): Promise<{ slug: string; lang: string }[]> {
  const allSlugs: { slug: string; lang: string }[] = [];
  
  Object.entries(POSTS_MANIFEST).forEach(([lang, posts]) => {
    posts.forEach(post => {
      allSlugs.push({ slug: post.slug, lang });
    });
  });
  
  return allSlugs;
}

// 获取热门文章
export async function getFeaturedPosts(lang: string = 'zh', limit: number = 3): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts(lang);
  return allPosts.filter(post => post.featured).slice(0, limit);
}

// 按标签获取文章
export async function getPostsByTag(tag: string, lang: string = 'zh'): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts(lang);
  return allPosts.filter(post => post.tags.includes(tag));
}

// 按分类获取文章
export async function getPostsByCategory(category: string, lang: string = 'zh'): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts(lang);
  return allPosts.filter(post => post.category === category);
}

// 获取所有标签
export async function getAllTags(lang: string = 'zh'): Promise<string[]> {
  const allPosts = await getAllPosts(lang);
  const tags = new Set<string>();
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// 获取所有分类
export async function getAllCategories(lang: string = 'zh'): Promise<string[]> {
  const allPosts = await getAllPosts(lang);
  const categories = new Set<string>();
  allPosts.forEach(post => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories).sort();
}