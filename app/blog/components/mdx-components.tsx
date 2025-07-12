import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { CopyButton } from '~/components/copy-button';

// MDX 自定义组件
export const mdxComponents = {
  // 自定义标题，添加锚点链接
  h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, id, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800" id={id} {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, id, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800" id={id} {...props}>
      {children}
    </h3>
  ),
  
  // 段落
  p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-gray-700" {...props}>
      {children}
    </p>
  ),
  
  // 链接
  a: ({ children, href, ...props }: React.HTMLProps<HTMLAnchorElement>) => (
    <a 
      href={href}
      className="text-blue-600 hover:text-blue-800 underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  
  // 列表
  ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => (
    <ul className="mb-4 space-y-2 list-disc list-inside text-gray-700" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <ol className="mb-4 space-y-2 list-decimal list-inside text-gray-700" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
    <li className="leading-6" {...props}>
      {children}
    </li>
  ),
  
  // 代码块
  pre: ({ children, ...props }: React.HTMLProps<HTMLPreElement>) => (
    <div className="relative mb-4">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
        {children}
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton 
          text={typeof children === 'string' ? children : ''}
          size="sm"
          variant="secondary"
        />
      </div>
    </div>
  ),
  
  // 行内代码
  code: ({ children, className, ...props }: React.HTMLProps<HTMLElement>) => {
    // 如果有 className，说明是代码块内的代码
    if (className) {
      return <code className={className} {...props}>{children}</code>;
    }
    // 否则是行内代码
    return (
      <code 
        className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  
  // 引用块
  blockquote: ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // 表格
  table: ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
    <div className="mb-4 overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  
  th: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <td className="px-4 py-2 text-gray-700 border-b border-gray-200" {...props}>
      {children}
    </td>
  ),
  
  // 图片
  img: ({ src, alt, ...props }: React.HTMLProps<HTMLImageElement>) => (
    <img 
      src={src}
      alt={alt}
      className="rounded-lg shadow-md mb-4 max-w-full h-auto"
      loading="lazy"
      {...props}
    />
  ),
};

// 自定义 Blog 组件
export const BlogAlert: React.FC<{
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}> = ({ type = 'info', title, children }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  
  return (
    <Card className={`mb-4 border-l-4 ${styles[type]}`}>
      <CardContent className="pt-4">
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        <div>{children}</div>
      </CardContent>
    </Card>
  );
};

export const BlogHighlight: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Card className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
    <CardContent className="pt-4">
      {children}
    </CardContent>
  </Card>
);

export const BlogTip: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-start gap-3">
      <span className="text-yellow-600 text-lg">💡</span>
      <div className="text-yellow-800">{children}</div>
    </div>
  </div>
);

// 将自定义组件添加到 MDX 组件中
export const allMdxComponents = {
  ...mdxComponents,
  BlogAlert,
  BlogHighlight,
  BlogTip,
};