import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "bg-surface p-2.5 rounded-lg hover:bg-brand transition-colors hover:text-background [&.active]:bg-brand [&.active]:text-background",
        className
      )}
    >
      {children}
    </button>
  );
};
