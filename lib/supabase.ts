import { createClient } from "@supabase/supabase-js";
import { ArticleData } from "../types/article"; // Adjust path as needed

// Initialize Supabase Client (Make sure these ENV variables are set in your .env.local file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// Note: Using the non-null assertion operator (!) assumes these env vars are defined.
// In a real app, you should check for their existence and throw an error if missing.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getArticleBySlug(
  slug: string
): Promise<ArticleData | null> {
  // We specify the columns we want to select
  const { data, error } = await supabase
    .from("articles")
    .select("title, content, slug, image_url")
    .eq("slug", slug)
    .single(); // Use single() to expect exactly one row

  if (error) {
    console.error("Supabase fetch error:", error);
    // You can handle specific PostgrestError codes here (e.g., 404 for not found)
    return null;
  }

  // Cast the result to the ArticleData type
  return data as ArticleData;
}
