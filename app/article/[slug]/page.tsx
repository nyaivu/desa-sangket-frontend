import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug } from "@/lib/supabase"; // Adjust path as needed
import { getMDXComponents } from "@/components/MDXComponents"; // Adjust path as needed
import Image from "next/image";

// Define the type for the page component's props
interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // Fetch data using the type-safe function
  const unwrappedParams = await params;
  const article = await getArticleBySlug(unwrappedParams.slug);

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">404 - Article Not Found</h1>
        <p className="text-gray-500">
          Could not find article with slug: {params.slug}
        </p>
      </div>
    );
  }

  // Use the article's title for the page title
  const { title, content, image_url } = article;

  // Renders the MDX content using the components defined in mdx-components.tsx
  return (
    <article className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{title}</h1>
      <Image
        src={article.image_url}
        width={400}
        height={400}
        alt="Article Image"
      />
      <div className="text-md leading-relaxed text-gray-800">
        <MDXRemote source={content} components={getMDXComponents()} />
      </div>
    </article>
  );
}
