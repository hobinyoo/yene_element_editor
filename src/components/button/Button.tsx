import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: ReactNode;
  type?: "submit" | "button";
}

export const Button = ({
  className,
  children,
  type = "button",
  onClick,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type={type} className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
