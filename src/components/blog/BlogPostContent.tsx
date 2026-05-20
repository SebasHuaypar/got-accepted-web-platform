import Image from "next/image";
import Link from "next/link";
import { Title } from "@/components/ui/Title";
import { FiClock, FiShare2, FiBookmark } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface BlogPostContentProps {
  post: {
    title: string;
    excerpt: string;
    author: string;
    authorRole: string;
    authorAvatar?: string;
    date: string;
    readingTime: string;
    category: string;
    imageUrl: string;
    content: string;
  };
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="bg-white rounded-[2.5rem] p-4 sm:p-0">
      <header className="space-y-6 mb-12">
        <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest">
          {post.category || "Uncategorized"}
        </div>

        <Title as="h1" className="text-4xl md:text-6xl font-black text-primary leading-tight">
          {post.title || "Untitled Post"}
        </Title>

        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
          {post.excerpt || "No excerpt provided."}
        </p>

        {/* Author & metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-muted">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-muted bg-gray-100 shrink-0">
              {post.authorAvatar ? (
                <Image
                  src={post.authorAvatar}
                  alt={post.author || "Author"}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/victor_izquierda.png"
                  alt="Author fallback"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-black text-primary">{post.author || "Anonymous"}</p>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{post.authorRole || "Author"}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400 font-bold">
            <span className="flex items-center gap-2">
              <FiClock />
              {post.readingTime || "5 min read"}
            </span>
            <span>{post.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Share actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Bookmark this article"
              className="w-10 h-10 rounded-full border border-muted flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
            >
              <FiBookmark size={16} />
            </button>
            <button
              aria-label="Share this article"
              className="w-10 h-10 rounded-full border border-muted flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
            >
              <FiShare2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero image */}
      <div className="relative aspect-[16/7] rounded-[2.5rem] overflow-hidden mb-16 shadow-[0_20px_60px_-10px_rgba(31,69,148,0.15)] bg-gray-100 flex items-center justify-center text-gray-400">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title || "Post Image"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        ) : (
          <span className="font-bold uppercase tracking-widest text-sm">No Image Selected</span>
        )}
      </div>

      {/* Article body with Markdown and HTML support */}
      <div className="prose prose-lg max-w-none text-gray-700 text-lg leading-relaxed font-medium min-h-[200px]">
        {post.content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ node, ...props }) => (
                <img className="rounded-2xl shadow-md my-8" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-accent underline hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        ) : (
          <p>No content provided yet...</p>
        )}
      </div>
    </article>
  );
}
