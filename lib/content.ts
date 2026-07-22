import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Caminhos base para as pastas de conteúdo
const DEVOTIONAL_PATH = path.join(process.cwd(), "content/devocionais");
const BLOG_PATH = path.join(process.cwd(), "content/blog");
const PAGES_PATH = path.join(process.cwd(), "content/pages");

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  [key: string]: any;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  [key: string]: any;
}

export interface PageContent {
  slug: string;
  title: string;
  content: string;
  [key: string]: any;
}

// ----------------------------------------------------------------
// Funções Auxiliares para Edições (Devocionais)
// ----------------------------------------------------------------

// Retorna todas as edições ordenadas por data (mais recente primeiro)
export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(DEVOTIONAL_PATH)) {
    return [];
  }

  const files = fs.readdirSync(DEVOTIONAL_PATH);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(DEVOTIONAL_PATH, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Edição sem título",
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        content,
        ...data,
      };
    });

  // Ordena por data decrescente
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Retorna as X edições mais recentes (usado na Home)
export async function getLatestPosts(count: number): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, count);
}

// Busca uma edição específica pelo slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(DEVOTIONAL_PATH, `${slug}.mdx`);
    
    // Suporte caso salve apenas como .md
    const finalPath = fs.existsSync(filePath) 
      ? filePath 
      : path.join(DEVOTIONAL_PATH, `${slug}.md`);

    if (!fs.existsSync(finalPath)) return null;

    const fileContent = fs.readFileSync(finalPath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || "Edição sem título",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      content,
      ...data,
    };
  } catch {
    return null;
  }
}

// Paginação do feed completo (/edicoes)
export async function getPaginatedPosts(page: number, limit: number) {
  const allPosts = await getAllPosts();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    posts: allPosts.slice(startIndex, endIndex),
    totalPages: Math.ceil(allPosts.length / limit),
  };
}

// Busca posts adjacentes para navegação (Próximo e Anterior)
export async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return {
    prev: prevPost ? { slug: prevPost.slug, title: prevPost.title, description: prevPost.description } : null,
    next: nextPost ? { slug: nextPost.slug, title: nextPost.title, description: nextPost.description } : null,
  };
}

// ----------------------------------------------------------------
// Funções Auxiliares para o Blog (/content/blog)
// ----------------------------------------------------------------

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_PATH)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_PATH);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(BLOG_PATH, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Artigo sem título",
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        content,
        ...data,
      };
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getLatestBlogPosts(count: number): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.slice(0, count);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
    
    const finalPath = fs.existsSync(filePath) 
      ? filePath 
      : path.join(BLOG_PATH, `${slug}.md`);

    if (!fs.existsSync(finalPath)) return null;

    const fileContent = fs.readFileSync(finalPath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || "Artigo sem título",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      content,
      ...data,
    };
  } catch {
    return null;
  }
}

export async function getPaginatedBlogPosts(page: number, limit: number) {
  const allPosts = await getAllBlogPosts();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    posts: allPosts.slice(startIndex, endIndex),
    totalPages: Math.ceil(allPosts.length / limit),
  };
}

export async function getAdjacentBlogPosts(currentSlug: string) {
  const allPosts = await getAllBlogPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return {
    prev: prevPost ? { slug: prevPost.slug, title: prevPost.title, description: prevPost.description } : null,
    next: nextPost ? { slug: nextPost.slug, title: nextPost.title, description: nextPost.description } : null,
  };
}

// ----------------------------------------------------------------
// Funções Auxiliares para Páginas Internas (/sobre, etc)
// ----------------------------------------------------------------

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  try {
    const filePath = path.join(PAGES_PATH, `${slug}.mdx`);
    const finalPath = fs.existsSync(filePath) 
      ? filePath 
      : path.join(PAGES_PATH, `${slug}.md`);

    if (!fs.existsSync(finalPath)) return null;

    const fileContent = fs.readFileSync(finalPath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || "",
      content,
      ...data,
    };
  } catch {
    return null;
  }
}