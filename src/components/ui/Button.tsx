import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "accent" | "outline";
}

export const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer";
  const variants = {
    primary: "bg-primary text-surface hover:bg-opacity-90 shadow-md hover:shadow-lg",
    accent: "bg-accent text-surface hover:bg-opacity-90 shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-surface",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
