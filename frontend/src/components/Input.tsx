import clsx from "clsx";
import React from "react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

export const Input = React.forwardRef(
  ({ className, error, ...props }: InputProps, ref: any) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={clsx(
            "w-full p-2 rounded-xl transition-all",
            {
              "border border-red-600 outline outline-red-600": !!error,
            },
            className
          )}
          placeholder="Type a question..."
          {...props}
        />
        {error && <p className="text-red-600">{error}</p>}
      </div>
    );
  }
);
