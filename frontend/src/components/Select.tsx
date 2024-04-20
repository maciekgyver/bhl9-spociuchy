import clsx from "clsx";
import React from "react";
import { SelectHTMLAttributes } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef(
  ({ className, options, ...props }: SelectProps, ref: any) => {
    return (
      <select
        className={clsx("w-full p-2 rounded-xl", className)}
        ref={ref}
        {...props}
      >
        {options.map(({ value, label }, index) => (
          <option key={`${value}-${index}`} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
);
