import clsx from "clsx";
import React from "react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef(
  ({ className, ...props }: InputProps, ref: any) => {
    return (
      <input
        ref={ref}
        className={clsx("w-full p-2 rounded-xl", className)}
        placeholder="Type a question..."
        {...props}
      />
    );
  }
);
