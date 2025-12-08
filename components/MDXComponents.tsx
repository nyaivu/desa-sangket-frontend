import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { JSX } from "react";

type HeadingProps = JSX.IntrinsicElements["h1"];
type ParagraphProps = JSX.IntrinsicElements["p"];
type AnchorProps = JSX.IntrinsicElements["a"];
type ImageElementProps = JSX.IntrinsicElements["img"];

// TypeScript interface for the custom code block component
interface CodeProps {
  className?: string;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeProps> = ({ className, children }) => {
  // children is often an array of strings/elements; we ensure it's a single string
  const codeString = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");

  return match ? (
    <SyntaxHighlighter
      style={dark}
      language={match[1]}
      PreTag="div" // Use div instead of pre to allow next-mdx-remote to handle it
    >
      {codeString}
    </SyntaxHighlighter>
  ) : (
    <code className={className}>{children}</code>
  );
};

// A simple custom component for MDX
const CustomAlert: React.FC<{
  type: "info" | "warning";
  children: React.ReactNode;
}> = ({ children, type }) => (
  <div
    className={`p-4 my-4 rounded-lg border-l-4 ${
      type === "warning"
        ? "bg-yellow-100 border-yellow-500 text-yellow-700"
        : "bg-blue-100 border-blue-500 text-blue-700"
    }`}
  >
    {children}
  </div>
);

export function getMDXComponents(
  components: MDXComponents = {}
): MDXComponents {
  return {
    // FIX: Explicitly define the props type for each element
    h1: (props: HeadingProps) => (
      <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
    ),
    p: (props: ParagraphProps) => (
      <p className="mb-4 text-lg text-gray-700" {...props} />
    ),

    // NOTE: We must safely handle the `href` property on the <a> tag
    a: ({ href, ...props }: AnchorProps) => (
      <Link
        href={href ?? "#"}
        className="text-blue-600 hover:underline"
        {...props}
      />
    ),

    // NOTE: The Next.js Image component needs width/height/alt, which are often provided by MDX
    img: ({
      src,
      alt,
      width: incomingWidth,
      height: incomingHeight,
      ...props
    }: ImageElementProps) => (
      <Image
        // Cast src to string. We assert that the dynamically fetched value is a URL string.
        src={(src as string) ?? ""}
        alt={alt || "article image"}
        width={800}
        height={450}
        className="rounded-lg my-6"
        {...props}
      />
    ),

    code: CodeBlock,
    CustomAlert,

    // Merge with the optional components passed in
    ...components,
  };
}
