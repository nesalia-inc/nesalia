"use client";

import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { useState, useEffect } from "react";

import { Code } from "./code";
import { cn } from "@/lib/utils";

import React from "react";
import Image from "next/image";

const sharedComponents = {
  pre: ({ children }: { children: React.ReactNode }) =>
    children as React.ReactElement,
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const isInlineCode = !className;
    if (isInlineCode) {
      return (
        <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {children}
        </code>
      );
    }

    const language = className?.replace("language-", "");
    return <Code language={language}>{children as string}</Code>;
  },
  p: ({ children }: { children: React.ReactNode }) => {
    if (
      React.Children.toArray(children).some(
        (child) =>
          React.isValidElement(child) &&
          /^(pre|div|table)$/.test(
            (child.type as any)?.name || child.type || ""
          )
      )
    ) {
      return <>{children}</>;
    }
    return <p className="leading-7 not-first:mt-6">{children}</p>;
  },
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  ),
  img: ({
    src,
    alt,
    className,
  }: {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
  }) => {
    if (!src) return null;
    return (
      <Image
        src={src}
        alt={alt || ""}
        className={cn("rounded-lg", className)}
        width={800}
        height={400}
      />
    );
  },
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight mt-8 mb-4"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2"
      {...props}
    >
      {children}
    </h4>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return (
        <a
          href={href}
          className="underline underline-offset-4 hover:text-primary"
          {...props}
        >
          {children}
        </a>
      );
    }
    if (href?.startsWith("#")) {
      return <a href={href} {...props}>{children}</a>;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-primary"
        {...props}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-8 border-border" />,
};

interface MDXProps {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXContent({ source, components }: MDXProps) {
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    async function compileAndRender() {
      try {
        const compiledMDX = await evaluate(source, {
          ...runtime,
          useMDXComponents: () => ({ ...sharedComponents, ...components }),
        });
        setMDXComponent(() => compiledMDX.default);
      } catch (error) {
        console.error("MDX compilation error:", error);
      }
    }
    compileAndRender();
  }, [source, components]);

  if (!MDXComponent) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return <MDXComponent />;
}
