import { HTMLAttributes, ReactNode } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
}

export const Title = ({ children, as: Tag = "h2", className = "", ...props }: TitleProps) => {
  const styles = {
    h1: "text-4xl md:text-6xl font-bold",
    h2: "text-3xl md:text-4xl font-bold",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
  };

  return (
    <Tag className={`${styles[Tag]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};
